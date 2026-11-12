import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getCurrentAdmin } from "@/lib/admin-auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [bookingCount, driverCount, pricingCount] = await Promise.all([
      prisma.booking.count(),
      prisma.driver.count(),
      prisma.pricingSetting.count(),
    ]);

    return NextResponse.json({
      admin,
      system: {
        database: "Hostinger MySQL (Connected)",
        databaseHost: "srv1987.hstgr.io",
        totalBookings: bookingCount,
        totalDrivers: driverCount,
        pricingKeys: pricingCount,
        businessName: "Cardiff Taxis Ltd",
        businessPhone: "029 2045 4545",
        businessEmail: "bookings@cardifftaxisltd.co.uk",
        registeredOffice: "Cardiff Central Station, Cardiff, CF10 1EP",
      },
    });
  } catch (error: any) {
    console.error("Settings fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword, name } = await req.json();

    const user = await prisma.adminUser.findUnique({
      where: { id: admin.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updates: any = {};
    if (name) updates.name = name.trim();

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required to set a new password." },
          { status: 400 }
        );
      }
      const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isMatch) {
        return NextResponse.json(
          { error: "Current password does not match." },
          { status: 400 }
        );
      }
      updates.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await prisma.adminUser.update({
      where: { id: admin.id },
      data: updates,
      select: { id: true, email: true, name: true, role: true },
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Settings update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile settings." },
      { status: 500 }
    );
  }
}
