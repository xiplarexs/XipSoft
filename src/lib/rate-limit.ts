/**
 * Rate Limiting Middleware — Redis-based
 *
 * Rate Limiting Middleware — Redis-based
 * 
 * Kullanım:
 *   - API route'larda rate limit kontrolü
 *   - IP-based ve user-based limit destegi
 *   - sliding window algoritması
 *
 * NOT: Redis (UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN) olmadan
 * rate limiting atlanır (fail-open). Servis erisilebilirligi önceliklidir.
 */

import { getRedisClient } from '@/lib/redis';
import { NextRequest, NextResponse } from 'next/server';

// ─── Payload boyut limitleri ──────────────────────────────────────────────────
// Endpoint bazlı maksimum request body boyutu (byte)
const PAYLOAD_LIMITS: Record<string, number> = {
  '/api/upload':          10 * 1024 * 1024,  // 10 MB  — dosya yükleme
  '/api/bot':            512 * 1024,          // 512 KB — bot API (min 200 kelime içerik)
  '/api/content':         2 * 1024 * 1024,    // 2 MB  — blog/ içerik (rich text + kod blokları)
  '/api/teklif':            32 * 1024,        // 32 KB  — teklif formu
  '/api/':             64 * 1024,        // 64 KB  —  post
  '/api/auth':               8 * 1024,        // 8 KB   — login/register
  '/api/admin':            256 * 1024,        // 256 KB — admin islemleri
};

const DEFAULT_PAYLOAD_LIMIT = 64 * 1024; // 64 KB — genel default

/**
 * Pathname'e göre payload boyut limitini döndürür.
 */
function getPayloadLimit(pathname: string): number {
  for (const [endpoint, limit] of Object.entries(PAYLOAD_LIMITS)) {
    if (pathname.startsWith(endpoint)) return limit;
  }
  return DEFAULT_PAYLOAD_LIMIT;
}

/**
 * Request body boyutunu kontrol eder.
 * Content-Length header'ı varsa hızlı kontrol yapar.
 * Yoksa body'yi okuyup kontrol eder (stream tüketilir — clone kullan).
 */
export function checkPayloadSize(req: NextRequest, pathname: string): NextResponse | null {
  const limit = getPayloadLimit(pathname);
  const contentLength = req.headers.get('content-length');

  if (contentLength) {
    const size = parseInt(contentLength, 10);
    if (!isNaN(size) && size > limit) {
      return NextResponse.json(
        {
          error: 'Payload Too Large',
          message: `Istek boyutu çok büyük. Maksimum: ${Math.round(limit / 1024)} KB`,
          limit,
        },
        {
          status: 413,
          headers: { 'Content-Length': '0' },
        }
      );
    }
  }

  return null; // OK
}

export interface RateLimitConfig {
  windowMs: number;      // Zaman penceresi (milisaniye)
  maxRequests: number;   // Maksimum istek sayısı
  keyPrefix?: string;    // Redis key prefix
  message?: string;      // Limit asıldıgında mesaj
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  limit: number;
  reset: number;         // Window reset timestamp
  retryAfter?: number;   // Tekrar deneme süresi (ms)
}

/**
 * Rate limit kontrolü yap
 * 
 * @param identifier - IP adresi veya user ID
 * @param config - Rate limit yapılandırması
 * @returns Rate limit sonucu
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const redis = getRedisClient();

  // Redis yoksa fail-open — istegi geçir (UX engellenmesin)
  // Rate limiting sadece Redis ile çalısır; Redis yoksa limitsiz çalısır.
  if (!redis) {
    return {
      success: true,
      remaining: config.maxRequests,
      limit: config.maxRequests,
      reset: Date.now() + config.windowMs,
    };
  }

  const prefix = config.keyPrefix || 'ratelimit';
  const key = `${prefix}:${identifier}`;
  const now = Date.now();
  const windowStart = now - config.windowMs;
  const reset = now + config.windowMs;

  try {
    // PERF: 4 ayrı Redis round-trip → pipeline ile tek sefere indirildi
    // zremrangebyscore + zcard + zadd + expire = 4 RTT → pipeline = 1 RTT
    const pipeline = redis.pipeline();
    pipeline.zremrangebyscore(key, 0, windowStart);
    pipeline.zcard(key);
    const pipelineResults = await pipeline.exec();

    // pipelineResults[1] = zcard sonucu (0 indexed, zremrangebyscore'dan sonra)
    const currentCount = (pipelineResults?.[1] as number) ?? 0;

    if (currentCount >= config.maxRequests) {
      const oldestRequest = await redis.zrange(key, 0, 0);
      const retryAfter = oldestRequest?.length > 0
        ? parseInt(oldestRequest[0] as string) + config.windowMs - now
        : config.windowMs;

      return {
        success: false,
        remaining: 0,
        limit: config.maxRequests,
        reset,
        retryAfter: Math.max(0, retryAfter),
      };
    }

    // Yeni istegi ekle + TTL pipeline'da
    const member = `${now}-${Math.random()}`;
    const addPipeline = redis.pipeline();
    addPipeline.zadd(key, { score: now, member });
    addPipeline.expire(key, Math.ceil(config.windowMs / 1000));
    await addPipeline.exec();

    return {
      success: true,
      remaining: Math.max(0, config.maxRequests - currentCount - 1),
      limit: config.maxRequests,
      reset,
    };
  } catch (error) {
    console.error('[RateLimit] Redis error:', error);
    // Redis hatasında da fail-open — servis erisilebilirligi öncelikli
    return {
      success: true,
      remaining: config.maxRequests,
      limit: config.maxRequests,
      reset: Date.now() + config.windowMs,
    };
  }
}

/**
 * Endpoint bazlı rate limit konfigürasyonları
 * Önceden middleware.ts içindeydi — tek kaynak burası.
 *
 * gENEL KURAL: Her IP, 10 dakikada maksimum 50 istek atabilir (100 → 50 DDoS saldırısı sonrası).
 * Hassas endpoint'ler (auth, upload, stream) daha düsük limitlerle korunur.
 * 
 * ⚠️ SALDIRI ÖNCESI NOT: Limitleri çok cömert ayarlamak = saldırganlar için aç kapı
 */
const ENDPOINT_RATE_LIMITS: Record<string, RateLimitConfig> = {
  '/api/teklif':     { windowMs: 10 * 60 * 1000,  maxRequests: 5,   message: 'Çok fazla teklif sorgusu' },
  '/api/bot':        { windowMs: 10 * 60 * 1000,  maxRequests: 15,  message: 'Bot API limit asıldı' },
  '/api/telegram':   { windowMs: 10 * 60 * 1000,  maxRequests: 20,  message: 'Telegram limit asıldı' },
  // görev 3.1 — Login brute-force koruması: 60 saniyede maks 10 istek
  '/login':          { windowMs: 60 * 1000,        maxRequests: 10,  message: 'Çok fazla giris denemesi. Lütfen bekleyin.' },
};

const DEFAULT_ENDPOINT_LIMIT: RateLimitConfig = {
  windowMs: 10 * 60 * 1000, // 10 dakika
  maxRequests: 200,          // ← genel kural: her IP 10 dakikada 200 istek (SEO optimizasyonu)
  message: 'API rate limit asıldı. Lütfen bekleyin.',
};

/**
 * Pathname'e göre dogru rate limit konfigürasyonunu döndürür.
 * Eslesme yoksa default limit uygulanır.
 */
export function getEndpointRateLimit(pathname: string): RateLimitConfig {
  for (const [endpoint, config] of Object.entries(ENDPOINT_RATE_LIMITS)) {
    if (pathname.startsWith(endpoint)) return config;
  }
  return DEFAULT_ENDPOINT_LIMIT;
}
