"use server";

/**
 * Admin 2FA Server Actions
 *
 * OTP gönderimi ve dogrulama Telegram üzerinden yapılır.
 * Cihaz güven kaydı PostgreSQL'de admin_trusted_devices tablosunda tutulur.
 *
 * güvenlik notları:
 * - userId her zaman session JWT'den türetilir — client'tan güvenilmez
 * - OTP Redis'te TTL ile saklanır (5 dakika)
 * - Trusted device token'ları DB'de kullanıcıya baglıdır
 * - 2FA_VERIFIED cookie'si middleware tarafından kontrol edilir
 */

import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import pool from "@/lib/database";
import { getJwtSecret } from "@/lib/auth-config";
import {
  sendTelegramAdmin2faOtp,
  verifyTelegramAdmin2faOtp,
} from "@/lib/telegram-2fa";
import { SECURE_COOKIE_OPTIONS } from "@/lib/security";

type ActionResult = { success: boolean; error?: string };

// Session JWT'den admin userId'yi al
async function getAdminUserIdFromSession(): Promise<number | null> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("xipsoft_session")?.value;
    if (!session) return null;
    const { payload } = await jwtVerify(session, getJwtSecret());
    if (payload.role !== "admin") return null;
    const id = payload.id ?? payload.userId ?? payload.uid;
    return id ? Number(id) : null;
  } catch {
    return null;
  }
}

// Admin'in Telegram chat ID'sini DB'den al
async function getAdminChatId(userId: number): Promise<string | null> {
  try {
    const { rows } = await pool.query<{ telegram_chat_id: string | null }>(
      "SELECT telegram_chat_id FROM users WHERE id = $1 AND role = 'admin' AND deleted_at IS NULL LIMIT 1",
      [userId]
    );
    return rows[0]?.telegram_chat_id ?? null;
  } catch {
    return null;
  }
}

/**
 * Admin 2FA OTP gönder (Telegram)
 * TELEgRAM_ADMIN_CHAT_ID env varı yoksa kullanıcının DB kaydından alınır.
 */
export async function sendAdmin2faOtpAction(): Promise<ActionResult> {
  const userId = await getAdminUserIdFromSession();
  if (!userId) return { success: false, error: "geçersiz oturum" };

  // Önce env'deki sabit chat ID'yi dene, sonra DB'den al
  const chatId =
    process.env.TELEGRAM_ADMIN_CHAT_ID ?? (await getAdminChatId(userId));

  if (!chatId) {
    return {
      success: false,
      error: "Telegram Chat ID yapılandırılmamıs. Lütfen yöneticiyle iletisime geçin.",
    };
  }

  return sendTelegramAdmin2faOtp(chatId);
}

/**
 * Admin 2FA OTP dogrula
 * Basarılı dogrulama sonrası xipsoft_2fa_verified cookie'si set edilir.
 */
export async function verifyAdmin2faOtpAction(
  code: string,
  _ipFromClient: string // eski imza uyumlulugu — IP middleware'den alınır
): Promise<ActionResult> {
  // Input temizligi
  const cleanCode = String(code ?? "").replace(/\D/g, "").slice(0, 6);
  if (cleanCode.length < 4) {
    return { success: false, error: "geçersiz kod formatı" };
  }

  const userId = await getAdminUserIdFromSession();
  if (!userId) return { success: false, error: "geçersiz oturum" };

  const chatId =
    process.env.TELEGRAM_ADMIN_CHAT_ID ?? (await getAdminChatId(userId));

  if (!chatId) {
    return { success: false, error: "Telegram Chat ID yapılandırılmamıs" };
  }

  const result = await verifyTelegramAdmin2faOtp(chatId, cleanCode);
  if (!result.success) return result;

  // Dogrulama basarılı — 2FA verified cookie'si + erisim cookie'si set et
  const cookieStore = await cookies();
  cookieStore.set("xipsoft_2fa_verified", "1", {
    ...SECURE_COOKIE_OPTIONS,
    maxAge: 60 * 30, // 30 dakika
  });

  // Admin erisim cookie'sini de set et (2FA tamamlandı, erisim izni ver)
  if (!cookieStore.get("xipsoft_admin_access")) {
    cookieStore.set("xipsoft_admin_access", "1", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 8, // 8 saat
      path: "/",
    });
  }

  return { success: true };
}
