CREATE TABLE IF NOT EXISTS "app_user" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" varchar NOT NULL,
  "email" varchar NOT NULL,
  "passwordHash" text NOT NULL,
  "createdAt" varchar NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "app_user_email_idx" ON "app_user" ("email");
