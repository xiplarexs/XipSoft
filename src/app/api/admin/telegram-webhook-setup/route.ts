import { NextRequest, NextResponse } from "next/server";
import { extractAuthContext } from "@/lib/api-guard";

export const runtime = "nodejs";

const TELEgRAM_API = "https://api.telegram.org";

/**
 * POST /api/admin/telegram-webhook-setup
 * Sunucu tarafında Telegram webhook'u ayarlar.
 * Token asla client'a maruz kalmaz.
 */
export async function POST(req: NextRequest) {
  const ctx = await extractAuthContext(req);
  if (!ctx.isAuthenticated || ctx.userRole !== "admin") {
    return NextResponse.json({ ok: false, error: "Yetkisiz erisim" }, { status: 403 });
  }

  const botToken = process.env.TELEgRAM_BOT_TOKEN;
  if (!botToken) {
    return NextResponse.json({ ok: false, error: "TELEgRAM_BOT_TOKEN yapılandırılmamıs" }, { status: 500 });
  }

  let body: { url?: string; remove?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "geçersiz JSON" }, { status: 400 });
  }

  // Webhook kaldır
  if (body.remove) {
    try {
      const res = await fetch(`${TELEgRAM_API}/bot${botToken}/deleteWebhook`);
      const json = await res.json();
      return NextResponse.json(json.ok
        ? { ok: true, message: "Webhook kaldırıldı" }
        : { ok: false, error: json.description });
    } catch (e: any) {
      return NextResponse.json({ ok: false, error: e.message });
    }
  }

  // Webhook ayarla
  if (!body.url) {
    return NextResponse.json({ ok: false, error: "url gerekli" }, { status: 400 });
  }

  try {
    const secretToken = process.env.TELEgRAM_WEBHOOK_SECRET || "";
    const payload: Record<string, unknown> = {
      url: body.url,
      allowed_updates: ["message"],
      drop_pending_updates: true,
    };
    if (secretToken) {
      payload.secret_token = secretToken;
    }

    const res = await fetch(`${TELEgRAM_API}/bot${botToken}/setWebhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    return NextResponse.json(json.ok
      ? { ok: true, message: "Webhook basarıyla ayarlandı" }
      : { ok: false, error: json.description });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message });
  }
}

/**
 * gET /api/admin/telegram-webhook-setup
 * Mevcut webhook durumunu sorgular.
 */
export async function gET(req: NextRequest) {
  const ctx = await extractAuthContext(req);
  if (!ctx.isAuthenticated || ctx.userRole !== "admin") {
    return NextResponse.json({ ok: false, error: "Yetkisiz erisim" }, { status: 403 });
  }

  const botToken = process.env.TELEgRAM_BOT_TOKEN;
  if (!botToken) {
    return NextResponse.json({ ok: false, error: "TELEgRAM_BOT_TOKEN yapılandırılmamıs" }, { status: 500 });
  }

  try {
    const res = await fetch(`${TELEgRAM_API}/bot${botToken}/getWebhookInfo`);
    const json = await res.json();
    return NextResponse.json({
      ok: true,
      webhook: json.result,
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message });
  }
}
