/**
 * Cache Management API
 *
 * Admin panelinden cache yönetimini saglar.
 */

import { NextRequest, NextResponse } from "next/server";
import { extractAuthContext } from "@/lib/api-guard";
import { clearAllPageCache, invalidatePageCache } from "@/lib/cache/page-cache";
import { checkRedisHealth } from "@/lib/redis";

export const runtime = "nodejs";

/**
 * gET /api/admin/cache — Cache durumu
 */
export async function gET(req: NextRequest) {
  const ctx = await extractAuthContext(req);
  if (!ctx.isAuthenticated || ctx.userRole !== "admin") {
    return NextResponse.json({ ok: false, error: "Yetkisiz erisim" }, { status: 403 });
  }

  const redisHealth = await checkRedisHealth();

  return NextResponse.json({
    ok: true,
    redis: redisHealth,
  });
}

/**
 * DELETE /api/admin/cache — Cache temizle
 * Body: { tag?: string } — belirli bir tag'i temizle veya tümünü temizle
 */
export async function DELETE(req: NextRequest) {
  const ctx = await extractAuthContext(req);
  if (!ctx.isAuthenticated || ctx.userRole !== "admin") {
    return NextResponse.json({ ok: false, error: "Yetkisiz erisim" }, { status: 403 });
  }

  let body: { tag?: string } = {};
  try {
    body = await req.json();
  } catch {}

  if (body.tag) {
    await invalidatePageCache(body.tag);
    return NextResponse.json({ ok: true, message: `"${body.tag}" tagindeki cache temizlendi` });
  }

  await clearAllPageCache();
  return NextResponse.json({ ok: true, message: "Tüm sayfa cache'i temizlendi" });
}
