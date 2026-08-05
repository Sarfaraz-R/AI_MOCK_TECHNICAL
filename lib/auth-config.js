export const AUTH_COOKIE_NAME = "scribo_auth";
export const GOOGLE_STATE_COOKIE_NAME = "scribo_google_oauth_state";
export const JWT_SECRET = process.env.JWT_SECRET || "replace-with-real-jwt-secret";
export const AUTH_DURATION_DAYS = Number(process.env.JWT_EXPIRES_IN_DAYS || "7");
