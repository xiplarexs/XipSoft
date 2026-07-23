"use server";

import pool from "@/lib/database";
import type { AuthUser } from "@/context/AuthContext";
import { verifySessionCookie } from "@/lib/security";
import { cookies } from "next/headers";
import { USER_FIELDS } from "@/lib/auth-constants";

export async function getMeAction(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('xipsoft_session')?.value;
    if (!sessionToken) return null;

    const payload = await verifySessionCookie(sessionToken);
    if (!payload?.userId) return null;

    const { rows } = await pool.query(
      `SELECT ${USER_FIELDS} FROM users WHERE id = $1 AND deleted_at IS NULL AND is_banned = false`,
      [Number(payload.userId)]
    );
    if (!rows[0]) return null;
    const { uid: _uid, ...rowData } = rows[0];
    return {
      ...rowData,
      id: String(rows[0].id),
    } as AuthUser;
  } catch (err) {
    console.error("getMeAction error:", err);
    return null;
  }
}

export async function logoutAction(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('xipsoft_session');
    // PERF: Hint cookie da sil — AuthContext artık DB sorgusunu atlar
    cookieStore.delete('xipsoft_logged_in');
    // Admin session cookie'lerini de temizle
    cookieStore.delete('xipsoft_admin_access');
    cookieStore.delete('xipsoft_2fa_verified');
  } catch (err) {
    console.error("logoutAction error:", err);
  }
}
