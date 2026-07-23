import withNextIntl from 'next-intl/plugin';
import path from "path";
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

let withBundleAnalyzer = (config) => config;
try {
  const analyzer = require("@next/bundle-analyzer");
  if (analyzer && typeof analyzer.withBundleAnalyzer === "function") {
    withBundleAnalyzer = analyzer.withBundleAnalyzer({
      enabled: process.env.ANALYZE === "true",
    });
  }
} catch (err) {
  console.warn("[Config] Bundle Analyzer not available, skipping");
}

const withNextIntlPlugin = withNextIntl("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  devIndicators: false,
  compress: true,
  productionBrowserSourceMaps: false, // Source map'ler production'da kapalı — bundle küçülür, hız artar
  // SWC: modern tarayıcılar için gereksiz polyfill'leri devre dısı bırak
  // browserslist: chrome 109+, firefox 115+, safari 16+, edge 109+
  // Array.prototype.at, Object.hasOwn, flatMap vb. artık natif destekleniyor
  compiler: {
    // emotion veya styled-components kullanmıyoruz; removeConsole sadece prod'da
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  // Make all API routes dynamic to avoid build-time database access
  experimental: {
    optimizePackageImports: ["lucide-react", "motion/react", "framer-motion", "date-fns", "react-icons"],
    scrollRestoration: true,
    optimizeCss: true, // critters ile critical CSS inline — render-blocking CSS azaltır
  },
  // Prefetch'i kapat — çok fazla _rsc istegi olusmasını engeller
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // pg ve argon2 modülleri server-side'da çalıssın, bundle'a girmesin
  // argon2: native C++ binding — Vercel'de bundle edilirse crash eder
  // isomorphic-dompurify + jsdom: ESM uyumsuzlugu — server bundle'dan dısla
  serverExternalPackages: ["pg", "argon2", "isomorphic-dompurify", "jsdom"],
  webpack: (config, { isServer, dev }) => {
    // tsconfig-paths-webpack-plugin — tsconfig.json'daki paths'i webpack'e aktarır
    // Vercel webpack modunda @/* alias'larının çözülmesi için gerekli
    try {
      const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
      config.resolve.plugins = [
        ...(config.resolve.plugins || []),
        new TsconfigPathsPlugin({ configFile: path.resolve(__dirname, "tsconfig.json") }),
      ];
    } catch (e) {
      // plugin yoksa devam et — manuel alias'lar devreye girer
    }

    // ÖNEMLI: @/seobot/* alias'ları "@" alias'ından ÖNCE tanımlanmalı.
    // Webpack alias eslesmesinde daha spesifik olanlar önce gelirse öncelik onlarda olur.
    // "@" → "src/" tanımı sonradan spread edilirse @/seobot/* üzerine yazamaz.
    const seobotAliases = {
      "@/seobot/components/StructuredData": path.resolve(__dirname, "src/lib/seo/structured-data"),
      "@/seobot/schema-registry": path.resolve(__dirname, "src/lib/seo/schema-registry"),
      "@/seobot/db-seo-settings": path.resolve(__dirname, "src/lib/seo/db-seo-settings"),
      "@/seobot/components": path.resolve(__dirname, "src/lib/seo"),
      "@/seobot": path.resolve(__dirname, "src/lib/seo"),
    };

    // src/ altındaki tüm klasörler için explicit alias — webpack'in tsconfig'den
    // otomatik üretemedigi durumlarda (Vercel webpack modu) fallback olarak çalısır
    const srcAliases = {
      "@/hooks": path.resolve(__dirname, "src/hooks"),
      "@/components": path.resolve(__dirname, "src/components"),
      "@/lib": path.resolve(__dirname, "src/lib"),
      "@/context": path.resolve(__dirname, "src/context"),
      "@/utils": path.resolve(__dirname, "src/utils"),
      "@/config": path.resolve(__dirname, "src/config"),
      "@/styles": path.resolve(__dirname, "src/styles"),
      "@/types": path.resolve(__dirname, "src/types"),
      "@/fonts": path.resolve(__dirname, "src/fonts"),
      "@/data": path.resolve(__dirname, "src/data"),
      "@/services": path.resolve(__dirname, "src/services"),
      "@/app": path.resolve(__dirname, "src/app"),
    };

    config.resolve.alias = {
      ...seobotAliases,          // önce seobot alias'ları
      ...srcAliases,             // src/ klasör alias'ları
      ...config.resolve.alias,   // mevcut alias'lar (Next.js'in tsconfig'den ürettikleri dahil)
      "@": path.resolve(__dirname, "src"),  // en sona — genel fallback
    };

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        pg: false,
      };
    }

    return config;
  },
  typescript: {
    // UYARI: ignoreBuildErrors kaldırıldı.
    // Bu flag açıkken TypeScript hataları build'i durdurmaz ve hatalı kod
    // production'a deploy edilir. gerçek bir güvenlik sirketi için kabul edilemez.
    // Derleme hatası varsa burada susturmak yerine düzeltilmelidir.
  },
  sassOptions: {
    includePaths: ["./styles"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "xipsoft.net" },
      { protocol: "https", hostname: "xipsoft.com" },
      { protocol: "https", hostname: "www.googletagmanager.com" },
      { protocol: "https", hostname: "static.cloudflareinsights.com" },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 31536000,
    contentDispositionType: "attachment",
    unoptimized: false,
  },
  async redirects() {
    return [
      // ── .html uzantılı eski sayfa URL'leri → temiz URL (301) ───────────────
      // /herhangi/bir/sayfa.html → /herhangi/bir/sayfa
      { source: "/:path*.html", destination: "/:path*", permanent: true },

      // ── /forum/* → /blog (301) — eski forum URL'leri ─────────────────────
      { source: "/forum",          destination: "/blog", permanent: true },
      { source: "/forum/:path*",   destination: "/blog", permanent: true },

      // ── /blog/post?slug=xxx → /blog/xxx (301) ─────────────────────────────
      // Not: Next.js query param matching desteklemez; slug'lı yönlendirme
      // blog/post/page.tsx içindeki permanentRedirect ile yapılıyor.
      // Bu kural sadece slug'sız /blog/post isteklerini yakalar.
      { source: "/blog/post", destination: "/blog", permanent: true },

      // ── /index → / (301) ──────────────────────────────────────────────────
      { source: "/index", destination: "/", permanent: true },

      // Quick fixes for 404s reported in gSC
      { source: "/jobs",       destination: "/", permanent: true },
      { source: "/download",   destination: "/", permanent: true },
      { source: "/DeaFSoft",   destination: "/", permanent: true },
      { source: "/DeaFSoft/:path*", destination: "/", permanent: true },

      // ── /services/* → /hizmetler/* (301 — SEO juice korunur) ──────────────
      { source: "/services/web",      destination: "/hizmetler/web-yazilim-tasarim",   permanent: true },
      { source: "/services/mobile",   destination: "/hizmetler/mobil-uygulama",        permanent: true },
      { source: "/services/desktop",  destination: "/hizmetler/masaustu-yazilim",      permanent: true },
      { source: "/services/security", destination: "/hizmetler/siber-guvenlik",        permanent: true },
      { source: "/services/seo",      destination: "/hizmetler/seo-dijital-pazarlama", permanent: true },

      // ── Eski WordPress URL'leri → Ana sayfa (301) ─────────────────────────
      { source: "/drop-search", destination: "/", permanent: true },
      { source: "/clan",        destination: "/", permanent: true },
      { source: "/live",        destination: "/", permanent: true },

      // ── /contact → /contact-us (301) ──────────────────────────────────────
      { source: "/contact", destination: "/contact-us", permanent: true },
      { source: "/iletisim", destination: "/contact-us", permanent: true },
      { source: "/hakkinda", destination: "/about", permanent: true },

      // ── Additional 404 fixes for WordPress migration ───────────────────────
      { source: "/category/:slug*", destination: "/blog", permanent: true },
      { source: "/tag/:slug*", destination: "/blog", permanent: true },
      { source: "/author/:slug*", destination: "/blog", permanent: true },
      { source: "/page/:slug*", destination: "/blog", permanent: true },
      { source: "/feed", destination: "/blog", permanent: true },
      { source: "/comments/feed", destination: "/blog", permanent: true },
      { source: "/wp-admin", destination: "/", permanent: true },
      { source: "/wp-content/:path*", destination: "/", permanent: true },
      { source: "/wp-includes/:path*", destination: "/", permanent: true },
      { source: "/xmlrpc.php", destination: "/", permanent: true },
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/services", destination: "/hizmetler/web-yazilim-tasarim", permanent: true },
      { source: "/portfolio", destination: "/references", permanent: true },
      { source: "/team", destination: "/about", permanent: true },
      { source: "/careers", destination: "/", permanent: true },
      { source: "/news", destination: "/blog", permanent: true },
      { source: "/posts", destination: "/blog", permanent: true },
      { source: "/article/:slug*", destination: "/blog/:slug*", permanent: true },

    ];
  },

  async rewrites() {
    return [
      // IndexNow Key Rewrite: /[key].txt → /api/seo/indexnow-key?key=[key]
      {
        source: "/:key([0-9a-fA-Z]{8,64}).txt",
        destination: "/api/seo/indexnow-key?key=:key",
      },
    ];
  },
  async headers() {
    const isDev = process.env.NODE_ENV === "development";
    return [
      {
        // Demo sayfaları — CDN Tailwind + google Fonts'a izin ver
        source: "/demos/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https://cdn.tailwindcss.com",
            ].join("; "),
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Vary", value: "Accept-Encoding" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Cross-Origin-Embedder-Policy", value: "unsafe-none" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
          { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
        ],
      },
      {
        // manifest.webmanifest — PWA, 10 dakikada bir yenile
        source: "/:path*(manifest\\.webmanifest|manifest\\.json)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=600, stale-while-revalidate=600" },
        ],
      },
      {
        source: "/:path*(svg|png|jpg|jpeg|webp|gif|ico)$",
        headers: [
          {
            key: "Cache-Control",
            value: isDev ? "no-store" : "public, max-age=31536000, immutable",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
      // /_next/static için özel Cache-Control kaldırıldı.
      // Next.js bu path'i zaten kendi yönetiyor; override edilirse dev ortamı bozuluyor.
      {
        source: "/:all*(svg|woff|woff2|ttf|eot)$",
        headers: [
          {
            key: "Cache-Control",
            value: isDev ? "no-store" : "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*.(css|js)$",
        headers: [
          {
            key: "Cache-Control",
            value: isDev ? "no-store" : "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

const config = withBundleAnalyzer(withNextIntlPlugin(nextConfig));

export default config;
