import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/features/auth/server";
import { mongoDb } from "@/lib/mongodb";
import { sendVerificationEmail } from "@/features/auth/verificationEmail";

const attempts = new Map<string, { count: number; expiresAt: number }>();

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  let email: string;
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || !("email" in body) || typeof body.email !== "string") {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }
    email = body.email.trim().toLowerCase();
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const now = Date.now();
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const key = `${ip}:${email}`;
  const attempt = attempts.get(key);
  if (attempt && attempt.expiresAt > now && attempt.count >= 3) {
    return NextResponse.json({ error: "Please wait before requesting another code." }, { status: 429 });
  }
  attempts.set(key, attempt && attempt.expiresAt > now
    ? { ...attempt, count: attempt.count + 1 }
    : { count: 1, expiresAt: now + 60_000 });

  const user = await mongoDb.collection("user").findOne<{ emailVerified?: boolean }>({ email });
  if (!user || user.emailVerified) return NextResponse.json({ success: true });

  let otp: string;
  try {
    otp = await auth.api.createVerificationOTP({ body: { email, type: "email-verification" } });
  } catch (error) {
    console.error("Could not create Planify email verification code", error);
    return NextResponse.json({ error: "Could not create a verification code." }, { status: 500 });
  }

  try {
    await sendVerificationEmail(email, otp);
    return NextResponse.json({ success: true });
  } catch {
    await mongoDb.collection("verification").deleteOne({ identifier: `email-verification-otp-${email}` });
    return NextResponse.json({ error: "Could not send the verification email." }, { status: 502 });
  }
}
