import { MetadataRoute } from 'next'
import { ISTANBUL_DISTRICTS } from '@/data/locations'
import { SITE_URL } from '@/lib/site-url'
import pool from '@/lib/database'

export const revalidate = 300

/**
 * generateSitemaps — Next.js otomatik sitemap index üretir.
 * /sitemap/0.xml → statik sayfalar + ilçe URL'leri
 * /sitemap/1.xml → blog yazıları (DB'den)
 *
 * google Search Console'a yalnızca /sitemap.xml ekleyin;
 * Next.js tüm alt sitemap'leri <sitemapindex> olarak döndürür.
 */
export async function generateSitemaps() {
  return [{ id: 0 }, { id: 1 }]
}

export default async function sitemap({
  id,
}: {
  id: number
}): Promise<MetadataRoute.Sitemap> {
  const BASE = SITE_URL.replace(/\/+$/, '')
  const now = new Date()

  // ── Statik sayfalar + ilçe URL'leri (id=0) ──────────────────────────────
  if (id === 0) {
    try {
      const staticPages: MetadataRoute.Sitemap = [
        { url: BASE,                        lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
        { url: `${BASE}/about`,             lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
        { url: `${BASE}/blog`,              lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
        { url: `${BASE}/products`,          lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
        { url: `${BASE}/references`,        lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${BASE}/hizmetler/web-yazilim-tasarim`,      lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
        { url: `${BASE}/hizmetler/mobil-uygulama`,           lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
        { url: `${BASE}/hizmetler/masaustu-yazilim`,         lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
        { url: `${BASE}/hizmetler/siber-guvenlik`,           lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
        { url: `${BASE}/hizmetler/seo-dijital-pazarlama`,    lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
        { url: `${BASE}/hizmetler/yapay-zeka-otomasyon`,     lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
        { url: `${BASE}/hizmetler/bulut-devops`,             lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
        { url: `${BASE}/hizmetler/api-entegrasyon`,          lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
        { url: `${BASE}/hizmetler/veri-analizi-bi`,          lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
        ...ISTANBUL_DISTRICTS.flatMap((district) => [
          { url: `${BASE}/hizmetler/web-yazilim-tasarim/${district.slug}`,   lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 },
          { url: `${BASE}/hizmetler/mobil-uygulama/${district.slug}`,        lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 },
          { url: `${BASE}/hizmetler/seo-dijital-pazarlama/${district.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 },
          { url: `${BASE}/hizmetler/masaustu-yazilim/${district.slug}`,      lastModified: now, changeFrequency: 'monthly' as const, priority: 0.75 },
          { url: `${BASE}/hizmetler/siber-guvenlik/${district.slug}`,        lastModified: now, changeFrequency: 'monthly' as const, priority: 0.75 },
        ]),
        { url: `${BASE}/how-to`,            lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
        { url: `${BASE}/contact-us`,        lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE}/cookie-policy`,     lastModified: now, changeFrequency: 'weekly',  priority: 0.6 },
        { url: `${BASE}/privacy-policy`,    lastModified: now, changeFrequency: 'weekly',  priority: 0.6 },
        { url: `${BASE}/terms-of-service`,  lastModified: now, changeFrequency: 'weekly',  priority: 0.6 },
        { url: `${BASE}/istanbul-yazilim-sirketi`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
      ]
      return staticPages
    } catch {
      // DB veya baska bir hata — en azından root URL'yi döndür
      return [{ url: BASE, lastModified: now, changeFrequency: 'weekly', priority: 1.0 }]
    }
  }

  // ── Blog yazıları (id=1) ─────────────────────────────────────────────────
  try {
    const result = await pool.query<{
      slug: string
      published_at: string | null
      updated_at: string | null
    }>(
      `SELECT slug, published_at, updated_at
       FROM blog_posts
       WHERE status = 'published' AND deleted_at IS NULL
       ORDER BY published_at DESC
       LIMIT 1000`
    )

    return result.rows.map((post) => {
      const lastmod = post.updated_at || post.published_at || now.toISOString()
      return {
        url: `${BASE}/blog/${encodeURIComponent(post.slug)}`,
        lastModified: new Date(lastmod),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }
    })
  } catch {
    // DB hatası — bos dizi döndür, sitemap index bozulmasın
    return []
  }
}
