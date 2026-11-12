import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin-auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const drivers = await prisma.driver.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { bookings: true },
        },
      },
    });

    return NextResponse.json({ drivers });
  } catch (error: any) {
    console.error("Drivers fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch drivers list." },
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
    const { name, phone, email, callsign, vehicleMake, vehiclePlate, vehicleType, status } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Driver name and phone number are required." },
        { status: 400 }
      );
    }

    const driver = await prisma.driver.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        email: email?.trim() || null,
        callsign: callsign?.trim() || null,
        vehicleMake: vehicleMake?.trim() || null,
        vehiclePlate: vehiclePlate?.trim() || null,
        vehicleType: vehicleType || "Saloon",
        status: status || "AVAILABLE",
        active: true,
      },
    });

    return NextResponse.json({ success: true, driver });
  } catch (error: any) {
    console.error("Create driver error:", error);
    return NextResponse.json(
      { error: "Failed to add driver." },
      { status: 500 }
    );
  }
}
