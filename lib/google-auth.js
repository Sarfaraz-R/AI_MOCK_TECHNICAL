export const GOOGLE_ONLY_PREFIX = "__GOOGLE_AUTH_ONLY__:";

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

export function getGoogleOAuthConfig() {
  return {
    clientId: process.env.GOOGLE_CLIENT_ID || "replace-with-google-client-id",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "replace-with-google-client-secret",
    redirectUri:
      process.env.GOOGLE_REDIRECT_URI ||
      `${getBaseUrl()}/api/auth/google/callback`,
  };
}

export function getGoogleOnlyPasswordHash(googleSubject) {
  return `${GOOGLE_ONLY_PREFIX}${googleSubject}`;
}

export function isGoogleOnlyPasswordHash(passwordHash) {
  return typeof passwordHash === "string" && passwordHash.startsWith(GOOGLE_ONLY_PREFIX);
}
