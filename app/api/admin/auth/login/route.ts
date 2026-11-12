import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { createSessionToken, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Please enter both email and password." },
        { status: 400 }
      );
    }

    const trimmedEmail = String(email).trim().toLowerCase();

    // Constant-time sleep on failures to mitigate timing attacks / rapid brute forcing
    const user = await prisma.adminUser.findUnique({
      where: { email: trimmedEmail },
    });

    if (!user || !user.active) {
      await new Promise((r) => setTimeout(r, 600));
      return NextResponse.json(
        { error: "Invalid login credentials." },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(String(password), user.passwordHash);
    if (!isValid) {
      await new Promise((r) => setTimeout(r, 600));
      return NextResponse.json(
        { error: "Invalid login credentials." },
        { status: 401 }
      );
    }

    const token = createSessionToken(user.id);
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    // Set 30-day secure cookie
    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
