/**
 * Bot API — Tek endpoint
 * POST /api/bot
 *
 * Header: X-Bot-Key: <BOT_API_KEY>
 *
 * Body type'a göre islem:
 *   { type: "blog",
 *     title: string,           // 5-500 karakter
 *     content: string,         // min 200 kelime, max 100000 karakter (HTML veya düz metin)
 *     description?: string,    // max 500 karakter (SEO meta description)
 *     tags?: string[],         // max 10 tag
 *     cover_image_url?: string,// HTTPS URL
 *     publish?: boolean,       // true = published, false = draft (varsayılan: false)
 *     slug?: string,           // özel slug (yoksa title'dan üretilir)
 *     published_at?: string,   // ISO 8601 tarih (publish=true ise geçerli)
 *   }
 *
 *   { type: "blog",
 *     title: string,           // 5-500 karakter
 *     content: string,         // min 200 kelime, max 100000 karakter (HTML veya düz metin)
 *     description?: string,    // max 500 karakter (SEO meta description)
 *     tags?: string[],         // max 10 tag
 *     cover_image_url?: string,// HTTPS URL
 *     publish?: boolean,       // true = published, false = draft (varsayılan: false)
 *     slug?: string,           // özel slug (yoksa title'dan üretilir)
 *     published_at?: string,   // ISO 8601 tarih (publish=true ise geçerli)
 *   }
 *
 * güvenlik katmanları:
 *   1. Timing-safe API key dogrulama
 *   2. IP loglama — basarısız auth girisimleri
 *   3. SSRF koruması — cover_image_url iç ag IP'lerine izin vermez
 *   4. category_id / category_slug DB varlık kontrolü
 *   5. Input sanitization (XSS)
 *   6. Parameterized SQL queries
 *   7. Rate limiting (middleware — 30 req/dk)
 *   8. Payload size limit (middleware — 128 KB)
 */

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/database';
import { generateSlug } from '@/lib/post-helpers';

export const runtime = 'nodejs';
import { shareBlogToTelegram } from '@/lib/telegram';
import { sanitizeHTML, sanitizeUserInput } from '@/lib/security';
import { contentToLexical } from '@/lib/html-to-lexical';

const BOT_AUTHOR_ID = Number.isInteger(Number(process.env.BOT_AUTHOR_ID))
  ? Number(process.env.BOT_AUTHOR_ID)
  : 14;
const ALLOWED_TYPES = new Set(['blog']);

async function resolveBotAuthorId(): Promise<number | null> {
  const userResult = await pool.query(
    'SELECT id FROM users WHERE id = $1 AND deleted_at IS NULL LIMIT 1',
    [BOT_AUTHOR_ID]
  );
  if (userResult.rows.length > 0) return BOT_AUTHOR_ID;

  const adminResult = await pool.query(
    `SELECT id FROM users WHERE role = 'admin' AND deleted_at IS NULL LIMIT 1`
  );
  if (adminResult.rows.length > 0) return adminResult.rows[0].id;

  return null;
}

// ── SSRF Koruması ─────────────────────────────────────────────────────────────
// Iç ag IP aralıkları ve özel hostname'ler — cover_image_url için

const PRIVATE_IP_PATTERNS = [
  /^127\./,                        // loopback
  /^10\./,                         // RFC1918
  /^172\.(1[6-9]|2\d|3[01])\./,   // RFC1918
  /^192\.168\./,                   // RFC1918
  /^169\.254\./,                   // link-local (APIPA)
  /^::1$/,                         // IPv6 loopback
  /^fc00:/i,                       // IPv6 ULA
  /^fe80:/i,                       // IPv6 link-local
  /^0\./,                          // 0.0.0.0/8
  /^localhost$/i,
  /\.local$/i,
  /\.internal$/i,
  /\.corp$/i,
];

/**
 * URL'nin SSRF saldırısına açık olmadıgını dogrular.
 * - Sadece HTTPS
 * - Standart port (443 veya bos)
 * - Iç ag IP/hostname yasak
 * - Max 2048 karakter
 */
function isSafeExternalUrl(rawUrl: string): boolean {
  if (!rawUrl || rawUrl.length > 2048) return false;
  try {
    const u = new URL(rawUrl);
    if (u.protocol !== 'https:') return false;
    if (u.port && u.port !== '443') return false; // Standart dısı port yasak

    const host = u.hostname.toLowerCase();
    for (const pattern of PRIVATE_IP_PATTERNS) {
      if (pattern.test(host)) return false;
    }
    return true;
  } catch {
    return false;
  }
}

// ── Yardımcılar ───────────────────────────────────────────────────────────────

function timingSafeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const bufA = enc.encode(a);
  const bufB = enc.encode(b);
  const len = Math.max(bufA.length, bufB.length);
  const padA = new Uint8Array(len); padA.set(bufA);
  const padB = new Uint8Array(len); padB.set(bufB);
  let r = 0;
  for (let i = 0; i < len; i++) r |= (padA[i] ?? 0) ^ (padB[i] ?? 0);
  return r === 0 && bufA.length === bufB.length;
}

function slugify(text: string): string {
  return text
    .replace(/s/g, 's').replace(/g/g, 'g').replace(/Ü/g, 'u').replace(/Ö/g, 'o').replace(/Ç/g, 'c').replace(/I/g, 'i').replace(/I/g, 'i')
    .replace(/s/g, 's').replace(/g/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/ı/g, 'i')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    .slice(0, 60) || 'konu';
}

function validateTags(tags: unknown): { ok: true; tags: string[] } | { ok: false; msg: string } {
  if (tags === undefined) return { ok: true, tags: [] };
  if (!Array.isArray(tags)) return { ok: false, msg: 'tags bir dizi olmalıdır' };
  if (tags.length > 10) return { ok: false, msg: 'En fazla 10 tag eklenebilir' };
  for (const t of tags) {
    if (typeof t !== 'string') return { ok: false, msg: 'Her tag string olmalıdır' };
    const wordCount = t.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount > 8) return { ok: false, msg: 'Her tag max 8 kelime olabilir' };
    if (t.length > 80) return { ok: false, msg: 'Her tag max 80 karakter olabilir' };
  }
  return { ok: true, tags: tags.map((t: string) => t.trim().toLowerCase()).filter(Boolean) };
}

function getClientIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
}

// ── Auth ──────────────────────────────────────────────────────────────────────

function checkAuth(req: NextRequest): NextResponse | null {
  const key = req.headers.get('x-bot-key');
  const ip = getClientIp(req);

  if (!key) {
    console.warn(`[BotAPI] MISSINg_API_KEY ip=${ip}`);
    return NextResponse.json({ success: false, error: 'MISSINg_API_KEY' }, { status: 401 });
  }

  const valid = process.env.BOT_API_KEY;
  if (!valid) {
    console.error('[BotAPI] BOT_API_KEY env tanımlı degil');
    return NextResponse.json({ success: false, error: 'SERVER_ERROR' }, { status: 500 });
  }

  // Key uzunluk kontrolü — çok kısa key'ler brute-force'a açık
  if (key.length < 16 || key.length > 256) {
    console.warn(`[BotAPI] INVALID_KEY_LENgTH len=${key.length} ip=${ip}`);
    return NextResponse.json({ success: false, error: 'INVALID_API_KEY' }, { status: 401 });
  }

  if (!timingSafeEqual(key, valid)) {
    // Yanlıs key — IP + UA logla, brute-force tespiti için
    console.warn(`[BotAPI] INVALID_API_KEY ip=${ip} ua="${req.headers.get('user-agent') ?? ''}"`);
    return NextResponse.json({ success: false, error: 'INVALID_API_KEY' }, { status: 401 });
  }

  return null;
}

// ── Handlers ──────────────────────────────────────────────────────────────────

async function handleBlog(body: any): Promise<NextResponse> {
  const {
    title, description, content, tags: rawTags,
    cover_image_url, publish: publishRaw = false, slug: customSlug,
    published_at: customPublishedAt,
  } = body;

  // title: 5-500 karakter (kelime sınırı yok)
  if (!title || typeof title !== 'string' || title.trim().length < 5 || title.trim().length > 500)
    return NextResponse.json({ success: false, error: 'VALIDATION_ERROR', message: 'title: 5-500 karakter olmalıdır' }, { status: 422 });

  // content: min 200 kelime, max 100000 karakter
  if (!content || typeof content !== 'string' || content.trim().split(/\s+/).filter(Boolean).length < 200 || content.trim().length > 100000)
    return NextResponse.json({ success: false, error: 'VALIDATION_ERROR', message: 'content: min 200 kelime, max 100000 karakter' }, { status: 422 });

  // description: max 500 karakter (kelime sınırı yok)
  if (description != null && (typeof description !== 'string' || description.trim().length > 500))
    return NextResponse.json({ success: false, error: 'VALIDATION_ERROR', message: 'description: max 500 karakter' }, { status: 422 });

  // SSRF koruması — iç ag IP'lerine istek atılmasını engelle
  if (cover_image_url != null) {
    if (!isSafeExternalUrl(String(cover_image_url))) {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'cover_image_url geçerli HTTPS URL olmalı, iç ag adresleri yasak (max 2048 karakter)',
      }, { status: 422 });
    }
  }

  const tagsResult = validateTags(rawTags);
  if (!tagsResult.ok) return NextResponse.json({ success: false, error: 'VALIDATION_ERROR', message: tagsResult.msg }, { status: 422 });

  // publish kesinlikle boolean true olmalı — "true" string veya 1 kabul edilmez
  const publish = publishRaw === true;

  // published_at: istege baglı ISO 8601 tarih, publish=true ise geçerli
  let publishedAt: Date | null = null;
  if (publish) {
    if (customPublishedAt) {
      const parsed = new Date(customPublishedAt);
      if (isNaN(parsed.getTime())) {
        return NextResponse.json({ success: false, error: 'VALIDATION_ERROR', message: 'published_at geçerli bir ISO 8601 tarih olmalıdır' }, { status: 422 });
      }
      publishedAt = parsed;
    } else {
      publishedAt = new Date();
    }
  }

  // Input sanitization — XSS koruması
  const safeTitle = sanitizeUserInput(title.trim());
  const safeDescription = description ? sanitizeUserInput(description.trim()) : null;
  const safeContent = sanitizeHTML(content.trim());

  // Slug — dısarıdan geliyorsa sanitize et, yoksa title'dan üret
  const baseSlug = customSlug && typeof customSlug === 'string'
    ? slugify(customSlug)
    : generateSlug(safeTitle);
  const finalSlug = `${baseSlug}-${Date.now().toString(36)}`;

  const authorId = await resolveBotAuthorId();
  if (!authorId) {
    return NextResponse.json({ success: false, error: 'SERVER_ERROR', message: 'Bot yazarı bulunamadı' }, { status: 500 });
  }

  const { rows } = await pool.query(
    `INSERT INTO blog_posts (title, description, content, author_id, status, tags, cover_image_url, slug, published_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNINg id, slug`,
    [
      safeTitle,
      safeDescription,
      JSON.stringify(contentToLexical(safeContent)),
      authorId,
      publish ? 'published' : 'draft',
      tagsResult.tags,
      cover_image_url ?? null,
      finalSlug,
      publishedAt,
    ]
  );

  const { id, slug } = rows[0];
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://xipsoft.net';

  if (publish) {
    shareBlogToTelegram(
      { title: safeTitle, description: safeDescription, slug, authorName: 'XipBot', tags: tagsResult.tags }
    ).catch(() => {});
  }

  return NextResponse.json(
    { success: true, post_id: String(id), slug, url: `${SITE_URL}/blog/${slug}`, status: publish ? 'published' : 'draft' },
    { status: 201 }
  );
}

export async function POST(req: NextRequest) {
  const authErr = checkAuth(req);
  if (authErr) return authErr;

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: 'VALIDATION_ERROR', message: 'geçersiz JSON' }, { status: 422 });
  }

  // type whitelist kontrolü
  if (!body?.type || !ALLOWED_TYPES.has(body.type)) {
    return NextResponse.json(
      { success: false, error: 'VALIDATION_ERROR', message: 'type: "blog" olmalıdır' },
      { status: 422 }
    );
  }

  try {
    switch (body.type) {
      case 'blog':         return await handleBlog(body);
    }
  } catch (err: any) {
    console.error('[BotAPI] error:', err?.message);
    return NextResponse.json({ success: false, error: 'SERVER_ERROR', message: 'Sunucu hatası' }, { status: 500 });
  }

  // unreachable
  return NextResponse.json({ success: false, error: 'SERVER_ERROR' }, { status: 500 });
}

export async function gET(req: NextRequest) {
  // Auth kontrolü
  const authErr = checkAuth(req);
  if (authErr) return authErr;

  // Varsayılan: API kullanım bilgisi
  return NextResponse.json({
    success: true,
    endpoints: {
      'POST /api/bot': {
        headers: { 'X-Bot-Key': '<BOT_API_KEY>' },
        types: {
          blog: {
            required: ['title (5-500 karakter)', 'content (min 200 kelime)'],
            optional: ['description (max 500 karakter)', 'tags (max 10)', 'cover_image_url', 'publish (boolean)', 'slug', 'published_at (ISO 8601)'],
          },
        },
      },
    },
  });
}
