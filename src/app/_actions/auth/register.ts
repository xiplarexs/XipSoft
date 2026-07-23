"use server";

import pool from "@/lib/database";
import argon2 from "argon2";
import type { AuthUser } from "@/context/AuthContext";
import { setSession } from "@/lib/redis";
import {
  createSessionCookie,
  sanitizeUserInput,
  validatePasswordStrength,
  SECURE_COOKIE_OPTIONS,
} from "@/lib/security";
import { cookies } from "next/headers";
import { USER_FIELDS, sanitizeEmail } from "@/lib/auth-constants";
import { verifyTurnstile } from "./shared";
import type { AuthActionResult } from "./types";

export async function registerAction(
  email: string,
  username: string,
  password: string,
  options?: { captchaToken?: string; extraFields?: { birth_date?: string; city?: string; phone?: string } }
): Promise<AuthActionResult> {
  try {
    const captchaToken = options?.captchaToken;
    const extraFields = options?.extraFields;

    // Cloudflare Turnstile dogrulaması — zorunlu (key varsa)
    const turnstileError = await verifyTurnstile(captchaToken);
    if (turnstileError) return { user: null, error: turnstileError };
    // Input sanitization
    const sanitizedEmail = sanitizeEmail(email);
    const sanitizedUsername = sanitizeUserInput(username);

    // Password strength validation
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      return {
        user: null,
        error: `Zayıf sifre: ${passwordValidation.errors.join(', ')}`
      };
    }

    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [sanitizedEmail]
    );
    if (existing.rows[0]) return { user: null, error: "Bu e-posta zaten kayıtlı" };

    const nameCheck = await pool.query(
      "SELECT id FROM users WHERE display_name = $1",
      [sanitizedUsername]
    );
    if (nameCheck.rows[0]) return { user: null, error: "Bu kullanıcı adı zaten alınmıs" };

    const password_hash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 2,
      parallelism: 1,
    });
    const uid = crypto.randomUUID();

    // Check if this is the first user - if so, make them admin
    const adminCheck = await pool.query(
      "SELECT id FROM users WHERE role = 'admin' LIMIT 1"
    );
    const role = adminCheck.rows.length === 0 ? 'admin' : 'user';

    const { rows } = await pool.query(
      `INSERT INTO users (uid, email, display_name, nick, role, password_hash, birth_date, city, phone)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNINg ${USER_FIELDS}`,
      [uid, sanitizedEmail, sanitizedUsername, sanitizedUsername, role, password_hash,
       extraFields?.birth_date || null,
       extraFields?.city ? sanitizeUserInput(extraFields.city) : null,
       extraFields?.phone ? sanitizeUserInput(extraFields.phone) : null]
    );
    const u = rows[0];
    const { uid: _uid2, ...uData } = u;
    const user = {
      ...uData,
      id: String(u.id),
    } as AuthUser;

    // Create secure session JWT and set cookie
    const sessionToken = await createSessionCookie(user.id, user);
    const cookieStore = await cookies();
    cookieStore.set('xipsoft_session', sessionToken, SECURE_COOKIE_OPTIONS);
    // PERF: Hint cookie (httpOnly: false) — AuthContext gereksiz getMeAction() çagrısını atlar
    cookieStore.set('xipsoft_logged_in', '1', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SECURE_COOKIE_OPTIONS.maxAge,
      path: '/',
    });

    // Cache to Redis — fire-and-forget, Redis yoksa register engellenmez
    setSession(u.uid, {
      id: String(u.id),
      email: u.email,
      display_name: u.display_name,
      role: u.role as 'user' | 'admin' | 'moderator',
      photo_url: u.photo_url ?? undefined,
      rank_id: u.rank_id ?? undefined,
      reputation: u.reputation ?? undefined,
      message_count: u.message_count ?? undefined,
    }).catch((e) => console.error('[Register] Redis cache error:', e));

    return { user };
  } catch (err) {
    console.error("registerAction error:", err);
    return { user: null, error: "Sunucu hatası" };
  }
}
