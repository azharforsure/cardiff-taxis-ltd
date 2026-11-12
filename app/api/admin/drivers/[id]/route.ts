import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin-auth";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { name, phone, email, callsign, vehicleMake, vehiclePlate, vehicleType, status, active } = body;

    const data: any = {};
    if (name !== undefined) data.name = name;
    if (phone !== undefined) data.phone = phone;
    if (email !== undefined) data.email = email;
    if (callsign !== undefined) data.callsign = callsign;
    if (vehicleMake !== undefined) data.vehicleMake = vehicleMake;
    if (vehiclePlate !== undefined) data.vehiclePlate = vehiclePlate;
    if (vehicleType !== undefined) data.vehicleType = vehicleType;
    if (status !== undefined) data.status = status;
    if (active !== undefined) data.active = active;

    const updated = await prisma.driver.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, driver: updated });
  } catch (error: any) {
    console.error("Update driver error:", error);
    return NextResponse.json(
      { error: "Failed to update driver." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    // Set inactive rather than hard delete if has bookings
    const count = await prisma.booking.count({ where: { driverId: id } });
    if (count > 0) {
      await prisma.driver.update({ where: { id }, data: { active: false } });
      return NextResponse.json({
        success: true,
        message: "Driver marked as inactive because they have associated bookings.",
      });
    }

    await prisma.driver.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete driver error:", error);
    return NextResponse.json(
      { error: "Failed to delete driver." },
      { status: 500 }
    );
  }
}
