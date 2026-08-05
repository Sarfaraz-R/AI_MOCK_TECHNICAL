import moment from "moment";
import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { AppUser } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { AUTH_COOKIE_NAME, GOOGLE_STATE_COOKIE_NAME } from "@/lib/auth-config";
import { createSessionToken, getAuthCookieOptions } from "@/lib/auth";
import { getGoogleOAuthConfig, getGoogleOnlyPasswordHash } from "@/lib/google-auth";

export async function GET(request) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const storedStateCookie = request.cookies.get(GOOGLE_STATE_COOKIE_NAME)?.value;

  if (!code || !state || !storedStateCookie) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  let storedState;
  try {
    storedState = JSON.parse(storedStateCookie);
  } catch {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (storedState.state !== state) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  try {
    const { clientId, clientSecret, redirectUri } = getGoogleOAuthConfig();

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
      cache: "no-store",
    });

    if (!tokenResponse.ok) {
      throw new Error("Google token exchange failed.");
    }

    const tokenData = await tokenResponse.json();
    const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
      cache: "no-store",
    });

    if (!profileResponse.ok) {
      throw new Error("Google user profile request failed.");
    }

    const profile = await profileResponse.json();
    const normalizedEmail = profile.email?.toLowerCase().trim();

    if (!normalizedEmail) {
      throw new Error("Google account email is missing.");
    }

    let [user] = await db.select().from(AppUser).where(eq(AppUser.email, normalizedEmail)).limit(1);

    if (!user) {
      [user] = await db
        .insert(AppUser)
        .values({
          name: profile.name || normalizedEmail.split("@")[0],
          email: normalizedEmail,
          passwordHash: getGoogleOnlyPasswordHash(profile.sub),
          createdAt: moment().format("YYYY-MM-DD"),
        })
        .returning({
          id: AppUser.id,
          name: AppUser.name,
          email: AppUser.email,
          passwordHash: AppUser.passwordHash,
        });
    }

    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    const token = await createSessionToken(sessionUser);
    const redirectDestination = storedState.redirectUrl || "/dashboard";
    const response = NextResponse.redirect(new URL(redirectDestination, request.url));

    response.cookies.set(AUTH_COOKIE_NAME, token, getAuthCookieOptions());
    response.cookies.set(GOOGLE_STATE_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("Google auth failed:", error);
    return NextResponse.redirect(new URL("/sign-in?error=google_auth_failed", request.url));
  }
}
