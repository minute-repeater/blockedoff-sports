import { kv } from "@vercel/kv";
import { ProToken } from "./types";

export interface TokenValidation {
  valid: boolean;
  token?: ProToken;
  error?: string;
}

export async function validateProToken(
  tokenStr: string | null,
  clientIp: string
): Promise<TokenValidation> {
  if (!tokenStr) {
    return { valid: false, error: "No token" };
  }

  let raw: string | null;
  try {
    raw = await kv.get(`token:${tokenStr}`);
  } catch {
    // KV unavailable — degrade to free
    return { valid: false, error: "KV unavailable" };
  }

  if (!raw) {
    return { valid: false, error: "Invalid token" };
  }

  const tokenData: ProToken =
    typeof raw === "string" ? JSON.parse(raw) : (raw as ProToken);

  // Check expiry
  if (new Date(tokenData.expiresAt) < new Date()) {
    return { valid: false, error: "Token expired" };
  }

  // Rate limit: max 5 unique IPs per token per day
  const today = new Date().toISOString().split("T")[0];
  const ipKey = `ip:${tokenStr}:${today}`;

  try {
    const existingIps: string[] =
      ((await kv.get(ipKey)) as string[]) || [];

    if (!existingIps.includes(clientIp)) {
      if (existingIps.length >= 5) {
        return { valid: false, error: "Too many devices" };
      }
      existingIps.push(clientIp);
      await kv.set(ipKey, existingIps);
      await kv.expire(ipKey, 86400);
    }
  } catch {
    // Rate limit check failed — still allow the request
  }

  return { valid: true, token: tokenData };
}
