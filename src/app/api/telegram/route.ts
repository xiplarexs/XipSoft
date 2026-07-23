/**
 * POST /api/telegram
 * Admin panelinden manuel Telegram paylasımı.
 * Sadece admin session cookie'si olan kullanıcılar erisebilir.
 *
 * Body:
 *   { type: "blog",   id: string }
 *   { type: "thread", id: string }
 *   { type: "custom", text: string }
 *   { type: "test" }
 */

import { NextRequest, NextResponse } from "next/server";
import { extractAuthContext } from "@/lib/api-guard";
import {
  shareBlogToTelegram,
  sendCustomTelegramMessage,
} from "@/lib/telegram";
import pool from "@/lib/database";

// Izin verilen type degerleri — whitelist
const ALLOWED_TYPES = new Set(["blog", "custom", "test"]);

export async function POST(req: NextRequest) {
  // Admin kontrolü — request'ten cookie oku (getServerActionContext degil)
  const ctx = await extractAuthContext(req);
  if (!ctx.isAuthenticated || ctx.userRole !== "admin") {
    return NextResponse.json({ ok: false, error: "Yetkisiz erisim" }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "geçersiz JSON" }, { status: 400 });
  }

  const { type } = body;

  // type whitelist kontrolü
  if (!type || typeof type !== "string" || !ALLOWED_TYPES.has(type)) {
    return NextResponse.json({ ok: false, error: "geçersiz type" }, { status: 400 });
  }

  // ── Test ──────────────────────────────────────────────────────────────────
  if (type === "test") {
    const result = await sendCustomTelegramMessage(
      "✅ <b>XipSoft Telegram Botu</b> basarıyla baglandı!\n\nBlog paylasımları bu kanala otomatik gönderilecek."
    );
    return NextResponse.json(result);
  }

  // ── Blog ──────────────────────────────────────────────────────────────────
  if (type === "blog") {
    const rawId = body.id;
    // id pozitif integer olmalı
    const id = typeof rawId === "string" ? parseInt(rawId, 10) : typeof rawId === "number" ? rawId : NaN;
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ ok: false, error: "geçerli bir blog ID gerekli" }, { status: 400 });
    }

    const { rows } = await pool.query(
      `SELECT bp.title, bp.description, bp.slug, bp.tags,
              u.display_name AS author_name
       FROM blog_posts bp
       LEFT JOIN users u ON u.id = bp.author_id
       WHERE bp.id = $1 AND bp.deleted_at IS NULL`,
      [id]
    );

    if (!rows[0]) {
      return NextResponse.json({ ok: false, error: "Blog bulunamadı" }, { status: 404 });
    }

    const result = await shareBlogToTelegram({
      title: rows[0].title,
      description: rows[0].description,
      slug: rows[0].slug,
      authorName: rows[0].author_name,
      tags: rows[0].tags,
    });

    return NextResponse.json(result);
  }


  // ── Custom ────────────────────────────────────────────────────────────────
  if (type === "custom") {
    const text = body.text;
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json({ ok: false, error: "Mesaj metni gerekli" }, { status: 400 });
    }
    if (text.length > 4096) {
      return NextResponse.json({ ok: false, error: "Mesaj 4096 karakterden uzun olamaz" }, { status: 400 });
    }
    const result = await sendCustomTelegramMessage(text.trim());
    return NextResponse.json(result);
  }

  return NextResponse.json({ ok: false, error: "geçersiz type" }, { status: 400 });
}

export async function gET() {
  return NextResponse.json({ ok: false, error: "Method Not Allowed" }, { status: 405, headers: { Allow: "POST" } });
}
