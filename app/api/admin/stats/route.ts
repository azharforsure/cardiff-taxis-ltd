import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin-auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const todayStr = new Date().toISOString().split("T")[0];

    const [
      totalBookings,
      todayBookings,
      needsDriverCount,
      activeDriversCount,
      allCompletedOrConfirmed,
      recentBookings,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({
        where: { pickupDate: todayStr },
      }),
      prisma.booking.count({
        where: {
          driverId: null,
          status: { in: ["CONFIRMED", "PENDING"] },
        },
      }),
      prisma.driver.count({
        where: { active: true },
      }),
      prisma.booking.findMany({
        where: {
          paymentStatus: "PAID",
        },
        select: { price: true, pickupDate: true },
      }),
      prisma.booking.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: {
          driver: { select: { name: true, callsign: true, phone: true } },
        },
      }),
    ]);

    const totalRevenue = allCompletedOrConfirmed.reduce(
      (sum, b) => sum + (b.price || 0),
      0
    );

    const todayRevenue = allCompletedOrConfirmed
      .filter((b) => b.pickupDate === todayStr)
      .reduce((sum, b) => sum + (b.price || 0), 0);

    return NextResponse.json({
      todayStr,
      metrics: {
        totalBookings,
        todayBookings,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        todayRevenue: Math.round(todayRevenue * 100) / 100,
        needsDriverCount,
        activeDriversCount,
      },
      recentBookings,
    });
  } catch (error: any) {
    console.error("Failed to load admin stats:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard statistics." },
      { status: 500 }
    );
  }
}
