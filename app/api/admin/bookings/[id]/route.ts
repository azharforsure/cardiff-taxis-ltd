import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin-auth";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { driver: true },
  });

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  return NextResponse.json({ booking });
}

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
    const { status, driverId, notes, paymentStatus, paymentMethod } = body;

    const data: any = {};
    if (status !== undefined) data.status = status;
    if (notes !== undefined) data.notes = notes;
    if (paymentStatus !== undefined) data.paymentStatus = paymentStatus;
    if (paymentMethod !== undefined) data.paymentMethod = paymentMethod;

    if (driverId !== undefined) {
      data.driverId = driverId || null;
      if (driverId) {
        data.dispatchedAt = new Date();
        if (data.status === undefined || data.status === "PENDING" || data.status === "CONFIRMED") {
          data.status = "DISPATCHED";
        }
      }
    }

    if (status === "COMPLETED") {
      data.completedAt = new Date();
    }

    const updated = await prisma.booking.update({
      where: { id },
      data,
      include: { driver: true },
    });

    return NextResponse.json({ success: true, booking: updated });
  } catch (error: any) {
    console.error("Update booking error:", error);
    return NextResponse.json(
      { error: "Failed to update booking." },
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
    await prisma.booking.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete booking error:", error);
    return NextResponse.json(
      { error: "Failed to delete booking." },
      { status: 500 }
    );
  }
}
