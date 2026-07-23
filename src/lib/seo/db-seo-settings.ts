/**
 * db-seo-settings.ts — SEO metadata yardımcıları
 */
import { Metadata } from "next";
import pool from "@/lib/database";

interface SeoSettings {
  site_title?: string;
  site_description?: string;
  google_analytics_id?: string;
  google_ads_id?: string;
  yandex_metrica_id?: string;
  google_search_console_id?: string;
  bing_verification_id?: string;
  yandex_verification_id?: string;
  auto_generate_meta?: boolean;
  disallow_paths?: string[];
  allow_paths?: string[];
}

// Basit in-memory cache — her request'te DB sorgusu yapılmasın
let cachedSettings: SeoSettings | null = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 dakika

export async function getSEOSettings(forceRefresh = false): Promise<SeoSettings> {
  const now = Date.now();
  if (!forceRefresh && cachedSettings && now - cacheTime < CACHE_TTL) {
    return cachedSettings;
  }

  if (!process.env.DATABASE_URL) {
    return {};
  }

  try {
    const { rows } = await pool.query(
      "SELECT site_title, site_description, google_analytics_id, google_ads_id, yandex_metrica_id, google_search_console_id, bing_verification_id, yandex_verification_id, auto_generate_meta, disallow_paths, allow_paths FROM seo_settings ORDER BY updated_at DESC LIMIT 1"
    );
    cachedSettings = rows[0] ?? {};
    cacheTime = now;
    return cachedSettings!;
  } catch {
    return cachedSettings ?? {};
  }
}

/**
 * Pathname veya options objesiyle çagrılabilir.
 * geriye dönük uyumluluk: generateAutoMetadata('/path') veya generateAutoMetadata({ title, ... })
 */
export async function generateAutoMetadata(
  pathOrOptions: string | { title?: string; description?: string; url?: string; image?: string; type?: "website" | "article" }
): Promise<Metadata> {
  const settings = await getSEOSettings();

  if (typeof pathOrOptions === "string") {
    // Pathname ile çagrıldı — DB'den genel ayarları döndür
    return {
      title: settings.site_title,
      description: settings.site_description,
      robots: settings.auto_generate_meta !== false
        ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } }
        : undefined,
    };
  }

  // Options objesi ile çagrıldı
  return {
    title: pathOrOptions.title ?? settings.site_title,
    description: pathOrOptions.description ?? settings.site_description,
    opengraph: {
      title: pathOrOptions.title ?? settings.site_title,
      description: pathOrOptions.description ?? settings.site_description,
      url: pathOrOptions.url,
      images: pathOrOptions.image ? [{ url: pathOrOptions.image }] : [],
      type: pathOrOptions.type ?? "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pathOrOptions.title ?? settings.site_title,
      description: pathOrOptions.description ?? settings.site_description,
      images: pathOrOptions.image ? [pathOrOptions.image] : [],
    },
  };
}
