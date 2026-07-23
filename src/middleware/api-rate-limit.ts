// ── API Rate Limiting + Whitelist ─────────────────────────────────────────────
// API route whitelist, payload boyut kontrolü, endpoint rate limiting

import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getEndpointRateLimit, checkPayloadSize } from "@/lib/rate-limit";
import { ALLOWED_API_ROUTES } from "./constants";
import { updateDdosCounter } from "./bot-detection";

export function isAllowedApiRoute(pathname: string): boolean {
  return ALLOWED_API_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));
}

export async function handleApiRateLimit(
  request: NextRequest,
  ip: string,
  ua: string
): Promise<NextResponse | null> {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/api/")) return null;

  // Whitelist kontrolü
  if (!isAllowedApiRoute(pathname)) {
    return NextResponse.json(
      { error: "Not Found", message: "Bu API endpoint'i mevcut degil." },
      { status: 404 }
    );
  }

  // Payload boyut kontrolü
  const payloadCheck = checkPayloadSize(request, pathname);
  if (payloadCheck) return payloadCheck;

  // DDoS counter güncelle
  updateDdosCounter(ip);

  // Endpoint rate limit
  const config = getEndpointRateLimit(pathname);
  const result = await checkRateLimit(`${ip}:${pathname}`, config);

  if (!result.success) {
    fetch(new URL("/api/internal/security-log", request.url).toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-internal-key": process.env.BOT_API_KEY || "" },
      body: JSON.stringify({
        eventType: "rate_limit",
        ipAddress: ip,
        userAgent: ua,
        endpoint: pathname,
        severity: "medium",
        isBlocked: true,
      }),
    }).catch(() => {});

    return NextResponse.json(
      {
        error: "Too many requests",
        message: config.message || "Çok fazla istek gönderdiniz. Lütfen bekleyin.",
        retryAfter: Math.ceil((result.retryAfter ?? 0) / 1000),
      },
      {
        status: 429,
        headers: {
          "RateLimit-Limit": String(result.limit),
          "RateLimit-Remaining": "0",
          "Retry-After": String(Math.ceil((result.retryAfter ?? 0) / 1000)),
        },
      }
    );
  }

  return null;
}
