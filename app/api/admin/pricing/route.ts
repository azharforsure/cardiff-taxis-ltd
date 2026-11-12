import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin-auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await prisma.pricingSetting.findMany({
      orderBy: { category: "asc" },
    });
    return NextResponse.json({ settings });
  } catch (error: any) {
    console.error("Pricing fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch pricing settings." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { updates } = body; // Array of { key, value }

    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { error: "Invalid updates format. Array expected." },
        { status: 400 }
      );
    }

    for (const item of updates) {
      if (item.key && item.value !== undefined) {
        await prisma.pricingSetting.update({
          where: { key: item.key },
          data: { value: String(item.value) },
        });
      }
    }

    return NextResponse.json({ success: true, message: "Pricing updated successfully." });
  } catch (error: any) {
    console.error("Update pricing error:", error);
    return NextResponse.json(
      { error: "Failed to save pricing settings." },
      { status: 500 }
    );
  }
}
