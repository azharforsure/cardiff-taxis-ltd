import { cookies } from "next/headers";
import crypto from "crypto";
import prisma from "./prisma";

const COOKIE_NAME = "ctl_admin_session";
const SECRET = process.env.ADMIN_SESSION_SECRET || "cardiff_taxisltd_portal_secret_session_key_2026";

// Simple signed token: userId.timestamp.hmac
export function createSessionToken(userId: string): string {
  const timestamp = Date.now().toString();
  const data = `${userId}:${timestamp}`;
  const hmac = crypto.createHmac("sha256", SECRET).update(data).digest("hex");
  return `${data}:${hmac}`;
}

export function verifySessionToken(token: string): string | null {
  try {
    const parts = token.split(":");
    if (parts.length !== 3) return null;
    const [userId, timestamp, signature] = parts;

    // Check expiry (30 days)
    const ageMs = Date.now() - parseInt(timestamp, 10);
    if (isNaN(ageMs) || ageMs < 0 || ageMs > 30 * 24 * 60 * 60 * 1000) {
      return null;
    }

    const data = `${userId}:${timestamp}`;
    const expected = crypto.createHmac("sha256", SECRET).update(data).digest("hex");
    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      return userId;
    }
    return null;
  } catch {
    return null;
  }
}

export async function getCurrentAdmin() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const userId = verifySessionToken(token);
    if (!userId) return null;

    const user = await prisma.adminUser.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true, active: true },
    });

    if (!user || !user.active) return null;
    return user;
  } catch {
    return null;
  }
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
