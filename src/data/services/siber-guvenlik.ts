import {
  Shield, Server, FileCheck, Eye,
} from "lucide-react";
import { BRAND_COLORS } from "@/config/brand.config";
import type { ServicePageData } from "./types";

export const siberguvenlikData: ServicePageData = {
  slug: "siber-guvenlik",
  hasDistricts: true,
  metadata: {
    title: "Siber güvenlik Hizmetleri | XipSoft",
    description: "Profesyonel siber güvenlik hizmetleri. Penetrasyon testi, güvenlik denetimi, KVKK/gDPR uyumluluk, 7/24 tehdit izleme ve sosyal mühendislik testi. Ücretsiz güvenlik analizi!",
    keywords: ["siber güvenlik", "penetrasyon testi", "güvenlik denetimi", "kvkk uyumluluk", "sızma testi", "ag güvenligi", "web uygulama güvenligi"],
  },
  badge: "güvenlik Çözümleri",
  badgeIcon: Shield,
  badgegradient: "from-emerald-500/10 to-cyan-500/10",
  badgeColor: "text-emerald-400",
  title: "Siber güvenlik Hizmetleri",
  titlegradient: "from-rose-400 via-orange-400 to-yellow-400",
  subtitle: "Penetrasyon testi, güvenlik denetimi ve 7/24 tehdit izleme ile isinizi siber saldırılara karsı koruyoruz. KVKK ve gDPR uyumluluk danısmanlıgı ile yasal yükümlülüklerinizi yerine getirin.",
  heroCta: "Ücretsiz güvenlik Analizi",
  stats: [
    { value: "500+", label: "güvenlik Denetimi" },
    { value: "15+", label: "Yıl Deneyim" },
    { value: "7/24", label: "Tehdit Izleme" },
    { value: "0", label: "Veri Ihlali" },
  ],
  statsgradient: "from-cyan-400 to-violet-400",
  features: [
    { icon: Shield, title: "Proaktif Savunma", description: "Sistemlerinizdeki açıkları tespit edip saldırı öncesi kapanmasını saglıyoruz.", color: "#34d399" },
    { icon: Server, title: "Ag & Altyapı güvenligi", description: "Sunucu, ag ve bulut altyapınızı kapsamlı sekilde denetliyoruz.", color: BRAND_COLORS.secondary },
    { icon: FileCheck, title: "Uyumluluk ve Raporlama", description: "KVKK ve gDPR uyumlulugu, risk degerlendirmesi ve düzeltme yol haritası sunuyoruz.", color: BRAND_COLORS.gold },
    { icon: Eye, title: "Sosyal Mühendislik", description: "Çalısan egitimleri ve phishing simülasyonları ile insan hatasını azaltıyoruz.", color: BRAND_COLORS.primary },
  ],
  techStack: [],
  servicesTag: [
    { name: "Penetrasyon Testi", color: "#34d399" }, { name: "güvenlik Açıgı Taraması", color: BRAND_COLORS.secondary },
    { name: "Kod Inceleme", color: BRAND_COLORS.primary }, { name: "Ag güvenligi", color: BRAND_COLORS.gold },
    { name: "Bulut güvenligi", color: BRAND_COLORS.accent }, { name: "KVKK / gDPR", color: "#34d399" },
    { name: "Sosyal Mühendislik Testi", color: BRAND_COLORS.secondary }, { name: "Egitim & Farkındalık", color: BRAND_COLORS.primary },
  ],
  processSteps: [
    { step: "01", title: "Kapsam Belirleme", description: "Test edilecek sistemleri, agları ve uygulamaları belirler, yasal izinleri alırız.", color: "#34d399" },
    { step: "02", title: "Kesif & Tarama", description: "Açık portlar, servisler ve potansiyel güvenlik açıklarını tespit ederiz.", color: BRAND_COLORS.secondary },
    { step: "03", title: "Sızma Testi", description: "Tespit edilen açıkları kontrollü ortamda exploit ederek gerçek riski ölçeriz.", color: BRAND_COLORS.primary },
    { step: "04", title: "Analiz & Raporlama", description: "Bulgular, risk seviyeleri ve öncelikli düzeltme önerileriyle kapsamlı rapor sunarız.", color: BRAND_COLORS.gold },
    { step: "05", title: "Düzeltme & Dogrulama", description: "Açıkların kapatılmasına rehberlik eder, düzeltmeleri dogrularız.", color: BRAND_COLORS.accent },
  ],
  packages: [
    { name: "Temel", price: "₺8.000", desc: "Web uygulama güvenligi", color: "#34d399", features: ["Web uygulama pen testi", "OWASP Top 10 kontrolü", "güvenlik açıgı raporu", "Düzeltme önerileri", "1 ay destek"] },
    { name: "Kapsamlı", price: "₺20.000", desc: "Tam altyapı güvenligi", color: BRAND_COLORS.secondary, popular: true, features: ["Web + API pen testi", "Ag güvenligi taraması", "Sosyal mühendislik testi", "KVKK uyumluluk kontrolü", "Detaylı rapor", "3 ay destek"] },
    { name: "Kurumsal", price: "Teklif Al", desc: "Enterprise güvenlik", color: BRAND_COLORS.primary, features: ["Tam altyapı denetimi", "Red team operasyonu", "7/24 izleme", "gDPR/KVKK danısmanlık", "Egitim programı", "12 ay destek"] },
  ],
  ctaTitle: "Sisteminizi güvenli Hale getirelim",
  ctaDesc: "Siber tehditlere karsı proaktif koruma. güvenlik açıklarınızı tespit edelim ve kapatalım.",
  ctaBtn: "Ücretsiz güvenlik Analizi",
  microServices: [
    { title: "Web Uygulama Penetrasyon Testi (OWASP Top 10)", keywords: ["OWASP Top 10", "SQL Injection", "XSS", "CSRF", "API güvenligi"], color: "#34d399", icon: Shield, description: "Web uygulamalarınızı OWASP Top 10 metodolojisiyle test ediyoruz. SQL Injection, XSS, CSRF, IDOR gibi kritik açıkları gerçek saldırı senaryolarıyla tespit ediyoruz." },
    { title: "Ag & Altyapı güvenlik Denetimi", keywords: ["Ag Taraması", "Firewall Analizi", "VPN güvenligi", "Nmap / Metasploit"], color: BRAND_COLORS.secondary, icon: Server, description: "sirket agınızın tüm katmanlarını güvenlik açısından denetliyoruz. Bulut altyapısı (AWS, Azure, gCP) güvenlik denetimi de hizmetlerimiz arasında." },
    { title: "KVKK & gDPR Uyumluluk Danısmanlıgı", keywords: ["KVKK", "gDPR", "Veri Envanteri", "DPO Danısmanlıgı"], color: BRAND_COLORS.gold, icon: FileCheck, description: "KVKK ve gDPR kapsamında sirketinizin yasal yükümlülüklerini yerine getirmesi için uçtan uca danısmanlık hizmeti sunuyoruz." },
    { title: "Sosyal Mühendislik Testi & güvenlik Farkındalık Egitimi", keywords: ["Phishing Simülasyonu", "Vishing", "Çalısan Egitimi", "Red Team"], color: BRAND_COLORS.primary, icon: Eye, description: "Siber saldırıların %90'ı insan faktörünü hedef alır. Phishing e-posta simülasyonları ile çalısanlarınızın farkındalık seviyesini ölçüyoruz." },
  ],
  faqTitle: "Siber güvenlik Hakkında Sık Sorulan Sorular",
  faqItems: [
    { question: "Penetrasyon testi nedir ve neden gereklidir?", answer: "Penetrasyon testi, sistemlerinizin güvenlik açıklarını gerçek saldırı senaryolarıyla test etme sürecidir." },
    { question: "KVKK ve gDPR uyumluluk denetimi yapıyor musunuz?", answer: "Evet, KVKK ve gDPR gerekliliklerine uygunluk denetimi yapıyor, eksiklikleri raporluyoruz." },
    { question: "Test sırasında sistemlerimiz çalısmaya devam eder mi?", answer: "Evet, testleri üretim ortamını etkilemeyecek sekilde planlıyoruz." },
  ],
};
