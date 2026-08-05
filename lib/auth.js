import { cookies } from "next/headers";
import { signJwt, verifyJwt } from "@/lib/auth-jwt";
import { AUTH_COOKIE_NAME, AUTH_DURATION_DAYS, JWT_SECRET } from "@/lib/auth-config";

export function getJwtSecret() {
  return JWT_SECRET;
}

export async function createSessionToken(user) {
  const expiresAt = Math.floor(Date.now() / 1000) + AUTH_DURATION_DAYS * 24 * 60 * 60;

  return signJwt(
    {
      sub: String(user.id),
      email: user.email,
      name: user.name,
      exp: expiresAt,
    },
    getJwtSecret()
  );
}

export async function readSessionToken(token) {
  if (!token) {
    return null;
  }

  return verifyJwt(token, getJwtSecret());
}

export async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  return readSessionToken(token);
}

export function getAuthCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: AUTH_DURATION_DAYS * 24 * 60 * 60,
  };
}
