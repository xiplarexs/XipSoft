import localFont from "next/font/local";
import {
  Plus_Jakarta_Sans,
  JetBrains_Mono,
} from "next/font/google";

// ─── DISPLAY / BAsLIK FONTU — glass (local TTF) ────────────────────────────────
// Menüler, baslıklar, hero tipografisi için
export const displayFont = localFont({
  src: "./glass.ttf",
  variable: "--font-display",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

// ─── NAVBAR FONTU — navbar (local TTF) ────────────────────────────────────────
// Navbar menü maddelerinin fontu
export const navbarFont = localFont({
  src: "./navbar.ttf",
  variable: "--font-navbar",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

// ─── BODY / IÇERIK FONTU ──────────────────────────────────────────────────────
// Plus Jakarta Sans — temiz, okunabilir, genel metin için
export const bodyFont = Plus_Jakarta_Sans({
  weight: ["400", "600"],
  subsets: ["latin", "latin-ext"], // latin-ext eklendi — Türkçe g,s,ü,ö,ç,I,ı destegi
  variable: "--font-body",
  display: "swap",
  preload: true, // ana içerik fontu — öncelikli yükle
});

// ─── MONO / KOD FONTU ─────────────────────────────────────────────────────────
// JetBrains Mono — kod blokları ve teknik içerik için
export const monoFont = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin", "latin-ext"], // latin-ext eklendi — terminal Türkçe karakter destegi
  variable: "--font-mono",
  display: "swap",
  preload: false, // kod bloklarında kullanılır — lazy yükle
});

// ─── ALIASES (geriye dönük uyumluluk) ─────────────────────────────────────────
export const titleFont = displayFont;
export const titleFontBold = displayFont;
export const bodyFontBase = bodyFont;

// Kaldırılan fontlar için stub — import eden bilesenler bozulmasın
export const Font = { className: "", variable: "" } as const;
