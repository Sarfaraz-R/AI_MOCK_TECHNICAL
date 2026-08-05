import { NextResponse } from "next/server";
import { GOOGLE_STATE_COOKIE_NAME } from "@/lib/auth-config";
import { getGoogleOAuthConfig } from "@/lib/google-auth";

export async function GET(request) {
  const { clientId, redirectUri } = getGoogleOAuthConfig();
  const state = crypto.randomUUID();
  const redirectUrl = request.nextUrl.searchParams.get("redirect_url") || "/dashboard";

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("prompt", "select_account");
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("access_type", "offline");

  const response = NextResponse.redirect(authUrl);
  response.cookies.set(GOOGLE_STATE_COOKIE_NAME, JSON.stringify({ state, redirectUrl }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 10 * 60,
  });

  return response;
}
