import {
  Smartphone, Palette, Code, Zap, Shield, Layers, Globe, Database,
  BarChart2,
} from "lucide-react";
import { BRAND_COLORS } from "@/config/brand.config";
import type { ServicePageData } from "./types";

export const webYazilimTasarimData: ServicePageData = {
  slug: "web-yazilim-tasarim",
  hasDistricts: true,
  metadata: {
    title: "Web Yazılım & Tasarım | XipSoft",
    description: "Profesyonel web yazılım ve tasarım hizmetleri. Next.js, React ile modern, hızlı ve SEO uyumlu web siteleri. Kurumsal web sitesi, e-ticaret, özel yazılım. Ücretsiz teklif alın!",
    keywords: ["web yazılım hizmetleri", "web tasarım", "profesyonel web sitesi", "next.js gelistirme", "react uygulama gelistirme", "responsive web tasarım", "seo uyumlu web sitesi", "e-ticaret sitesi kurma", "kurumsal web sitesi", "web yazılım sirketi istanbul"],
  },
  badge: "Web Çözümleri",
  badgeIcon: Globe,
  badgegradient: "from-cyan-500/10 to-violet-500/10",
  badgeColor: "text-cyan-400",
  title: "Web Yazılım & Tasarım",
  titlegradient: "from-rose-400 via-orange-400 to-yellow-400",
  subtitle: "Modern, hızlı ve SEO uyumlu Next.js/React web uygulamaları ile dijital varlıgınızı güçlendirin. Kurumsal web sitesinden e-ticaret platformuna, özel yazılımdan SaaS uygulamasına kadar her ölçekte çözüm.",
  heroCta: "Ücretsiz Teklif Al",
  stats: [
    { value: "150+", label: "Tamamlanan Proje" },
    { value: "15+", label: "Yıl Deneyim" },
    { value: "98%", label: "Müsteri Memnuniyeti" },
    { value: "2-8", label: "Hafta Teslimat" },
  ],
  statsgradient: "from-cyan-400 to-violet-400",
  features: [
    { icon: Smartphone, title: "Responsive Tasarım", description: "Tüm cihazlarda mükemmel görünen mobil-first yaklasımla tasarlanmıs arayüzler", color: BRAND_COLORS.secondary },
    { icon: Palette, title: "Modern UI/UX", description: "Kullanıcı deneyimi odakta, estetik ve fonksiyonel tasarım çözümleri", color: BRAND_COLORS.primary },
    { icon: Code, title: "Next.js & React", description: "SEO uyumlu, hızlı ve ölçeklenebilir web uygulamaları", color: BRAND_COLORS.accent },
    { icon: Zap, title: "Yüksek Performans", description: "Optimize edilmis kod yapısı ile ısık hızında sayfa yüklemeleri", color: BRAND_COLORS.gold },
    { icon: Shield, title: "güvenlik", description: "En son güvenlik standartlarına uygun, korumalı altyapı", color: "#34d399" },
    { icon: Layers, title: "Ölçeklenebilirlik", description: "Büyüyen is ihtiyaçlarınıza kolayca uyum saglayan esnek mimari", color: BRAND_COLORS.accent },
  ],
  techStack: [
    { name: "Next.js", color: "#ffffff" }, { name: "React", color: BRAND_COLORS.secondary },
    { name: "TypeScript", color: "#3b82f6" }, { name: "Node.js", color: "#34d399" },
    { name: "PostgreSQL", color: BRAND_COLORS.primary }, { name: "Tailwind CSS", color: BRAND_COLORS.secondary },
    { name: "Vercel", color: "#ffffff" }, { name: "Docker", color: "#3b82f6" },
  ],
  processSteps: [
    { step: "01", title: "Kesif & Analiz", description: "Ihtiyaçlarınızı dinler, rakip analizi yapar ve projeniz için en uygun teknik çözümü belirleriz.", color: BRAND_COLORS.secondary },
    { step: "02", title: "Tasarım & Prototip", description: "Figma ile wireframe ve yüksek kaliteli UI tasarımları olusturur, onayınızı alırız.", color: BRAND_COLORS.primary },
    { step: "03", title: "gelistirme", description: "Onaylanan tasarımı modern teknolojilerle hayata geçirir, düzenli ilerleme raporları sunarız.", color: BRAND_COLORS.accent },
    { step: "04", title: "Test & Optimizasyon", description: "Kapsamlı testler, performans optimizasyonu ve SEO denetimiyle sitenizi mükemmellestiririz.", color: BRAND_COLORS.gold },
    { step: "05", title: "Yayın & Destek", description: "Sitenizi canlıya alır, ekibinizi egitir ve süregelen teknik destek saglarız.", color: "#34d399" },
  ],
  packages: [
    { name: "Baslangıç", price: "₺15.000", desc: "Küçük isletmeler için", color: BRAND_COLORS.secondary, features: ["5 sayfaya kadar", "Responsive tasarım", "Temel SEO", "Iletisim formu", "3 ay destek"] },
    { name: "Profesyonel", price: "₺35.000", desc: "Büyüyen isletmeler için", color: BRAND_COLORS.primary, popular: true, features: ["15 sayfaya kadar", "Özel UI/UX tasarım", "gelismis SEO", "CMS entegrasyonu", "Blog & içerik yönetimi", "6 ay destek"] },
    { name: "Kurumsal", price: "Teklif Al", desc: "Büyük projeler için", color: BRAND_COLORS.accent, features: ["Sınırsız sayfa", "Özel yazılım gelistirme", "E-ticaret entegrasyonu", "API gelistirme", "Performans izleme", "12 ay destek"] },
  ],
  ctaTitle: "Projenizi Baslatalım",
  ctaDesc: "Hayalinizdeki web sitesini veya uygulamanızı birlikte olusturalım. Ücretsiz konsültasyon için hemen iletisime geçin.",
  ctaBtn: "Ücretsiz Teklif Al",
  microServices: [
    { title: "Next.js ile Modern Web Tasarımı & SSR Optimizasyonu", keywords: ["Next.js 14", "SSR", "SSg", "Core Web Vitals", "Vercel", "Edge Functions"], color: BRAND_COLORS.secondary, icon: Code, description: "Next.js tabanlı web siteleri, sunucu taraflı render (SSR) ve statik site olusturma (SSg) sayesinde hem hızlı hem SEO dostudur. Xipsoft olarak Next.js 14 ile gelistirdigimiz projelerde Core Web Vitals hedeflerini %100 karsılıyoruz. Müsterilerimize özel dinamik routing, edge functions ve image optimization entegrasyonu sunuyoruz.\n\nÖzellikle haber portalları, e-ticaret siteleri ve kisisellestirilmis dashboard'lar için idealdir." },
    { title: "Tailwind CSS ile Arayüz Tasarımı – Figma'dan Pixel-Perfect Çıktı", keywords: ["Tailwind CSS", "Utility-First", "Dark Mode", "Custom Theme", "Figma", "Responsive"], color: BRAND_COLORS.primary, icon: Palette, description: "Utility-first CSS yaklasımıyla responsive, dark mode destekli ve özellestirilebilir tema yapısına sahip arayüzler gelistiriyoruz. Figma tasarımlarını pixel-perfect olarak koda dönüstürüyoruz." },
    { title: "E-Ticaret Yazılımı – Medusa.js, Next.js veya Özel gelistirme", keywords: ["Medusa.js", "Next.js Commerce", "Iyzico", "Stripe", "Stok Yönetimi", "Headless"], color: BRAND_COLORS.accent, icon: Database, description: "Hazır e-ticaret platformlarının sınırlarını asmak isteyenler için Medusa.js (headless commerce), Next.js tabanlı özel gelistirme veya mevcut altyapınıza entegre çözümler sunuyoruz." },
    { title: "Kurumsal Web Paneli & Dashboard gelistirme", keywords: ["Dashboard", "Admin Panel", "Veri görsellestirme", "RBAC", "REST API"], color: BRAND_COLORS.gold, icon: BarChart2, description: "sirket içi operasyonları dijitallestirmek için özel web panelleri gelistiriyoruz. Satıs takibi, müsteri yönetimi (CRM), proje yönetimi ve raporlama ihtiyaçlarınız için sıfırdan sistemler tasarlıyoruz." },
    { title: "SaaS Uygulama gelistirme & Çok Kiracılı Mimari", keywords: ["SaaS", "Multi-tenant", "Abonelik Sistemi", "Stripe", "Ölçeklenebilir Mimari"], color: "#34d399", icon: Layers, description: "Kendi yazılım ürününüzü piyasaya sürmek istiyorsanız, SaaS mimarisi konusunda deneyimli ekibimiz yanınızda. Çok kiracılı (multi-tenant) veritabanı tasarımı, abonelik yönetimi ve otomatik faturalandırma sistemleri kuruyoruz." },
  ],
  faqTitle: "Web gelistirme Hakkında Sık Sorulan Sorular",
  faqItems: [
    { question: "Web sitenizi kaç günde teslim edebilirsiniz?", answer: "Proje büyüklügüne baglı olarak 2-8 hafta arasında degisir. Basit kurumsal siteler 2-3 haftada, kompleks uygulamalar 6-8 haftada teslim edilir." },
    { question: "Sitenin SEO optimizasyonu dahil mi?", answer: "Evet, tüm web projelerimizde on-page SEO optimizasyonu varsayılan olarak yer alır. Meta etiketler, yapılandırılmıs veri, sayfa hızı ve mobil uyumluluk gibi faktörleri optimize ederiz." },
    { question: "Responsif tasarım tüm cihazlarda çalısır mı?", answer: "Kesinlikle. Tüm web siteniz masaüstü, tablet ve mobil cihazlarda mükemmel görünecek sekilde tasarlanır ve test edilir." },
    { question: "Ödeme nasıl yapılır?", answer: "genellikle %50 ön ödeme, %50 proje tamamlanmasında ödeme seklindedir." },
  ],
};
