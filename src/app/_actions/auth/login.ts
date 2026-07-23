"use server";

import pool from "@/lib/database";
import bcrypt from "bcryptjs";
import argon2 from "argon2";
import type { AuthUser } from "@/context/AuthContext";
import { setSession } from "@/lib/redis";
import {
  createSessionCookie,
  sanitizeUserInput,
  SECURE_COOKIE_OPTIONS,
} from "@/lib/security";
import { headers, cookies } from "next/headers";
import { checkRateLimit } from "@/lib/rate-limit";
import { USER_FIELDS, sanitizeEmail } from "@/lib/auth-constants";
import { verifyTurnstile } from "./shared";
import type { AuthActionResult } from "./types";

export async function loginAction(
  email: string,
  password: string,
  options?: { csrfToken?: string; captchaToken?: string }
): Promise<AuthActionResult> {
  try {
    const captchaToken = options?.captchaToken;
    const csrfToken = options?.csrfToken;

    // Cloudflare Turnstile dogrulaması — zorunlu (key varsa)
    // Turnstile bot+CSRF korumasını birlikte saglar; ayrıca DB-backed CSRF gerekmiyor.
    const turnstileError = await verifyTurnstile(captchaToken);
    if (turnstileError) return { user: null, error: turnstileError };

    // görev 3.2 — Server Action içi rate-limit (middleware bypass'ını kapatır)
    // Redis yoksa (Upstash kurulmamıs) atla — fail-open, UX engellenmez.
    // Redis varsa: 60 saniyede 10 deneme limitini uygula.
    const headersList = await headers();
    const loginIp =
      headersList.get('cf-connecting-ip') ||
      headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      headersList.get('x-real-ip') ||
      'unknown';

    const redisAvailable = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
    if (redisAvailable && loginIp !== 'unknown') {
      const rl = await checkRateLimit(`login:${loginIp}`, {
        windowMs: 60 * 1000,
        maxRequests: 10,
        keyPrefix: 'rl:login',
        message: 'Çok fazla giris denemesi. Lütfen bekleyin.',
      });
      if (!rl.success) {
        return { user: null, error: 'Çok fazla giris denemesi. Lütfen bir dakika bekleyin.' };
      }
    }

    // Input sanitization
    const sanitizedEmail = sanitizeEmail(email);

    const { rows } = await pool.query(
      `SELECT ${USER_FIELDS}, password_hash FROM users WHERE email = $1 AND deleted_at IS NULL`,
      [sanitizedEmail]
    );
    if (!rows[0]) {
    return { user: null, error: "E-posta veya sifre hatalı" };
    }

    const u = rows[0];
    if (!u.password_hash) {
      return { user: null, error: "Bu hesap için sifre tanımlanmamıs" };
    }

    // Argon2 verification (new)
    let valid = false;
    if (u.password_hash.startsWith('$argon2')) {
      valid = await argon2.verify(u.password_hash, password);
    } else {
      // Legacy bcrypt support with auto-upgrade
      valid = await bcrypt.compare(password, u.password_hash);

      // Auto-upgrade bcrypt to argon2
      if (valid) {
        try {
          const newHash = await argon2.hash(password);
          await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newHash, u.id]);
        } catch (err) {
          console.error('[Login] Failed to upgrade password hash:', err);
        }
      }
    }

    if (!valid) return { user: null, error: "E-posta veya sifre hatalı" };

    if (u.is_banned) {
      return { user: null, error: "Bu hesap yasaklanmıstır" };
    }

    const { password_hash, uid: _uid, ...userData } = u;
    const user = {
      ...userData,
      id: String(userData.id),
    } as AuthUser;

    // Create secure session JWT
    const sessionToken = await createSessionCookie(user.id, user);

    // Set HttpOnly cookie server-side
    const cookieStore = await cookies();
    cookieStore.set('xipsoft_session', sessionToken, SECURE_COOKIE_OPTIONS);

    // PERF: Hint cookie — JS tarafından okunabilir (httpOnly: false).
    // AuthContext bu cookie'yi kontrol ederek giris yapmamıs kullanıcılar için
    // getMeAction() DB sorgusunu atlar. güvenlik-hassas veri içermez, sadece flag.
    cookieStore.set('xipsoft_logged_in', '1', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SECURE_COOKIE_OPTIONS.maxAge,
      path: '/',
    });

    // Admin girisinde 2FA cookie'sini temizle
    // NOT: xipsoft_admin_access cookie'si 2FA dogrulamasından sonra set edilir
    if (u.role === 'admin') {
      cookieStore.delete('xipsoft_2fa_verified');
    }

    // Update last_active timestamp
    await pool.query(
      `UPDATE users SET last_active = NOW() WHERE id = $1`,
      [user.id]
    );

    // Cache to Redis for fast lookups — fire-and-forget, Redis yoksa login engellenmez
    setSession(u.uid, {
      id: String(u.id),
      email: u.email,
      display_name: u.display_name,
      role: u.role as 'user' | 'admin' | 'moderator',
      photo_url: u.photo_url ?? undefined,
      rank_id: u.rank_id ?? undefined,
      reputation: u.reputation ?? undefined,
      message_count: u.message_count ?? undefined,
    }).catch((e) => console.error('[Login] Redis cache error:', e));

    return { user };
  } catch (err) {
    console.error("loginAction error:", err);
    return { user: null, error: "Sunucu hatası" };
  }
}
