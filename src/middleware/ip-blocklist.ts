// ── IP Blocklist ──────────────────────────────────────────────────────────────
// IP engelleme + in-memory cache + DB senkronizasyonu

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/database";
import { IP_BLOCK_CACHE_TTL } from "./constants";

// In-memory cache — her request'te DB sorgusu yapmamak için
const ipBlockCache = new Map<string, { blocked: boolean; ts: number }>();

export function invalidateIpBlockCache(ip: string) {
  ipBlockCache.delete(ip);
}

// Cleanup — her 5 dakikada bir expired entry'leri temizle
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of ipBlockCache.entries()) {
    if (now - value.ts > IP_BLOCK_CACHE_TTL) {
      ipBlockCache.delete(key);
    }
  }
}, 5 * 60 * 1000).unref();

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

async function logSecurityEvent(
  request: NextRequest,
  ip: string,
  pathname: string,
  eventType: string,
  severity: string
) {
  fetch(new URL("/api/internal/security-log", request.url).toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-internal-key": process.env.BOT_API_KEY || "" },
    body: JSON.stringify({
      eventType,
      ipAddress: ip,
      userAgent: request.headers.get("user-agent") || "",
      endpoint: pathname,
      severity,
      isBlocked: true,
    }),
  }).catch(() => {});
}

export async function handleIpBlocklist(
  request: NextRequest
): Promise<{ ip: string; blocked: boolean }> {
  const ip = getClientIp(request);
  const pathname = request.nextUrl.pathname;

  if (ip === "unknown") return { ip, blocked: false };

  const now = Date.now();
  const cached = ipBlockCache.get(ip);

  // Cache'te varsa DB'ye gitme
  if (cached && now - cached.ts < IP_BLOCK_CACHE_TTL) {
    if (cached.blocked) {
      logSecurityEvent(request, ip, pathname, "unauthorized_access", "high");
      return { ip, blocked: true };
    }
    return { ip, blocked: false };
  }

  // Cache yok veya süresi dolmus — DB'ye sor
  try {
    const result = await Promise.race([
      pool.query(
        "SELECT id, reason, is_permanent, expires_at FROM ip_blocklist WHERE ip_address = $1",
        [ip]
      ),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), 2000)),
    ]);

    let isBlocked = false;
    if (result.rows.length > 0) {
      const block = result.rows[0];
      const isExpired = !block.is_permanent && block.expires_at && new Date() > new Date(block.expires_at);
      isBlocked = !isExpired;
    }

    ipBlockCache.set(ip, { blocked: isBlocked, ts: now });

    if (isBlocked) {
      logSecurityEvent(request, ip, pathname, "unauthorized_access", "high");
      return { ip, blocked: true };
    }
  } catch (error) {
    console.error("[Middleware] IP blocklist check failed:", error);
  }

  return { ip, blocked: false };
}

// ── Otomatik Engelleme (DDoS) ───────────────────────────────────────────────
export function autoBlockIp(ip: string, reason: string) {
  const autoBlockUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);
  pool
    .query(
      `INSERT INTO ip_blocklist (ip_address, reason, is_permanent, expires_at)
       VALUES ($1, $2, false, $3)
       ON CONFLICT (ip_address) DO UPDATE
         SET reason = EXCLUDED.reason,
             expires_at = gREATEST(ip_blocklist.expires_at, EXCLUDED.expires_at)`,
      [ip, reason, autoBlockUntil]
    )
    .then(() => {
      ipBlockCache.set(ip, { blocked: true, ts: Date.now() });
    })
    .catch((err) => {
      console.error("[Middleware] Auto-block DB write failed:", err?.message);
    });
}

// ── Sahte UA Engelleme ──────────────────────────────────────────────────────
export function blockFakeUa(ip: string, ua: string) {
  pool
    .query(
      `INSERT INTO ip_blocklist (ip_address, reason, is_permanent, expires_at)
       VALUES ($1, $2, false, $3)
       ON CONFLICT (ip_address) DO UPDATE
         SET reason = EXCLUDED.reason,
             expires_at = gREATEST(ip_blocklist.expires_at, EXCLUDED.expires_at)`,
      [ip, `Sahte tarayıcı UA: ${ua.slice(0, 100)}`, new Date(Date.now() + 24 * 60 * 60 * 1000)]
    )
    .then(() => {
      ipBlockCache.set(ip, { blocked: true, ts: Date.now() });
    })
    .catch(() => {});
}
