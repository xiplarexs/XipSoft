/**
 * gET /api/internal/db-keepalive
 *
 * Neon free plan cold-start sorununu giderir.
 * Her 4 dakikada bir dıs cron (Upstash QStash, cron-job.org vb.) bu endpoint'i çagırır.
 * SELECT 1 ile baglantıyı canlı tutar — suspend olması engellenir.
 *
 * güvenlik: BOT_API_KEY header kontrolü — dısarıdan rasgele erisim engellenir.
 */

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function gET(req: NextRequest) {
  const key = req.headers.get("x-internal-key");
  const expected = process.env.BOT_API_KEY;

  if (expected && key !== expected) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const start = Date.now();
    await pool.query("SELECT 1");
    const ms = Date.now() - start;
    return NextResponse.json({ ok: true, latency: `${ms}ms` });
  } catch (err: any) {
    console.error("[db-keepalive] ping failed:", err.message);
    return NextResponse.json({ ok: false, error: err.message }, { status: 503 });
  }
}
