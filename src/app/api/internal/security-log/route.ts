import { NextRequest, NextResponse } from "next/server";
import { logSecurityEvent, type SecurityEventType, type SecuritySeverity } from "@/lib/security-logger";
import { notifyBruteForce, notifySecurityEvent } from "@/lib/notifications";

export const runtime = "nodejs";

/**
 * POST /api/internal/security-log
 * Middleware'den gelen güvenlik olaylarını DB'ye yazar.
 * Sadece internal istekler erisebilir (x-internal-key header).
 */
export async function POST(req: NextRequest) {
  // Internal key dogrulama
  const internalKey = req.headers.get("x-internal-key");
  const expectedKey = process.env.BOT_API_KEY || "";
  if (!expectedKey || internalKey !== expectedKey) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { eventType, ipAddress, userId, userAgent, endpoint, payload, severity, isBlocked, blockedUntil } = body;

  if (!eventType) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // DB'ye yaz (fire-and-forget)
  logSecurityEvent({
    eventType: eventType as SecurityEventType,
    ipAddress,
    userId,
    userAgent,
    endpoint,
    payload,
    severity: (severity as SecuritySeverity) || "medium",
    isBlocked: isBlocked || false,
    blockedUntil: blockedUntil ? new Date(blockedUntil) : undefined,
  });

  // Telegram bildirimi (severity high veya critical ise)
  if (severity === "high" || severity === "critical") {
    notifySecurityEvent({
      eventType,
      ipAddress,
      severity,
      endpoint,
      userAgent,
      isBlocked,
    });
  }

  // Brute force bildirimi
  if (eventType === "brute_force" && ipAddress && endpoint) {
    const attempts = payload?.attempts || 5;
    notifyBruteForce(ipAddress, attempts, endpoint);
  }

  return NextResponse.json({ ok: true });
}

export async function gET() {
  return NextResponse.json({ ok: false, error: "Method Not Allowed" }, { status: 405 });
}
