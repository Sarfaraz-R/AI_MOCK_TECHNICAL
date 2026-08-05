import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, JWT_SECRET } from "@/lib/auth-config";
import { verifyJwt } from "@/lib/auth-jwt";

const protectedPrefixes = ["/dashboard", "/forum"];

function isProtectedRoute(pathname) {
  return protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export async function middleware(request) {
  const { pathname, search } = request.nextUrl;

  if (!isProtectedRoute(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const payload = await verifyJwt(token || "", JWT_SECRET);

  if (payload) {
    return NextResponse.next();
  }

  const signInUrl = new URL("/sign-in", request.url);
  signInUrl.searchParams.set("redirect_url", `${pathname}${search}`);

  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
