import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin-auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const allBookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        driver: { select: { name: true, callsign: true } },
      },
    });

    const totalBookings = allBookings.length;
    const paidBookings = allBookings.filter((b) => b.paymentStatus === "PAID");
    const totalRevenue = paidBookings.reduce((sum, b) => sum + (b.price || 0), 0);
    const avgFare = totalBookings > 0 ? totalRevenue / (paidBookings.length || 1) : 0;

    const completedCount = allBookings.filter(
      (b) => b.status === "COMPLETED"
    ).length;
    const upcomingCount = allBookings.filter((b) =>
      ["CONFIRMED", "PENDING", "DISPATCHED"].includes(b.status)
    ).length;

    // 1. Vehicle breakdown
    const vehicleBreakdown: Record<string, { count: number; revenue: number }> =
      {};
    for (const b of allBookings) {
      const v = b.vehicleType || "Saloon";
      if (!vehicleBreakdown[v]) vehicleBreakdown[v] = { count: 0, revenue: 0 };
      vehicleBreakdown[v].count += 1;
      if (b.paymentStatus === "PAID") {
        vehicleBreakdown[v].revenue += b.price || 0;
      }
    }

    // 2. Top routes
    const routeBreakdown: Record<string, { count: number; revenue: number }> =
      {};
    for (const b of allBookings) {
      let routeLabel = "Local Cardiff";
      const drop = (b.dropoffAddress || "").toLowerCase();
      const pick = (b.pickupAddress || "").toLowerCase();

      if (drop.includes("bristol airport") || pick.includes("bristol airport")) {
        routeLabel = "Bristol Airport (BRS)";
      } else if (
        drop.includes("cardiff airport") ||
        pick.includes("cardiff airport")
      ) {
        routeLabel = "Cardiff Airport (CWL)";
      } else if (
        drop.includes("heathrow") ||
        pick.includes("heathrow")
      ) {
        routeLabel = "London Heathrow (LHR)";
      } else if (
        drop.includes("gatwick") ||
        pick.includes("gatwick")
      ) {
        routeLabel = "London Gatwick (LGW)";
      } else if (drop.includes("birmingham") || pick.includes("birmingham")) {
        routeLabel = "Birmingham Airport (BHX)";
      }

      if (!routeBreakdown[routeLabel]) {
        routeBreakdown[routeLabel] = { count: 0, revenue: 0 };
      }
      routeBreakdown[routeLabel].count += 1;
      if (b.paymentStatus === "PAID") {
        routeBreakdown[routeLabel].revenue += b.price || 0;
      }
    }

    // 3. Daily timeline (last 7-14 days series for the visual revenue chart)
    const daysMap: Record<string, { date: string; label: string; revenue: number; bookings: number }> = {};
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const iso = d.toISOString().split("T")[0];
      const label = d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
      daysMap[iso] = { date: iso, label, revenue: 0, bookings: 0 };
    }

    for (const b of allBookings) {
      const dateKey = b.pickupDate;
      if (daysMap[dateKey]) {
        daysMap[dateKey].bookings += 1;
        if (b.paymentStatus === "PAID") {
          daysMap[dateKey].revenue += b.price || 0;
        }
      } else {
        // Fallback for earlier dates in range
        const d = new Date(b.createdAt);
        const iso = d.toISOString().split("T")[0];
        if (daysMap[iso]) {
          daysMap[iso].bookings += 1;
          if (b.paymentStatus === "PAID") {
            daysMap[iso].revenue += b.price || 0;
          }
        }
      }
    }

    const timeline = Object.values(daysMap);

    // 4. Time of Day Distribution
    const timeSlots = [
      { name: "Early Morning (04:00 - 08:00)", count: 0, revenue: 0 },
      { name: "Morning Peak (08:00 - 12:00)", count: 0, revenue: 0 },
      { name: "Afternoon (12:00 - 17:00)", count: 0, revenue: 0 },
      { name: "Evening & Night (17:00 - 04:00)", count: 0, revenue: 0 },
    ];

    for (const b of allBookings) {
      const time = b.pickupTime || "12:00";
      const hour = parseInt(time.split(":")[0], 10) || 12;

      if (hour >= 4 && hour < 8) {
        timeSlots[0].count += 1;
        if (b.paymentStatus === "PAID") timeSlots[0].revenue += b.price || 0;
      } else if (hour >= 8 && hour < 12) {
        timeSlots[1].count += 1;
        if (b.paymentStatus === "PAID") timeSlots[1].revenue += b.price || 0;
      } else if (hour >= 12 && hour < 17) {
        timeSlots[2].count += 1;
        if (b.paymentStatus === "PAID") timeSlots[2].revenue += b.price || 0;
      } else {
        timeSlots[3].count += 1;
        if (b.paymentStatus === "PAID") timeSlots[3].revenue += b.price || 0;
      }
    }

    return NextResponse.json({
      metrics: {
        totalBookings,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        avgFare: Math.round(avgFare * 100) / 100,
        completedCount,
        upcomingCount,
      },
      timeline,
      timeSlots,
      vehicles: Object.entries(vehicleBreakdown).map(([name, data]) => ({
        name,
        count: data.count,
        revenue: Math.round(data.revenue * 100) / 100,
      })),
      routes: Object.entries(routeBreakdown).map(([name, data]) => ({
        name,
        count: data.count,
        revenue: Math.round(data.revenue * 100) / 100,
      })),
      bookings: allBookings,
    });
  } catch (err: any) {
    console.error("Failed to load analytics:", err);
    return NextResponse.json(
      { error: err.message || "Failed to load analytics" },
      { status: 500 }
    );
  }
}
