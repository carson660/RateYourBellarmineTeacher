import { createHash } from "crypto";

export function createAnonHash(ip: string, userAgent: string, salt: string): string {
  return createHash("sha256").update(`${ip}:${userAgent}:${salt}`).digest("hex");
}
