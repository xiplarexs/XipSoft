/**
 * Telegram 2FA — Admin OTP Servisi
 *
 * Admin paneline giris için Telegram üzerinden OTP kodu gönderir ve dogrular.
 * OTP kodları önce Redis'te TTL ile saklanır (5 dakika).
 * Redis yoksa process-içi in-memory Map'e düser (single-instance için yeterli).
 *
 * Env degiskenleri:
 *   TELEgRAM_BOT_TOKEN     — BotFather'dan alınan token
 *   TELEgRAM_ADMIN_CHAT_ID — Admin'in kisisel Telegram chat ID'si
 */

import { getRedisClient } from "@/lib/redis";

const OTP_TTL_MS = 5 * 60 * 1000; // 5 dakika
const OTP_TTL_SECONDS = 5 * 60;
const OTP_PREFIX = "admin_2fa_otp";

// Redis yoksa process-içi fallback (serverless'ta her instance izole — kabul edilebilir)
const memoryStore = new Map<string, { otp: string; expiresAt: number }>();

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function otpKey(chatId: string): string {
  return `${OTP_PREFIX}:${chatId}`;
}

// ── OTP kaydet ────────────────────────────────────────────────────────────────

async function storeOtp(chatId: string, otp: string): Promise<void> {
  const redis = getRedisClient();
  if (redis) {
    try {
      await redis.set(otpKey(chatId), otp, { ex: OTP_TTL_SECONDS });
      return;
    } catch {
      // Redis basarısız — memory fallback'e düs
    }
  }
  memoryStore.set(chatId, { otp, expiresAt: Date.now() + OTP_TTL_MS });
}

async function retrieveOtp(chatId: string): Promise<string | null> {
  const redis = getRedisClient();
  if (redis) {
    try {
      const val = await redis.get<string>(otpKey(chatId));
      if (val !== null) return val;
      // Redis bos dönüyorsa memory'e bak (recovery senaryosu)
    } catch {
      // Redis hatalı — memory fallback
    }
  }
  const entry = memoryStore.get(chatId);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memoryStore.delete(chatId);
    return null;
  }
  return entry.otp;
}

async function deleteOtp(chatId: string): Promise<void> {
  const redis = getRedisClient();
  if (redis) {
    try { await redis.del(otpKey(chatId)); } catch {}
  }
  memoryStore.delete(chatId);
}

// ── Telegram üzerinden OTP gönder ────────────────────────────────────────────

export async function sendTelegramAdmin2faOtp(
  chatId: string
): Promise<{ success: boolean; error?: string }> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return { success: false, error: "TELEGRAM_BOT_TOKEN eksik" };

  const otp = generateOtp();

  // OTP'yi kaydet (Redis veya memory)
  await storeOtp(chatId, otp);

  const text = [
    "🔐 <b>XipSoft Admin — 2FA Kodu</b>",
    "",
    `Kodunuz: <code>${otp}</code>`,
    "",
    "⏱ 5 dakika geçerlidir.",
    "<i>Bu kodu kimseyle paylasmayın.</i>",
  ].join("\n");

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
      }
    );
    const json = await res.json();
    if (!json.ok) {
      return { success: false, error: json.description ?? "Telegram hatası" };
    }
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Telegram baglantı hatası",
    };
  }
}

// ── OTP dogrula ──────────────────────────────────────────────────────────────

export async function verifyTelegramAdmin2faOtp(
  chatId: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  const stored = await retrieveOtp(chatId);

  if (!stored) {
    return { success: false, error: "Kod süresi dolmus veya bulunamadı" };
  }

  // Sabit zamanlı karsılastırma
  const incoming = code.trim();
  const match =
    incoming.length === stored.length &&
    incoming.split("").every((ch, i) => ch === stored[i]);

  if (!match) {
    return { success: false, error: "Kod hatalı" };
  }

  // Kullanıldıktan sonra sil — tekrar kullanıma karsı
  await deleteOtp(chatId);
  return { success: true };
}
