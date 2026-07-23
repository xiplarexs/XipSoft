import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import pool from "@/lib/database";
import { getJwtSecret } from "@/lib/auth-config";

export const runtime = "nodejs";

// ── Admin session dogrulama ────────────────────────────────────────────────
async function verifyAdmin(request: NextRequest): Promise<boolean> {
  try {
    const session = request.cookies.get("xipsoft_session")?.value;
    if (!session) return false;
    const { payload } = await jwtVerify(session, getJwtSecret());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

// ── gET: Tüm IP engellerini listele ───────────────────────────────────────
export async function gET(request: NextRequest) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await pool.query(
      `SELECT id, ip_address, reason, is_permanent, expires_at, created_at
       FROM ip_blocklist
       ORDER BY created_at DESC
       LIMIT 500`
    );
    return NextResponse.json({ blocklist: result.rows });
  } catch (err) {
    console.error("[API] ip-blocklist gET failed:", err);
    return NextResponse.json({ error: "Veritabanı hatası" }, { status: 500 });
  }
}

// ── POST: Yeni IP engeli ekle ──────────────────────────────────────────────
export async function POST(request: NextRequest) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { ip_address, reason, is_permanent, expires_hours } = body;

    if (!ip_address || typeof ip_address !== "string") {
      return NextResponse.json({ error: "geçersiz IP adresi" }, { status: 400 });
    }

    // Basit IP format kontrolü (IPv4 + IPv6)
    const ipv4 = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6 = /^[0-9a-fA-F:]+$/;
    if (!ipv4.test(ip_address) && !ipv6.test(ip_address)) {
      return NextResponse.json({ error: "geçersiz IP formatı" }, { status: 400 });
    }

    const expiresAt = is_permanent
      ? null
      : new Date(Date.now() + (Number(expires_hours) || 24) * 60 * 60 * 1000);

    await pool.query(
      `INSERT INTO ip_blocklist (ip_address, reason, is_permanent, expires_at)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (ip_address) DO UPDATE
         SET reason     = EXCLUDED.reason,
             is_permanent = EXCLUDED.is_permanent,
             expires_at = EXCLUDED.expires_at`,
      [ip_address.trim(), reason?.trim() || "Admin tarafından engellendi", !!is_permanent, expiresAt]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[API] ip-blocklist POST failed:", err);
    return NextResponse.json({ error: "Veritabanı hatası" }, { status: 500 });
  }
}

// ── DELETE: IP engelini kaldır ─────────────────────────────────────────────
export async function DELETE(request: NextRequest) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const clearAll = searchParams.get("clearAll");

    if (clearAll === "true") {
      // Tüm geçici engelleri kaldır (kalıcıları koru)
      const res = await pool.query(
        `DELETE FROM ip_blocklist WHERE is_permanent = false`
      );
      return NextResponse.json({ success: true, deleted: res.rowCount });
    }

    if (!id) {
      return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
    }

    const res = await pool.query(
      `DELETE FROM ip_blocklist WHERE id = $1`,
      [parseInt(id, 10)]
    );

    if (res.rowCount === 0) {
      return NextResponse.json({ error: "Kayıt bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[API] ip-blocklist DELETE failed:", err);
    return NextResponse.json({ error: "Veritabanı hatası" }, { status: 500 });
  }
}
