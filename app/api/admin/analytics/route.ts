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

    // Vehicle breakdown
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

    // Top routes
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

    return NextResponse.json({
      metrics: {
        totalBookings,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        avgFare: Math.round(avgFare * 100) / 100,
        completedCount,
        upcomingCount,
      },
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
