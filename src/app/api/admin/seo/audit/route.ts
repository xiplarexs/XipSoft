import { NextRequest, NextResponse } from "next/server";
import { extractAuthContext } from "@/lib/api-guard";
import { SITE_URL } from "@/lib/site-url";

export const runtime = "nodejs";

interface AuditItem {
  category: string;
  name: string;
  status: "ok" | "warning" | "error";
  message: string;
  fix?: string;
}

/**
 * gET /api/admin/seo/audit?url=https://xipsoft.net
 * Kapsamlı SEO denetimi yapar.
 */
export async function gET(req: NextRequest) {
  const ctx = await extractAuthContext(req);
  if (!ctx.isAuthenticated || ctx.userRole !== "admin") {
    return NextResponse.json({ ok: false, error: "Yetkisiz erisim" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const baseUrl = searchParams.get("url") || SITE_URL;
  const results: AuditItem[] = [];

  // 1. robots.txt kontrolü
  try {
    const res = await fetch(`${baseUrl}/robots.txt`, { signal: AbortSignal.timeout(5000) });
    const text = await res.text();
    results.push({
      category: "Erisim",
      name: "Robots.txt",
      status: res.ok ? "ok" : "error",
      message: res.ok ? "Erisilebilir" : "Erisilemiyor",
    });
    if (!text.includes("Sitemap:")) {
      results.push({
        category: "Erisim",
        name: "Sitemap Referansı",
        status: "warning",
        message: "robots.txt içinde Sitemap referansı yok",
        fix: "robots.txt'ye 'Sitemap: https://xipsoft.net/sitemap.xml' ekle",
      });
    }
    if (!text.includes("Disallow:")) {
      results.push({
        category: "Erisim",
        name: "Disallow Kuralları",
        status: "warning",
        message: "Disallow kuralı tanımlanmamıs",
        fix: "Admin ve API rotaları için Disallow kuralları ekle",
      });
    }
  } catch {
    results.push({
      category: "Erisim",
      name: "Robots.txt",
      status: "error",
      message: "Erisilemiyor",
    });
  }

  // 2. Sitemap kontrolü
  try {
    const res = await fetch(`${baseUrl}/sitemap.xml`, { signal: AbortSignal.timeout(5000) });
    const text = await res.text();
    const urlCount = (text.match(/<loc>/g) || []).length;
    results.push({
      category: "Dizin",
      name: "XML Sitemap",
      status: urlCount > 0 ? "ok" : "warning",
      message: `${urlCount} URL bulundu`,
    });

    // Sitemap boyutu kontrolü (50K limit)
    if (urlCount > 50000) {
      results.push({
        category: "Dizin",
        name: "Sitemap Boyutu",
        status: "warning",
        message: `${urlCount} URL — 50K limitine yaklasıyor`,
        fix: "Sitemap'ı parçalara ayır (sitemap-1.xml, sitemap-2.xml)",
      });
    }

    // son güncelleme tarihi
    const lastModMatch = text.match(/<lastmod>([^<]+)<\/lastmod>/);
    if (lastModMatch) {
      const lastMod = new Date(lastModMatch[1]!);
      const daysSince = Math.floor((Date.now() - lastMod.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSince > 30) {
        results.push({
          category: "Dizin",
          name: "Sitemap güncelleme",
          status: "warning",
          message: `Son güncelleme ${daysSince} gün önce`,
          fix: "Sitemap'ı daha sık güncelle veya otomatik güncelleme ekle",
        });
      }
    }
  } catch {
    results.push({
      category: "Dizin",
      name: "XML Sitemap",
      status: "error",
      message: "Erisilemiyor",
    });
  }

  // 3. Ana sayfa HTML analizi
  try {
    const res = await fetch(baseUrl, { signal: AbortSignal.timeout(5000) });
    const html = await res.text();

    // Title kontrolü
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch?.[1]?.trim() || "";
    if (!title) {
      results.push({
        category: "Meta",
        name: "Sayfa Baslıgı",
        status: "error",
        message: "Title tag eksik",
        fix: "Her sayfaya 50-60 karakterlik benzersiz title ekle",
      });
    } else if (title.length < 30) {
      results.push({
        category: "Meta",
        name: "Sayfa Baslıgı",
        status: "warning",
        message: `Title çok kısa (${title.length} karakter)`,
        fix: "Title'ı 50-60 karakter aralıgına getir",
      });
    } else if (title.length > 60) {
      results.push({
        category: "Meta",
        name: "Sayfa Baslıgı",
        status: "warning",
        message: `Title çok uzun (${title.length} karakter) — kesilebilir`,
        fix: "Title'ı 60 karakterden kısa tut",
      });
    } else {
      results.push({
        category: "Meta",
        name: "Sayfa Baslıgı",
        status: "ok",
        message: `${title.length} karakter — uygun`,
      });
    }

    // Meta description kontrolü
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
                      html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
    const desc = descMatch?.[1]?.trim() || "";
    if (!desc) {
      results.push({
        category: "Meta",
        name: "Meta Description",
        status: "error",
        message: "Meta description eksik",
        fix: "Her sayfaya 150-160 karakterlik description ekle",
      });
    } else if (desc.length < 120) {
      results.push({
        category: "Meta",
        name: "Meta Description",
        status: "warning",
        message: `Description çok kısa (${desc.length} karakter)`,
        fix: "Description'ı 150-160 karakter aralıgına getir",
      });
    } else if (desc.length > 160) {
      results.push({
        category: "Meta",
        name: "Meta Description",
        status: "warning",
        message: `Description çok uzun (${desc.length} karakter)`,
        fix: "Description'ı 160 karakterden kısa tut",
      });
    } else {
      results.push({
        category: "Meta",
        name: "Meta Description",
        status: "ok",
        message: `${desc.length} karakter — uygun`,
      });
    }

    // Canonical kontrolü
    const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
    if (!canonicalMatch) {
      results.push({
        category: "Meta",
        name: "Canonical URL",
        status: "warning",
        message: "Canonical URL tanımlanmamıs",
        fix: "Her sayfaya <link rel='canonical'> ekle",
      });
    } else {
      results.push({
        category: "Meta",
        name: "Canonical URL",
        status: "ok",
        message: "Tanımlı",
      });
    }

    // Open graph kontrolü
    const ogTags = ["og:title", "og:description", "og:image", "og:url", "og:type"];
    const missingOg = ogTags.filter((tag) => !html.includes(`property="${tag}"`) && !html.includes(`property='${tag}'`));
    if (missingOg.length > 0) {
      results.push({
        category: "Sosyal",
        name: "Open graph",
        status: "warning",
        message: `Eksik Og etiketleri: ${missingOg.join(", ")}`,
        fix: "Tüm Open graph etiketlerini ekle",
      });
    } else {
      results.push({
        category: "Sosyal",
        name: "Open graph",
        status: "ok",
        message: "Tüm Og etiketleri mevcut",
      });
    }

    // H1 kontrolü
    const h1Matches = html.match(/<h1[^>]*>/gi) || [];
    if (h1Matches.length === 0) {
      results.push({
        category: "Yapı",
        name: "H1 Etiketi",
        status: "error",
        message: "H1 etiketi bulunamadı",
        fix: "Her sayfaya tek bir H1 etiketi ekle",
      });
    } else if (h1Matches.length > 1) {
      results.push({
        category: "Yapı",
        name: "H1 Etiketi",
        status: "warning",
        message: `${h1Matches.length} adet H1 bulundu — ideal olan 1`,
        fix: "Tek H1 etiketi kullan, digerlerini H2-H6'ya çevir",
      });
    } else {
      results.push({
        category: "Yapı",
        name: "H1 Etiketi",
        status: "ok",
        message: "Tek H1 — uygun",
      });
    }

    // HTTPS kontrolü
    results.push({
      category: "güvenlik",
      name: "HTTPS",
      status: baseUrl.startsWith("https") ? "ok" : "error",
      message: baseUrl.startsWith("https") ? "HTTPS aktif" : "HTTPS kullanılmıyor",
    });

    // Lang attribute
    if (!html.includes("lang=")) {
      results.push({
        category: "Erisilebilirlik",
        name: "Dil Attribute",
        status: "warning",
        message: "HTML lang attribute eksik",
        fix: "<html lang='tr'> ekle",
      });
    }

  } catch {
    results.push({
      category: "Meta",
      name: "HTML Analizi",
      status: "error",
      message: "Ana sayfa erisilemedi",
    });
  }

  // Özet hesapla
  const summary = {
    total: results.length,
    ok: results.filter((r) => r.status === "ok").length,
    warnings: results.filter((r) => r.status === "warning").length,
    errors: results.filter((r) => r.status === "error").length,
    score: Math.round(
      (results.filter((r) => r.status === "ok").length / Math.max(results.length, 1)) * 100
    ),
  };

  return NextResponse.json({
    ok: true,
    url: baseUrl,
    audit: results,
    summary,
    fetchedAt: new Date().toISOString(),
  });
}
