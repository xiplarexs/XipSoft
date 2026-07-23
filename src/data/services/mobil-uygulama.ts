import {
  Smartphone, Globe, Layers, Monitor, Zap, Shield, Code,
} from "lucide-react";
import { BRAND_COLORS } from "@/config/brand.config";
import type { ServicePageData } from "./types";

export const mobilUygulamaData: ServicePageData = {
  slug: "mobil-uygulama",
  hasDistricts: true,
  metadata: {
    title: "Mobil Uygulama gelistirme | XipSoft",
    description: "iOS, Android ve cross-platform mobil uygulama gelistirme. React Native, Flutter, Swift, Kotlin ile modern mobil çözümler. App Store ve google Play yayını. Ücretsiz teklif alın!",
    keywords: ["mobil uygulama gelistirme", "ios uygulama", "android uygulama", "react native", "flutter", "swift", "kotlin", "cross-platform mobil gelistirme", "app store yayın"],
  },
  badge: "Mobil Çözümler",
  badgeIcon: Smartphone,
  badgegradient: "from-cyan-500/10 to-violet-500/10",
  badgeColor: "text-cyan-400",
  title: "Mobil Uygulama gelistirme",
  titlegradient: "from-rose-400 via-orange-400 to-yellow-400",
  subtitle: "iOS, Android ve cross-platform mobil uygulamalar. Fikrinizi App Store ve google Play'de milyonlara ulastırıyoruz. React Native, Flutter, Swift ve Kotlin ile modern, hızlı ve güvenli çözümler.",
  heroCta: "Ücretsiz Teklif Al",
  stats: [
    { value: "80+", label: "Yayınlanan Uygulama" },
    { value: "15+", label: "Yıl Deneyim" },
    { value: "iOS+Android", label: "Platform Destegi" },
    { value: "3-9", label: "Ay Teslimat" },
  ],
  statsgradient: "from-violet-400 to-rose-400",
  features: [
    { icon: Smartphone, title: "iOS Uygulamaları", description: "Native Swift/SwiftUI ile App Store'da mükemmel performans ve kullanıcı deneyimi", color: BRAND_COLORS.secondary },
    { icon: Globe, title: "Android Uygulamaları", description: "Kotlin/Java ile google Play Store'da yüksek kaliteli Android çözümleri", color: "#34d399" },
    { icon: Layers, title: "Cross-Platform", description: "React Native ve Flutter ile tek kod tabanı, iOS ve Android'de aynı kalite", color: BRAND_COLORS.primary },
    { icon: Monitor, title: "macOS Uygulamaları", description: "Mac App Store için native macOS masaüstü uygulamaları", color: BRAND_COLORS.accent },
    { icon: Zap, title: "Yüksek Performans", description: "Optimize edilmis mobil deneyim, hızlı açılıs ve akıcı animasyonlar", color: BRAND_COLORS.gold },
    { icon: Shield, title: "güvenlik", description: "Biometric auth, data encryption ve en son mobil güvenlik standartları", color: "#34d399" },
  ],
  techStack: [
    { name: "React Native", color: BRAND_COLORS.secondary }, { name: "Flutter", color: "#3b82f6" },
    { name: "Swift", color: BRAND_COLORS.accent }, { name: "Kotlin", color: BRAND_COLORS.primary },
    { name: "Expo", color: "#ffffff" }, { name: "Firebase", color: BRAND_COLORS.gold },
    { name: "Node.js", color: "#34d399" }, { name: "graphQL", color: BRAND_COLORS.accent },
  ],
  processSteps: [
    { step: "01", title: "Fikir & Analiz", description: "Hedef kitlenizi, rakiplerinizi ve uygulama gereksinimlerini analiz ederek en uygun teknik yolu belirleriz.", color: BRAND_COLORS.secondary },
    { step: "02", title: "UI/UX Tasarım", description: "Figma ile wireframe ve yüksek kaliteli mobil arayüz tasarımları olusturur, onayınızı alırız.", color: BRAND_COLORS.primary },
    { step: "03", title: "gelistirme", description: "Seçilen teknoloji ile uygulamayı gelistirirken düzenli demo ve ilerleme raporları sunarız.", color: BRAND_COLORS.accent },
    { step: "04", title: "Test & QA", description: "gerçek cihazlarda kapsamlı testler, performans optimizasyonu ve güvenlik denetimleri yaparız.", color: BRAND_COLORS.gold },
    { step: "05", title: "Store Yayını", description: "App Store ve google Play'de yayın sürecini bastan sona yönetir, ASO optimizasyonu yaparız.", color: "#34d399" },
  ],
  packages: [
    { name: "MVP", price: "₺25.000", desc: "Hızlı pazar testi için", color: BRAND_COLORS.secondary, features: ["Temel özellikler", "1 platform (iOS veya Android)", "Basit UI/UX", "3 ay destek", "Store yayını"] },
    { name: "Profesyonel", price: "₺55.000", desc: "Büyüyen isletmeler için", color: BRAND_COLORS.primary, popular: true, features: ["iOS + Android", "Özel UI/UX tasarım", "Backend API", "Push bildirimler", "Analytics entegrasyonu", "6 ay destek"] },
    { name: "Kurumsal", price: "Teklif Al", desc: "Büyük ölçekli projeler", color: BRAND_COLORS.accent, features: ["Tüm platformlar", "Özel backend", "Admin paneli", "gelismis güvenlik", "Performans izleme", "12 ay destek"] },
  ],
  ctaTitle: "Mobil Uygulamanızı Olusturalım",
  ctaDesc: "Fikrinizi gerçege dönüstürüyoruz. iOS, Android veya cross-platform çözümlerimizle tanısalım.",
  ctaBtn: "Ücretsiz Teklif Al",
  microServices: [
    { title: "Native Mobil Uygulama gelistirme – Swift & Kotlin", keywords: ["SwiftUI", "Jetpack Compose", "Firebase", "Push Bildirim", "Biyometrik Auth", "CI/CD"], color: BRAND_COLORS.accent, icon: Smartphone, description: "iOS için SwiftUI, Android için Jetpack Compose ile performans odaklı native uygulamalar gelistiriyoruz. Firebase entegrasyonu, push bildirimleri, offline storage ve biyometrik kimlik dogrulama standart çözümlerimiz arasında." },
    { title: "React Native ile Cross-Platform Mobil Uygulama", keywords: ["React Native", "Expo", "iOS & Android", "OTA güncelleme", "Tek Kod Tabanı"], color: BRAND_COLORS.secondary, icon: Globe, description: "React Native ile tek bir kod tabanından hem iOS hem Android için yüksek kaliteli uygulamalar gelistiriyoruz. Maliyet avantajı: Iki ayrı native uygulama yerine tek gelistirme süreci, %40-60 daha düsük bütçe." },
    { title: "Flutter ile Yüksek Performanslı Cross-Platform Uygulama", keywords: ["Flutter", "Dart", "Skia Render", "iOS & Android & Web", "Material 3"], color: "#34d399", icon: Layers, description: "Flutter, Dart diliyle yazılmıs ve kendi render motorunu kullanan bir framework. Özellikle özel animasyonlar ve karmasık UI bilesenleri gerektiren projelerde Flutter tercih ediyoruz." },
    { title: "PWA gelistirme", keywords: ["PWA", "Service Worker", "Offline Çalısma", "Push Bildirim", "App Store'suz Kurulum"], color: BRAND_COLORS.primary, icon: Code, description: "Native uygulama bütçesi olmadan mobil uygulama deneyimi sunmak isteyenler için PWA ideal çözümdür. E-ticaret, haber portalları ve kurumsal intranet uygulamaları için uygun." },
  ],
  faqTitle: "Mobil Uygulama Hakkında Sık Sorulan Sorular",
  faqItems: [
    { question: "Mobil uygulama gelistirme ne kadar sürer?", answer: "Proje kapsamına baglı olarak 3-9 ay sürebilmektedir." },
    { question: "iOS ve Android ayrı ayrı gelistirilmeli mi?", answer: "React Native veya Flutter gibi cross-platform çözümlerle tek kod tabanıyla her iki platform için uygulama gelistirmek mümkündür." },
    { question: "Uygulamamı App Store ve google Play'de nasıl yayınlayacagız?", answer: "Yayın sürecini tamamen yönetiyoruz. Developer Account olusturma, sertifika ayarlaması ve yayın islemlerini ekibimiz yapıyor." },
  ],
};
