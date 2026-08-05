import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { AppUser } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { verifyPassword } from "@/lib/password";
import { createSessionToken, getAuthCookieOptions } from "@/lib/auth";
import { AUTH_COOKIE_NAME } from "@/lib/auth-config";
import { isGoogleOnlyPasswordHash } from "@/lib/google-auth";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const [user] = await db
      .select()
      .from(AppUser)
      .where(eq(AppUser.email, normalizedEmail))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    if (isGoogleOnlyPasswordHash(user.passwordHash)) {
      return NextResponse.json({ error: "This account uses Google sign-in. Please continue with Google." }, { status: 401 });
    }

    if (!verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    const token = await createSessionToken(sessionUser);
    const response = NextResponse.json({ user: sessionUser });
    response.cookies.set(AUTH_COOKIE_NAME, token, getAuthCookieOptions());

    return response;
  } catch (error) {
    console.error("Signin failed:", error);
    return NextResponse.json({ error: "Unable to sign in right now." }, { status: 500 });
  }
}
