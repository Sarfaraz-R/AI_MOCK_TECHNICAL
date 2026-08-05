export const GOOGLE_ONLY_PREFIX = "__GOOGLE_AUTH_ONLY__:";

export function getGoogleOAuthConfig() {
  return {
    clientId: process.env.GOOGLE_CLIENT_ID || "replace-with-google-client-id",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "replace-with-google-client-secret",
    redirectUri:
      process.env.GOOGLE_REDIRECT_URI ||
      "http://localhost:3000/api/auth/google/callback",
  };
}

export function getGoogleOnlyPasswordHash(googleSubject) {
  return `${GOOGLE_ONLY_PREFIX}${googleSubject}`;
}

export function isGoogleOnlyPasswordHash(passwordHash) {
  return typeof passwordHash === "string" && passwordHash.startsWith(GOOGLE_ONLY_PREFIX);
}
