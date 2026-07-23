import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import pool from "@/lib/database";
import { getJwtSecret } from "@/lib/auth-config";
import { blockCountry, unblockCountry } from "@/lib/security/country-blocklist";

export const runtime = "nodejs";

// Admin session dogrulama
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

// gET: Engellenmis tüm ülkeleri listele
export async function gET(request: NextRequest) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await pool.query(
      `SELECT id, country_code, reason, created_at
       FROM country_blocklist
       ORDER BY created_at DESC`
    );
    return NextResponse.json({ blocklist: result.rows });
  } catch (err) {
    console.error("[API] country-blocklist gET failed:", err);
    return NextResponse.json({ error: "Veritabanı hatası" }, { status: 500 });
  }
}

// POST: Yeni ülke engeli ekle
export async function POST(request: NextRequest) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { country_code, reason } = body;

    if (!country_code || typeof country_code !== "string" || country_code.trim().length !== 2) {
      return NextResponse.json({ error: "geçersiz ülke kodu (2 karakter olmalı)" }, { status: 400 });
    }

    await blockCountry(country_code, reason);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[API] country-blocklist POST failed:", err);
    return NextResponse.json({ error: err.message || "Veritabanı hatası" }, { status: 500 });
  }
}

// DELETE: Ülke engelini kaldır
export async function DELETE(request: NextRequest) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const country_code = searchParams.get("country_code");

    if (!country_code) {
      return NextResponse.json({ error: "Eksik ülke kodu" }, { status: 400 });
    }

    await unblockCountry(country_code);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[API] country-blocklist DELETE failed:", err);
    return NextResponse.json({ error: err.message || "Veritabanı hatası" }, { status: 500 });
  }
}
