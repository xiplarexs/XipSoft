import {
  Search, BarChart2, TrendingUp, Target, Globe, MousePointer,
} from "lucide-react";
import { BRAND_COLORS } from "@/config/brand.config";
import type { ServicePageData } from "./types";

export const seoDijitalPazarlamaData: ServicePageData = {
  slug: "seo-dijital-pazarlama",
  hasDistricts: true,
  metadata: {
    title: "SEO & Dijital Pazarlama | XipSoft",
    description: "Profesyonel SEO ve dijital pazarlama hizmetleri. Teknik SEO, içerik stratejisi, google Ads, backlink yönetimi ve local SEO. google'da üst sıralara çıkın. Ücretsiz SEO analizi!",
    keywords: ["seo hizmetleri", "dijital pazarlama", "teknik seo", "google ads", "içerik stratejisi", "backlink", "local seo", "core web vitals", "seo danısmanlıgı"],
  },
  badge: "Dijital Büyüme",
  badgeIcon: BarChart2,
  badgegradient: "from-rose-500/10 to-orange-500/10",
  badgeColor: "text-rose-400",
  title: "SEO & Dijital Pazarlama",
  titlegradient: "from-rose-400 via-orange-400 to-yellow-400",
  subtitle: "google, Yandex ve diger arama motorlarında üst sıralara çıkın. Teknik SEO'dan içerik stratejisine, google Ads'ten sosyal medyaya kapsamlı dijital pazarlama çözümleri.",
  heroCta: "Ücretsiz SEO Analizi",
  stats: [
    { value: "200+", label: "SEO Projesi" },
    { value: "15+", label: "Yıl Deneyim" },
    { value: "%340", label: "Ort. Trafik Artısı" },
    { value: "6-12", label: "Ay Sonuç Süresi" },
  ],
  statsgradient: "from-violet-400 to-cyan-400",
  features: [
    { icon: Search, title: "Teknik SEO", description: "Hız, Core Web Vitals, schema markup ve altyapı iyilestirmesiyle google'ın teknik standartlarına uyum saglıyoruz.", color: BRAND_COLORS.accent },
    { icon: BarChart2, title: "Analitik & Raporlama", description: "google Analytics, Search Console ve performans verileriyle aylık seffaf raporlama sunuyoruz.", color: BRAND_COLORS.secondary },
    { icon: TrendingUp, title: "Içerik Stratejisi", description: "Dönüstüren, hedef kitleye dokunan ve SEO uyumlu içerik planları hazırlıyoruz.", color: BRAND_COLORS.primary },
    { icon: Target, title: "Anahtar Kelime Arastırması", description: "Rakip analizi ve search intent bazlı kelime haritası ile kazandıran kelimeleri seçiyoruz.", color: BRAND_COLORS.gold },
    { icon: Globe, title: "Backlink Yönetimi", description: "Otorite sitelerden dogal backlink kazanımı ve profil temizligi ile güven saglıyoruz.", color: "#34d399" },
    { icon: MousePointer, title: "Dönüsüm Optimizasyonu", description: "Web trafigini müsteriye çeviren CRO çalısmaları ve A/B testlerle dönüsümü artırıyoruz.", color: BRAND_COLORS.accent },
  ],
  techStack: [],
  servicesTag: [
    { name: "Anahtar Kelime Arastırması", color: BRAND_COLORS.accent }, { name: "Teknik SEO Denetimi", color: BRAND_COLORS.secondary },
    { name: "Içerik Stratejisi", color: BRAND_COLORS.primary }, { name: "Backlink Yönetimi", color: BRAND_COLORS.gold },
    { name: "Local SEO", color: "#34d399" }, { name: "E-Ticaret SEO", color: BRAND_COLORS.accent },
    { name: "google Ads", color: BRAND_COLORS.secondary }, { name: "Core Web Vitals", color: "#34d399" },
  ],
  processSteps: [
    { step: "01", title: "SEO Denetimi", description: "Teknik durum, pozisyonlar ve rakip analiziyle baslıyoruz.", color: BRAND_COLORS.accent },
    { step: "02", title: "Strateji gelistirme", description: "Hedef ve bütçenize özel yol haritası çıkarıyoruz.", color: BRAND_COLORS.secondary },
    { step: "03", title: "Teknik Optimizasyon", description: "Hız, mobil uyum ve schema iyilestirmeleriyle teknik borcu kapatıyoruz.", color: BRAND_COLORS.primary },
    { step: "04", title: "Içerik & Link gelistirme", description: "Deger üreten içerik ve kaliteli backlinklerle otoritenizi yükseltiyoruz.", color: BRAND_COLORS.gold },
    { step: "05", title: "Izleme & Raporlama", description: "Her ay neyin ise yaradıgını görüp stratejiyi güncelliyoruz.", color: "#34d399" },
  ],
  packages: [
    { name: "Baslangıç", price: "₺3.500/ay", desc: "Küçük isletmeler için", color: BRAND_COLORS.accent, features: ["10 anahtar kelime", "Teknik SEO denetimi", "Aylık 4 içerik", "google Search Console", "Aylık rapor"] },
    { name: "Büyüme", price: "₺7.500/ay", desc: "Büyüyen isletmeler için", color: BRAND_COLORS.secondary, popular: true, features: ["30 anahtar kelime", "Teknik SEO + Core Web Vitals", "Aylık 8 içerik", "Backlink yönetimi", "google Ads yönetimi", "Haftalık rapor"] },
    { name: "Kurumsal", price: "Teklif Al", desc: "Büyük ölçekli projeler", color: BRAND_COLORS.primary, features: ["Sınırsız anahtar kelime", "Tam teknik SEO", "Içerik ekibi", "Sosyal medya yönetimi", "Çoklu platform reklamları", "günlük izleme"] },
  ],
  ctaTitle: "Dijital Varlıgınızı Büyütelim",
  ctaDesc: "SEO ve dijital pazarlama stratejilerimizle görünürlügünüzü artırın, daha fazla müsteriye ulasın.",
  ctaBtn: "Ücretsiz SEO Analizi",
  microServices: [
    { title: "Teknik SEO & Core Web Vitals Optimizasyonu", keywords: ["Core Web Vitals", "LCP", "CLS", "INP", "Schema Markup"], color: BRAND_COLORS.accent, icon: Search, description: "google'ın sıralama algoritmalarında teknik faktörler giderek daha belirleyici hale geliyor. LCP, CLS ve INP metriklerini optimize ederek sitenizi google'ın teknik standartlarına tam uyumlu hale getiriyoruz." },
    { title: "Local SEO & google Isletme Profili Optimizasyonu", keywords: ["Local Pack", "google Isletme Profili", "NAP Tutarlılıgı", "Yerel Atıflar"], color: "#34d399", icon: Target, description: "Yerel aramalarda google Haritalar'da üst sıralara çıkmak için Local SEO stratejisi uyguluyoruz." },
    { title: "Içerik Stratejisi & SEO Odaklı Blog Yönetimi", keywords: ["Içerik Takvimi", "Anahtar Kelime Kümeleme", "E-E-A-T", "Pillar Page"], color: BRAND_COLORS.primary, icon: TrendingUp, description: "google'ın E-E-A-T kriterlerine uygun içerik stratejisi gelistiriyoruz." },
    { title: "google Ads & Performans Pazarlama", keywords: ["google Ads", "Arama Agı", "görüntülü Reklam", "ROAS Optimizasyonu"], color: BRAND_COLORS.secondary, icon: BarChart2, description: "SEO'nun uzun vadeli büyümesini beklerken google Ads ile anında görünürlük kazanıyorsunuz." },
  ],
  faqTitle: "SEO & Dijital Pazarlama Hakkında Sık Sorulan Sorular",
  faqItems: [
    { question: "SEO çalısmaları ne zaman sonuç verir?", answer: "SEO uzun vadeli bir yatırımdır. Ilk 3 ay temel altyapı kurulur, 4-6 ay arasında ilk sıralama degisimleri görülür." },
    { question: "google Ads ile SEO arasındaki fark nedir?", answer: "google Ads ücretli reklam olup anında sonuç verir ancak bütçe bitince durur. SEO organik büyümedir, kalıcıdır." },
    { question: "Local SEO nedir, bana gerekli mi?", answer: "Local SEO, bölgesel aramalarda google Haritalar'da yüksek sıralamaya getirmedir. Yerel isletmeler için kritiktir." },
  ],
};
