"use server";

import pool from "@/lib/database";
import bcrypt from "bcryptjs";
import argon2 from "argon2";
import {
  verifySessionCookie,
  sanitizeUserInput,
  validatePasswordStrength,
} from "@/lib/security";
import { cookies } from "next/headers";
import type { PasswordActionResult, RequestPasswordResetResult } from "./types";

export async function changePasswordAction(
  currentPassword: string,
  newPassword: string
): Promise<PasswordActionResult> {
  try {
    // SECURITY FIX: userId client'tan alınmıyor — session'dan türetiliyor.
    // Önceki imza userId: number kabul ediyordu; herhangi bir authenticated kullanıcı
    // baska bir userId göndererek baskasının sifresini degistirebilirdi.
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("xipsoft_session")?.value;
    if (!sessionToken) return { success: false, error: "Oturum bulunamadı" };

    const payload = await verifySessionCookie(sessionToken);
    if (!payload?.userId) return { success: false, error: "geçersiz oturum" };

    const userId = Number(payload.userId);

    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.valid) {
      return { success: false, error: `Zayıf sifre: ${passwordValidation.errors.join(", ")}` };
    }

    const { rows } = await pool.query(
      "SELECT password_hash FROM users WHERE id = $1 AND deleted_at IS NULL",
      [userId]
    );
    if (!rows[0]) return { success: false, error: "Kullanıcı bulunamadı" };

    // Argon2 veya bcrypt (legacy) ile dogrula
    let valid = false;
    const hash = rows[0].password_hash;
    if (hash?.startsWith('$argon2')) {
      valid = await argon2.verify(hash, currentPassword);
    } else {
      valid = await bcrypt.compare(currentPassword, hash);
    }
    if (!valid) return { success: false, error: "Mevcut sifre hatalı" };

    const newHash = await argon2.hash(newPassword, { type: argon2.argon2id, memoryCost: 2 ** 16, timeCost: 3 });
    await pool.query(
      "UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2",
      [newHash, userId]
    );

    return { success: true };
  } catch (err) {
    console.error("changePasswordAction error:", err);
    return { success: false, error: "Sunucu hatası" };
  }
}

export async function verifyPasswordResetCodeAction(
  email: string,
  code: string
): Promise<PasswordActionResult> {
  try {
    const sanitizedEmail = sanitizeUserInput(email).toLowerCase();
    const { verifyTokenByCode } = await import('@/lib/db-verification');
    const isValid = await verifyTokenByCode(sanitizedEmail, code, 'password_reset');
    if (!isValid) {
      return { success: false, error: 'Kod geçersiz veya süresi dolmus' };
    }
    return { success: true };
  } catch (err) {
    console.error('verifyPasswordResetCodeAction error:', err);
    return { success: false, error: 'Sunucu hatası' };
  }
}

export async function resetPasswordAction(
  email: string,
  code: string,
  newPassword: string
): Promise<PasswordActionResult> {
  try {
    const sanitizedEmail = sanitizeUserInput(email).toLowerCase();

    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.valid) {
      return { success: false, error: `Zayıf sifre: ${passwordValidation.errors.join(', ')}` };
    }

    // Kodu dogrula — verified_at dolu olsa bile (verify adımında isaretlendi) geçerli say
    // Sadece expires_at ve email+code eslesmesini kontrol et
    const { rows: tokenRows } = await pool.query(
      `SELECT id, expires_at FROM verification_tokens
       WHERE email = $1 AND code = $2 AND type = 'password_reset'`,
      [sanitizedEmail, code]
    );
    if (!tokenRows[0]) {
      return { success: false, error: 'Kod geçersiz veya süresi dolmus' };
    }
    if (new Date(tokenRows[0].expires_at) < new Date()) {
      await pool.query(`DELETE FROM verification_tokens WHERE id = $1`, [tokenRows[0].id]);
      return { success: false, error: 'Kodun süresi dolmus, lütfen yeni kod isteyin' };
    }

    // Kullanıcıyı bul
    const { rows } = await pool.query(
      'SELECT id FROM users WHERE email = $1 AND deleted_at IS NULL',
      [sanitizedEmail]
    );
    if (!rows[0]) return { success: false, error: 'Kullanıcı bulunamadı' };

    // Yeni sifreyi hashle ve kaydet
    const newHash = await argon2.hash(newPassword, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
    });
    await pool.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [newHash, rows[0].id]
    );

    // Token'ı sil — bir kez kullanıldı, tekrar kullanılamasın
    await pool.query(
      `DELETE FROM verification_tokens WHERE id = $1`,
      [tokenRows[0].id]
    );

    return { success: true };
  } catch (err) {
    console.error('resetPasswordAction error:', err);
    return { success: false, error: 'Sunucu hatası' };
  }
}

export async function requestPasswordResetAction(
  email: string
): Promise<RequestPasswordResetResult> {
  try {
    const sanitizedEmail = sanitizeUserInput(email).toLowerCase();

    // Check if user exists
    const { rows } = await pool.query(
      "SELECT id FROM users WHERE email = $1 AND deleted_at IS NULL",
      [sanitizedEmail]
    );

    // Don't reveal if email exists - security best practice
    if (rows.length === 0) {
      return {
        success: true,
        message: "E-posta adresine bir dogrulama kodu gönderildi (varsa)"
      };
    }

    // Import the verification token creation function
    const { createVerificationToken } = await import('@/lib/db-verification');
    const { getEmailVerificationTemplate, sendEmail } = await import('@/lib/email-service');

    // Create verification token
    const { code, expiresAt } = await createVerificationToken(
      sanitizedEmail,
      'password_reset'
    );

    // Send email
    const emailTemplate = getEmailVerificationTemplate(code, 'password_reset', sanitizedEmail);
    emailTemplate.to = sanitizedEmail;

    const emailSent = await sendEmail(emailTemplate);

    if (!emailSent) {
      return { success: false, error: "E-posta gönderilemedi" };
    }

    // gelistirme ortamında kodu da döndur
    if (process.env.NODE_ENV === 'development') {
      console.log('\n🔑 [DEV MODE] Dogrulama Kodu:', code);
      console.log('Bu kodu kullanarak sifrenizi sıfırlayabilirsiniz.\n');
    }

    return {
      success: true,
      message: "Dogrulama kodu e-posta adresinize gönderildi",
    };
  } catch (err) {
    console.error("requestPasswordResetAction error:", err);
    return { success: false, error: "Sunucu hatası" };
  }
}
