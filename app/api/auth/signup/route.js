import { NextResponse } from "next/server";
import moment from "moment";
import { db } from "@/utils/db";
import { AppUser } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "@/lib/password";
import { createSessionToken, getAuthCookieOptions } from "@/lib/auth";
import { AUTH_COOKIE_NAME } from "@/lib/auth-config";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await db.select().from(AppUser).where(eq(AppUser.email, normalizedEmail)).limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const [createdUser] = await db
      .insert(AppUser)
      .values({
        name: name.trim(),
        email: normalizedEmail,
        passwordHash: hashPassword(password),
        createdAt: moment().format("YYYY-MM-DD"),
      })
      .returning({
        id: AppUser.id,
        name: AppUser.name,
        email: AppUser.email,
      });

    const token = await createSessionToken(createdUser);
    const response = NextResponse.json({ user: createdUser });
    response.cookies.set(AUTH_COOKIE_NAME, token, getAuthCookieOptions());

    return response;
  } catch (error) {
    console.error("Signup failed:", error);
    return NextResponse.json({ error: "Unable to create account right now." }, { status: 500 });
  }
}
