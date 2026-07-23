// ── Bot/DDoS Tespiti ──────────────────────────────────────────────────────────
// Saldırı araçları UA tespiti, sahte tarayıcı tespiti, DDoS esik kontrolü

import { NextRequest, NextResponse } from "next/server";
import { notifySecurityEvent } from "@/lib/notifications";
import { BOT_PATTERNS, FAKE_BROWSER_UA, DDOS_THRESHOLD, AUTO_BLOCK_THRESHOLD } from "./constants";
import { autoBlockIp, blockFakeUa } from "./ip-blocklist";

// DDoS in-memory counter
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Cleanup
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000).unref();

// ── Bot UA Kontrolü ─────────────────────────────────────────────────────────
export function handleBotDetection(
  request: NextRequest,
  ip: string,
  ua: string
): NextResponse | null {
  const pathname = request.nextUrl.pathname;

  // Bilinen saldırı araçları
  if (BOT_PATTERNS.test(ua)) {
    fetch(new URL("/api/internal/security-log", request.url).toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-internal-key": process.env.BOT_API_KEY || "" },
      body: JSON.stringify({
        eventType: "bot_detected",
        ipAddress: ip,
        userAgent: ua,
        endpoint: pathname,
        severity: "high",
        isBlocked: true,
      }),
    }).catch(() => {});
    notifySecurityEvent({
      eventType: "bot_detected",
      ipAddress: ip,
      userAgent: ua,
      endpoint: pathname,
      severity: "high",
      isBlocked: true,
    });
    return new NextResponse("Forbidden", { status: 403 });
  }

  // Sahte tarayıcı UA — sadece sayfa isteklerine uygula
  if (FAKE_BROWSER_UA.test(ua) && !pathname.startsWith("/api/")) {
    blockFakeUa(ip, ua);
    return new NextResponse("", { status: 200 });
  }

  return null;
}

// ── DDoS Hızlı Kontrol ──────────────────────────────────────────────────────
export function handleDdosProtection(ip: string): NextResponse | null {
  const ddosEntry = rateLimitStore.get(`ddos:${ip}`);

  if (ddosEntry && ddosEntry.count > DDOS_THRESHOLD) {
    if (ddosEntry.count >= AUTO_BLOCK_THRESHOLD && ip !== "unknown") {
      autoBlockIp(ip, `Otomatik engel: DDoS (${ddosEntry.count} istek/dk)`);
    }
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: {
        "Retry-After": "60",
        "X-RateLimit-Limit": String(DDOS_THRESHOLD),
        "X-RateLimit-Remaining": "0",
      },
    });
  }

  return null;
}

// ── DDoS Counter güncelle ───────────────────────────────────────────────────
export function updateDdosCounter(ip: string) {
  const now = Date.now();
  const ddosRecord = rateLimitStore.get(`ddos:${ip}`) || { count: 0, resetTime: now + 60000 };

  if (now > ddosRecord.resetTime) {
    ddosRecord.count = 1;
    ddosRecord.resetTime = now + 60000;
  } else {
    ddosRecord.count++;
  }

  rateLimitStore.set(`ddos:${ip}`, ddosRecord);
}
