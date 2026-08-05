import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

export function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
}

export function verifyPassword(password, storedHash) {
  const [salt, savedKey] = storedHash.split(":");
  if (!salt || !savedKey) {
    return false;
  }

  const derivedKey = scryptSync(password, salt, 64);
  const savedBuffer = Buffer.from(savedKey, "hex");

  if (derivedKey.length !== savedBuffer.length) {
    return false;
  }

  return timingSafeEqual(derivedKey, savedBuffer);
}
