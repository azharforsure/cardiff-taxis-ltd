import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin-auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status") || "ALL";
    const date = searchParams.get("date") || "";

    const where: any = {};

    if (status && status !== "ALL") {
      if (status === "NEEDS_DRIVER") {
        where.driverId = null;
        where.status = { in: ["PENDING", "CONFIRMED"] };
      } else {
        where.status = status;
      }
    }

    if (date) {
      where.pickupDate = date;
    }

    if (search) {
      where.OR = [
        { bookingReference: { contains: search } },
        { customerName: { contains: search } },
        { customerPhone: { contains: search } },
        { customerEmail: { contains: search } },
        { pickupAddress: { contains: search } },
        { dropoffAddress: { contains: search } },
      ];
    }

    const bookings = await prisma.booking.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        driver: {
          select: {
            id: true,
            name: true,
            callsign: true,
            phone: true,
            vehicleMake: true,
          },
        },
      },
    });

    return NextResponse.json({ bookings });
  } catch (error: any) {
    console.error("Bookings fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings list." },
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
    const body = await req.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      pickupAddress,
      dropoffAddress,
      pickupDate,
      pickupTime,
      isReturn,
      returnDate,
      returnTime,
      vehicleType,
      passengers,
      luggage,
      price,
      flightNumber,
      notes,
      paymentMethod,
      paymentStatus,
      driverId,
    } = body;

    if (!customerName || !customerPhone || !pickupAddress || !dropoffAddress || !pickupDate || !pickupTime) {
      return NextResponse.json(
        { error: "Please fill in all required booking details (Name, Phone, Pickup, Dropoff, Date, Time)." },
        { status: 400 }
      );
    }

    // Generate readable reference: CTL-YYYYMMDD-XXXX
    const dateCode = pickupDate.replace(/-/g, "");
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const bookingReference = `CTL-${dateCode}-${randomSuffix}`;

    const newBooking = await prisma.booking.create({
      data: {
        bookingReference,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail?.trim() || "",
        pickupAddress: pickupAddress.trim(),
        dropoffAddress: dropoffAddress.trim(),
        pickupDate,
        pickupTime,
        isReturn: Boolean(isReturn),
        returnDate: isReturn ? returnDate : null,
        returnTime: isReturn ? returnTime : null,
        tripType: isReturn ? "return" : "one-way",
        vehicleType: vehicleType || "Saloon",
        passengers: Number(passengers) || 1,
        luggage: Number(luggage) || 1,
        price: Number(price) || 0,
        flightNumber: flightNumber?.trim() || null,
        notes: notes?.trim() || null,
        source: "PHONE",
        status: driverId ? "DISPATCHED" : "CONFIRMED",
        paymentMethod: paymentMethod || "cash",
        paymentStatus: paymentStatus || "UNPAID",
        driverId: driverId || null,
        dispatchedAt: driverId ? new Date() : null,
      },
      include: {
        driver: true,
      },
    });

    return NextResponse.json({ success: true, booking: newBooking });
  } catch (error: any) {
    console.error("Create manual booking error:", error);
    return NextResponse.json(
      { error: "Failed to create manual booking." },
      { status: 500 }
    );
  }
}
