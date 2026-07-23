import {
  Code2, Globe, Link2, Webhook, GitMerge, Shield, Lock,
} from "lucide-react";
import { BRAND_COLORS } from "@/config/brand.config";
import type { ServicePageData } from "./types";

export const apiEntegrasyonData: ServicePageData = {
  slug: "api-entegrasyon",
  metadata: {
    title: "API gelistirme & Entegrasyon Hizmetleri | XipSoft",
    description: "REST API, graphQL, webhook ve mikroservis gelistirme. ERP/CRM entegrasyonu, ödeme sistemi baglantısı ve API güvenligi. Profesyonel API çözümleri. Ücretsiz teklif alın!",
    keywords: ["api gelistirme", "rest api", "graphql", "entegrasyon", "webhook", "mikroservis", "erp entegrasyonu", "api güvenligi"],
  },
  badge: "API Çözümleri",
  badgeIcon: Code2,
  badgegradient: "from-cyan-500/10 to-violet-500/10",
  badgeColor: "text-cyan-400",
  title: "API gelistirme & Entegrasyon",
  titlegradient: "from-rose-400 via-orange-400 to-yellow-400",
  subtitle: "REST, graphQL ve mikroservis mimarileriyle sistemlerinizi birbirine baglayın. Ödeme sistemleri, ERP/CRM entegrasyonu ve webhook yönetimi ile is süreçlerinizi otomatize edin.",
  heroCta: "Ücretsiz Teklif Al",
  stats: [
    { value: "200+", label: "API gelistirme" },
    { value: "50+", label: "Entegrasyon" },
    { value: "%99.9", label: "API Uptime" },
    { value: "2-6", label: "Hafta Teslimat" },
  ],
  statsgradient: "from-cyan-400 to-violet-400",
  features: [
    { icon: Code2, title: "REST API gelistirme", description: "Standartlara uygun, güvenli ve ölçeklenebilir REST API'ler tasarlıyor ve gelistiriyoruz", color: BRAND_COLORS.secondary },
    { icon: Globe, title: "graphQL API", description: "Tek endpoint üzerinden esnek sorgulama, over-fetching sorununu çözüyoruz", color: BRAND_COLORS.primary },
    { icon: Link2, title: "3. Parti Entegrasyon", description: "ERP, CRM, ödeme sistemleri ve sosyal medya platformlarıyla sorunsuz entegrasyon", color: BRAND_COLORS.accent },
    { icon: Webhook, title: "Webhook Yönetimi", description: "Olay tabanlı bildirimler ile sistemleriniz arasında anlık veri akısı saglıyoruz", color: BRAND_COLORS.gold },
    { icon: GitMerge, title: "Microservices Mimarisi", description: "Bagımsız, ölçeklenebilir servislerden olusan modern uygulama mimarisi", color: "#34d399" },
    { icon: Shield, title: "API güvenligi", description: "OAuth 2.0, JWT, rate limiting ve OWASP API Security Top 10 uyumlu güvenlik", color: BRAND_COLORS.secondary },
  ],
  techStack: [
    { name: "REST API", color: BRAND_COLORS.secondary }, { name: "graphQL", color: BRAND_COLORS.accent },
    { name: "Node.js", color: "#34d399" }, { name: "FastAPI", color: BRAND_COLORS.gold },
    { name: "Swagger", color: BRAND_COLORS.primary }, { name: "OAuth 2.0", color: BRAND_COLORS.secondary },
    { name: "Stripe", color: "#3b82f6" }, { name: "Kafka", color: "#ffffff" },
  ],
  processSteps: [
    { step: "01", title: "Ihtiyaç Analizi", description: "Entegrasyon gereksinimlerinizi, veri akıslarını ve güvenlik ihtiyaçlarınızı analiz ederiz.", color: BRAND_COLORS.secondary },
    { step: "02", title: "API Tasarımı", description: "OpenAPI/Swagger standardında API seması ve endpoint yapısını tasarlarız.", color: BRAND_COLORS.primary },
    { step: "03", title: "gelistirme & Test", description: "API'yi gelistirir, unit ve integration testlerle dogrularız.", color: BRAND_COLORS.accent },
    { step: "04", title: "güvenlik & Performans", description: "Rate limiting, authentication, yük testi ve güvenlik taraması yaparız.", color: BRAND_COLORS.gold },
    { step: "05", title: "Dökümantasyon & Destek", description: "Interaktif API dökümantasyonu hazırlar, ekibinizi egitir ve destek saglarız.", color: "#34d399" },
  ],
  packages: [
    { name: "Baslangıç", price: "₺12.000", desc: "Tek entegrasyon için", color: BRAND_COLORS.secondary, features: ["1 API gelistirme veya entegrasyon", "Swagger dökümantasyonu", "JWT authentication", "Temel rate limiting", "3 ay destek"] },
    { name: "Profesyonel", price: "₺32.000", desc: "Çoklu entegrasyon için", color: BRAND_COLORS.primary, popular: true, features: ["5 API / entegrasyon", "graphQL veya REST", "OAuth 2.0 & API key yönetimi", "Webhook sistemi", "Monitoring & alerting", "6 ay destek"] },
    { name: "Kurumsal", price: "Teklif Al", desc: "Büyük ölçekli sistemler için", color: BRAND_COLORS.accent, features: ["Sınırsız API & entegrasyon", "Microservices mimarisi", "API gateway kurulumu", "SLA garantisi", "7/24 izleme", "12 ay destek"] },
  ],
  ctaTitle: "Sistemlerinizi Birbirine Baglayalım",
  ctaDesc: "API ve entegrasyon çözümlerimizle is süreçlerinizi otomatize edin.",
  ctaBtn: "Ücretsiz Teklif Al",
  microServices: [
    { title: "REST API gelistirme ve Tasarımı", keywords: ["OpenAPI", "Swagger", "REST", "Versioning", "Pagination"], color: BRAND_COLORS.secondary, icon: Code2, description: "RESTful prensiplere uygun, anlasılır ve tutarlı API'ler gelistiriyoruz. OpenAPI 3.0 standardında Swagger dökümantasyonu hazırlıyoruz." },
    { title: "ERP, CRM ve Kurumsal Sistem Entegrasyonları", keywords: ["SAP", "Salesforce", "Logo", "Netsis", "Microsoft Dynamics"], color: BRAND_COLORS.primary, icon: Link2, description: "SAP, Oracle, Microsoft Dynamics, Logo gibi popüler ERP sistemleriyle entegrasyon deneyimimiz var." },
    { title: "Ödeme Sistemi Entegrasyonları", keywords: ["Stripe", "iyzico", "PayTR", "3D Secure", "Abonelik"], color: BRAND_COLORS.accent, icon: Lock, description: "Stripe, iyzico, PayTR gibi ödeme altyapılarını uygulamanıza entegre ediyoruz." },
    { title: "Webhook ve Olay Tabanlı Entegrasyon", keywords: ["Webhook", "Event-Driven", "RabbitMQ", "Kafka"], color: "#34d399", icon: Webhook, description: "Stripe, Shopify, gitHub gibi platformların webhook'larını alıp isleyen sistemler kuruyoruz." },
  ],
  faqTitle: "API gelistirme Hakkında Sık Sorulan Sorular",
  faqItems: [
    { question: "REST API ile graphQL arasındaki fark nedir?", answer: "REST API kaynak bazlı, basit ve yaygın kullanımlıdır. graphQL ise tek endpoint üzerinden esnek sorgulama saglar." },
    { question: "API güvenligi nasıl saglanıyor?", answer: "OAuth 2.0, JWT token, API key yönetimi, rate limiting ve HTTPS zorunlulugu standart önlemlerimizdir." },
    { question: "API dökümantasyonu saglıyor musunuz?", answer: "Evet, Swagger/OpenAPI standardında interaktif API dökümantasyonu hazırlıyoruz." },
  ],
};
