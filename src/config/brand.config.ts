/**
 * XipSoft — Marka Merkezi Konfigürasyonu
 *
 * Bu dosyayı degistirince tüm sistemde (navbar, , anasayfa, footer,
 * favicon, manifest, SEO meta tagları) otomatik güncellenir.
 */

// ─── KIMLIK ──────────────────────────────────────────────────────────────────

export const BRAND = {
  name: "Xipsoft Software & Technology Systems",
  shortName: "Xipsoft",
  tagline: "Yazılım & Teknoloji Sistemleri",
  description:
    "Yazılımda güven, tasarımda fark, sonuçta mükemmellik. Web, mobil, masaüstü ve siber güvenlik çözümleri.",
  url: process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://xipsoft.net",
  email: "info@xipsoft.net",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "905444548444",
} as const;

// ─── RENKLER ─────────────────────────────────────────────────────────────────

export const BRAND_COLORS = {
  primary: "#a78bfa",       // prism-violet
  secondary: "#22d3ee",     // prism-cyan
  accent: "#fb7185",        // prism-rose
  gold: "#fbbf24",          // accent-gold
  background: "#050507",    // obsidian (daha koyu)
  themeColor: "#050507",    // PWA theme color
  manifestBg: "#483b97",    // manifest background_color
} as const;

// ─── IKONLAR & LOgO ──────────────────────────────────────────────────────────

export const BRAND_ICONS = {
  favicon: "/images/favicon.ico",
  appleTouchIcon: "/media/logo.webp",
  safariPinnedTab: "/images/favicon.ico",
  logo: "/media/logo.webp",
  homebar: "/media/homebar.webp",
  ogImage: "/images/xipsoft-seo.png",
  // PWA ikonları
  icon192: "/media/logo.webp",
  icon384: "/media/logo.webp",
  icon512: "/media/logo.webp",
} as const;

// ─── SAYFA RENKLERI ──────────────────────────────────────────────────────────
// Her sayfanın kendine özgü accent rengi. Tüm CTA butonları, vurgular buradan alır.
export const PAgE_ACCENTS: Record<string, string> = {
  home:        "#fbbf24",  // amber  — anasayfa
  about:       "#a78bfa",  // violet — hakkımızda
  references:  "#22d3ee",  // cyan   — referanslar
  services:    "#a78bfa",  // violet — hizmetler
  aboutWhy:    "#fb7185",  // rose   — hakkımızda neden xipsoft
  refSectors:  "#fbbf24",  // amber  — referanslar sektörler
} as const;

// ─── KURUMSAL / YASAL BILgILER ───────────────────────────────────────────────
// Tek kaynak — footer, iletisim, hakkımızda, yasal sayfalar buradan çeker.

export const BRAND_COMPANY = {
  legalName:    "XipSoft Yazılım ve Teknoloji Sistemleri",
  address:      "Nurol Tower, Izzet Pasa, Yeni Yol Cd. No:3 Kat:22, 34381 sisli / Istanbul",
  addressShort: "Nurol Tower, Kat:22, sisli / Istanbul",
  district:     "sisli",
  city:         "Istanbul",
  postalCode:   "34381",
  country:      "Türkiye",
  countryCode:  "TR",
  phone:        "+90 544 454 84 44",
  email:        "info@xipsoft.net",
  taxOffice:    "", // örn: "Mecidiyeköy Vergi Dairesi"
  taxNumber:    "", // örn: "1234567890"
  mersisNo:     "", // örn: "0123456789000001"
  foundingYear: 2010,
  geo: {
    lat: 41.0682,
    lng: 28.9862,
  },
  mapsUrl:      "https://maps.google.com/?q=Nurol+Tower+Mecidiyekoy+Sisli+Istanbul&ll=41.0682,28.9862",
  workingHours: "Pazartesi – Cuma, 09:00 – 18:00",
} as const;
