/**
 * Email Verification System
 * - OTP token uretimi ve gönderimi
 * - Token dogrulama ve temizleme
 */

import pool from "./database";
import crypto from "crypto";

export interface VerificationToken {
  id: number;
  user_id: number;
  email: string;
  token: string;
  code: string; // 6-digit OTP code
  type: "email_verification" | "password_reset";
  expires_at: Date;
  verified_at?: Date;
  created_at: Date;
}

/**
 * generate 6-digit OTP code
 */
export function generateOTPCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * generate random token
 */
export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Create email verification token
 */
export async function createVerificationToken(
  email: string,
  type: "email_verification" | "password_reset" = "email_verification"
): Promise<{ token: string; code: string; expiresAt: Date }> {
  try {
    const token = generateToken();
    const code = generateOTPCode();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Önce var olan kaydı kontrol et
    const existingToken = await pool.query(
      `SELECT id FROM verification_tokens WHERE email = $1 AND type = $2`,
      [email, type]
    );

    if (existingToken.rows.length > 0) {
      // Varsa guncelle - used_at'i de sıfırla
      await pool.query(
        `UPDATE verification_tokens 
         SET token = $1, code = $2, expires_at = $3, verified_at = NULL, used_at = NULL, created_at = NOW()
         WHERE email = $4 AND type = $5`,
        [token, code, expiresAt, email, type]
      );
    } else {
      // Yoksa yeni kayıt ekle
      await pool.query(
        `INSERT INTO verification_tokens (email, token, code, type, expires_at)
         VALUES ($1, $2, $3, $4, $5)`,
        [email, token, code, type, expiresAt]
      );
    }

    return { token, code, expiresAt };
  } catch (error) {
    console.error("[VerificationToken] Create error:", error);
    throw error;
  }
}

/**
 * Verify using token
 */
export async function verifyTokenByToken(
  email: string,
  token: string,
  type: "email_verification" | "password_reset" = "email_verification"
): Promise<boolean> {
  try {
    const { rows } = await pool.query(
      `SELECT id, expires_at, verified_at FROM verification_tokens
       WHERE email = $1 AND token = $2 AND type = $3 AND verified_at IS NULL`,
      [email, token, type]
    );

    if (!rows[0]) return false;

    const record = rows[0];
    if (new Date(record.expires_at) < new Date()) {
      // Token expired
      await pool.query(
        `DELETE FROM verification_tokens WHERE id = $1`,
        [record.id]
      );
      return false;
    }

    // Mark as verified
    await pool.query(
      `UPDATE verification_tokens SET verified_at = NOW() WHERE id = $1`,
      [record.id]
    );

    return true;
  } catch (error) {
    console.error("[VerificationToken] Verify by token error:", error);
    return false;
  }
}

/**
 * Verify using OTP code
 */
export async function verifyTokenByCode(
  email: string,
  code: string,
  type: "email_verification" | "password_reset" = "email_verification"
): Promise<boolean> {
  try {
    const { rows } = await pool.query(
      `SELECT id, expires_at, verified_at FROM verification_tokens
       WHERE email = $1 AND code = $2 AND type = $3 AND verified_at IS NULL`,
      [email, code, type]
    );

    if (!rows[0]) return false;

    const record = rows[0];
    if (new Date(record.expires_at) < new Date()) {
      // Token expired
      await pool.query(
        `DELETE FROM verification_tokens WHERE id = $1`,
        [record.id]
      );
      return false;
    }

    // Mark as verified
    await pool.query(
      `UPDATE verification_tokens SET verified_at = NOW() WHERE id = $1`,
      [record.id]
    );

    return true;
  } catch (error) {
    console.error("[VerificationToken] Verify by code error:", error);
    return false;
  }
}

/**
 * get verification token
 */
export async function getVerificationToken(
  email: string,
  type: "email_verification" | "password_reset" = "email_verification"
): Promise<VerificationToken | null> {
  try {
    const { rows } = await pool.query(
      `SELECT id, email, type, code, expires_at, verified_at, created_at, updated_at FROM verification_tokens
       WHERE email = $1 AND type = $2 AND verified_at IS NULL
       ORDER BY created_at DESC LIMIT 1`,
      [email, type]
    );

    return rows[0] || null;
  } catch (error) {
    console.error("[VerificationToken] get error:", error);
    return null;
  }
}

/**
 * Clean up expired tokens
 */
export async function cleanupExpiredTokens(): Promise<number> {
  try {
    const { rowCount } = await pool.query(
      `DELETE FROM verification_tokens WHERE expires_at < NOW() OR verified_at < NOW() - INTERVAL '7 days'`
    );
    return rowCount || 0;
  } catch (error) {
    console.error("[VerificationToken] Cleanup error:", error);
    return 0;
  }
}
