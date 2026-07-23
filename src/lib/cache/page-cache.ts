/**
 * Redis Sayfa Önbellekleme Servisi
 *
 * Public sayfaları Redis'te önbellege alır.
 * Middleware'den bagımsız çalısır — Server Component'lerden çagrılır.
 */

import { getRedisClient } from "@/lib/redis";

/**
 * Belirli bir tag ile cache'lenmis tüm sayfaları temizle
 */
export async function invalidatePageCache(tag: string): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    const tagKey = `page-tag:${tag}`;
    const keys = await redis.smembers(tagKey);
    if (Array.isArray(keys) && keys.length > 0) {
      await redis.del(...keys);
    }
    await redis.del(tagKey);
  } catch (err) {
    console.error("[PageCache] Invalidation failed:", err);
  }
}

/**
 * Tüm sayfa cache'ini temizle
 */
export async function clearAllPageCache(): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    // Upstash REST client'ta SCAN desteklenmeyebilir
    // Basit bir yaklasım: bilinen tag'leri temizle
    const knownTags = ["all", "home", "blog", "services"];
    for (const tag of knownTags) {
      await invalidatePageCache(tag);
    }
  } catch (err) {
    console.error("[PageCache] Clear all failed:", err);
  }
}
