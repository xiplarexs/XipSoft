import {
  Monitor, Terminal, Layers, Zap, Shield, Cloud, Database,
} from "lucide-react";
import { BRAND_COLORS } from "@/config/brand.config";
import type { ServicePageData } from "./types";

export const masaustuYazilimData: ServicePageData = {
  slug: "masaustu-yazilim",
  hasDistricts: true,
  metadata: {
    title: "Masaüstü Yazılım gelistirme | XipSoft",
    description: "Windows, macOS ve Linux için masaüstü yazılım gelistirme. .NET, Electron, Qt, Tauri ile kurumsal çözümler. Profesyonel masaüstü uygulama. Ücretsiz teklif alın!",
    keywords: ["masaüstü yazılım", "windows uygulama gelistirme", "macos uygulama", "electron uygulama", ".net gelistirme", "cross-platform masaüstü", "kurumsal yazılım"],
  },
  badge: "Masaüstü Çözümler",
  badgeIcon: Monitor,
  badgegradient: "from-amber-500/10 to-orange-500/10",
  badgeColor: "text-amber-400",
  title: "Masaüstü Yazılım gelistirme",
  titlegradient: "from-rose-400 via-orange-400 to-yellow-400",
  subtitle: "Windows, macOS ve Linux için güçlü, güvenli ve kullanıcı dostu masaüstü uygulamaları. Kurumsal ERP'den özel is yazılımına, cross-platform çözümlerden native uygulamalara kadar her ihtiyaç için.",
  heroCta: "Ücretsiz Teklif Al",
  stats: [
    { value: "60+", label: "Kurumsal Proje" },
    { value: "15+", label: "Yıl Deneyim" },
    { value: "3 Platform", label: "Win/Mac/Linux" },
    { value: "2-8", label: "Ay Teslimat" },
  ],
  statsgradient: "from-amber-400 to-orange-400",
  features: [
    { icon: Monitor, title: "Windows Uygulamaları", description: ".NET, WPF, WinForms ile kurumsal Windows masaüstü çözümleri", color: BRAND_COLORS.secondary },
    { icon: Terminal, title: "macOS Uygulamaları", description: "Swift, Cocoa ile native macOS deneyimi sunan uygulamalar", color: BRAND_COLORS.primary },
    { icon: Layers, title: "Linux Uygulamaları", description: "Qt, gTK+ ile açık kaynak Linux masaüstü yazılımları", color: "#34d399" },
    { icon: Zap, title: "Yüksek Performans", description: "Sistem kaynaklarını optimize kullanan hızlı masaüstü yazılımları", color: BRAND_COLORS.gold },
    { icon: Shield, title: "Kurumsal güvenlik", description: "RBAC, audit logging ve enterprise-grade güvenlik standartları", color: BRAND_COLORS.accent },
    { icon: Cloud, title: "Bulut Entegrasyonu", description: "AWS, Azure, google Cloud ile senkronize çalısan akıllı uygulamalar", color: BRAND_COLORS.secondary },
  ],
  techStack: [
    { name: ".NET / C#", color: BRAND_COLORS.primary }, { name: "Electron", color: BRAND_COLORS.secondary },
    { name: "Qt", color: "#34d399" }, { name: "Swift", color: BRAND_COLORS.accent },
    { name: "Python", color: BRAND_COLORS.gold }, { name: "Rust", color: BRAND_COLORS.accent },
    { name: "WPF", color: BRAND_COLORS.secondary }, { name: "Tauri", color: "#34d399" },
  ],
  processSteps: [
    { step: "01", title: "gereksinim Analizi", description: "Is süreçlerinizi, mevcut sistemlerinizi ve entegrasyon ihtiyaçlarınızı detaylı analiz ederiz.", color: BRAND_COLORS.secondary },
    { step: "02", title: "Mimari Tasarım", description: "Ölçeklenebilir, güvenli ve bakımı kolay yazılım mimarisi tasarlarız.", color: BRAND_COLORS.primary },
    { step: "03", title: "gelistirme", description: "Seçilen teknoloji stack ile uygulamayı gelistirirken düzenli demo sunarız.", color: BRAND_COLORS.accent },
    { step: "04", title: "Test & güvenlik", description: "Kapsamlı unit/integration testler, güvenlik denetimleri ve performans optimizasyonu.", color: BRAND_COLORS.gold },
    { step: "05", title: "Dagıtım & Destek", description: "Kurulum, kullanıcı egitimi ve süregelen teknik destek saglarız.", color: "#34d399" },
  ],
  packages: [
    { name: "Temel", price: "₺20.000", desc: "Küçük isletmeler için", color: BRAND_COLORS.secondary, features: ["Tek platform", "Temel özellikler", "Basit UI", "Offline çalısma", "3 ay destek"] },
    { name: "Profesyonel", price: "₺50.000", desc: "Orta ölçekli isletmeler", color: BRAND_COLORS.primary, popular: true, features: ["Çoklu platform", "Özel UI/UX", "Bulut entegrasyonu", "Kullanıcı yönetimi", "Raporlama", "6 ay destek"] },
    { name: "Kurumsal", price: "Teklif Al", desc: "Büyük ölçekli projeler", color: BRAND_COLORS.accent, features: ["Tüm platformlar", "ERP/CRM entegrasyonu", "gelismis güvenlik", "Özel modüller", "SLA garantisi", "12 ay destek"] },
  ],
  ctaTitle: "Masaüstü Uygulamanızı gelistirelim",
  ctaDesc: "Isletmeniz için güçlü, güvenli ve kullanıcı dostu masaüstü yazılımları olusturuyoruz.",
  ctaBtn: "Ücretsiz Teklif Al",
  microServices: [
    { title: ".NET / C# ile Kurumsal Windows Uygulaması", keywords: [".NET 8", "WPF", "WinForms", "MSSQL", "Active Directory"], color: BRAND_COLORS.primary, icon: Monitor, description: ".NET 8 ve WPF ile kurumsal Windows uygulamaları gelistiriyoruz. ERP, CRM, stok yönetimi, muhasebe ve üretim takip sistemleri için tercih edilen teknoloji yıgını." },
    { title: "Electron ile Cross-Platform Masaüstü Uygulama", keywords: ["Electron", "Windows + Mac + Linux", "Web Teknolojisi", "Auto-Update", "Offline"], color: BRAND_COLORS.secondary, icon: Layers, description: "Electron ile tek kod tabanından Windows, macOS ve Linux için masaüstü uygulamalar gelistiriyoruz. VS Code, Slack ve Discord gibi uygulamalar Electron ile gelistirilmistir." },
    { title: "Tauri ile Hafif ve güvenli Masaüstü Uygulama", keywords: ["Tauri", "Rust Backend", "Düsük Bellek", "güvenli", "Küçük Boyut"], color: "#34d399", icon: Zap, description: "Electron'a modern alternatif olan Tauri ile çok daha küçük boyutlu ve düsük bellek tüketen masaüstü uygulamalar gelistiriyoruz." },
    { title: "Python ile Veri Analizi & Otomasyon Araçları", keywords: ["Python", "PyQt6", "Pandas", "Otomasyon", "Veri Analizi"], color: BRAND_COLORS.gold, icon: Database, description: "Python ve PyQt6 ile veri analizi, raporlama ve is süreçleri otomasyonu için masaüstü araçlar gelistiriyoruz." },
  ],
  faqTitle: "Masaüstü Yazılım Hakkında Sık Sorulan Sorular",
  faqItems: [
    { question: "Masaüstü uygulama gelistirme süresi nedir?", answer: "Proje kapsamına göre 2-8 ay arası degisir." },
    { question: "Windows, macOS ve Linux için ayrı gelistirme gerekli mi?", answer: "Electron veya Qt gibi cross-platform framework'ler kullanarak bir kez gelistirip tüm platformlarda çalıstırabiliriz." },
    { question: "Masaüstü uygulaması offline çalısabilir mi?", answer: "Evet, offline-first mimarisiyle tasarlayabiliriz." },
  ],
};
