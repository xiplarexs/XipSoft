import {
  BarChart2, Database, RefreshCw, TrendingUp, FileText, Shield,
} from "lucide-react";
import { BRAND_COLORS } from "@/config/brand.config";
import type { ServicePageData } from "./types";

export const veriAnaliziBiData: ServicePageData = {
  slug: "veri-analizi-bi",
  metadata: {
    title: "Veri Analizi & BI Hizmetleri | Business Intelligence | XipSoft",
    description: "Power BI, Tableau dashboard gelistirme, veri ambarı (DWH) kurulumu, ETL pipeline ve tahminsel analiz. Verilerinizi anlamlı raporlara dönüstürün. Ücretsiz teklif alın!",
    keywords: ["veri analizi", "business intelligence", "power bi", "tableau", "veri ambarı", "etl pipeline", "veri görsellestirme", "bi danısmanlık"],
  },
  badge: "Veri & Analitik",
  badgeIcon: BarChart2,
  badgegradient: "from-violet-500/10 to-cyan-500/10",
  badgeColor: "text-violet-400",
  title: "Veri Analizi & BI",
  titlegradient: "from-rose-400 via-orange-400 to-yellow-400",
  subtitle: "Power BI, Tableau ve özel dashboard çözümleriyle verilerinizi anlamlı raporlara dönüstürün. Veri ambarı kurulumu, ETL pipeline ve tahminsel analiz ile isletmenizin veri odaklı kararlar almasını saglayın.",
  heroCta: "Ücretsiz Teklif Al",
  stats: [
    { value: "80+", label: "BI Projesi" },
    { value: "10M+", label: "Islenen Veri" },
    { value: "15+", label: "Yıl Deneyim" },
    { value: "4-12", label: "Hafta Teslimat" },
  ],
  statsgradient: "from-violet-400 to-cyan-400",
  features: [
    { icon: BarChart2, title: "BI Dashboard", description: "Power BI, Tableau veya özel React dashboard ile verilerinizi anlık görsellestirin", color: BRAND_COLORS.primary },
    { icon: Database, title: "Veri Ambarı (DWH)", description: "Farklı kaynaklardan gelen veriyi tek, tutarlı bir veri ambarında birlestiriyoruz", color: BRAND_COLORS.secondary },
    { icon: RefreshCw, title: "ETL Pipeline", description: "Otomatik veri çekme, dönüstürme ve yükleme süreçleriyle verileriniz her zaman güncel", color: BRAND_COLORS.accent },
    { icon: TrendingUp, title: "Tahminsel Analiz", description: "geçmis verilerden gelecek trendleri öngören makine ögrenmesi modelleri", color: BRAND_COLORS.gold },
    { icon: FileText, title: "Otomatik Raporlama", description: "günlük, haftalık, aylık raporlar otomatik olusturulur ve e-posta ile iletilir", color: "#34d399" },
    { icon: Shield, title: "Veri güvenligi", description: "RBAC, veri maskeleme ve KVKK uyumlu veri isleme süreçleri standart olarak uygulanır", color: BRAND_COLORS.secondary },
  ],
  techStack: [
    { name: "Power BI", color: BRAND_COLORS.gold }, { name: "Tableau", color: BRAND_COLORS.secondary },
    { name: "PostgreSQL", color: "#3b82f6" }, { name: "Apache Spark", color: BRAND_COLORS.accent },
    { name: "dbt", color: "#34d399" }, { name: "Airflow", color: BRAND_COLORS.primary },
    { name: "Python", color: BRAND_COLORS.gold }, { name: "Metabase", color: BRAND_COLORS.secondary },
  ],
  processSteps: [
    { step: "01", title: "Veri Kesfi", description: "Mevcut veri kaynaklarınızı, kalitesini ve is ihtiyaçlarınızı analiz ederiz.", color: BRAND_COLORS.primary },
    { step: "02", title: "Mimari Tasarım", description: "Veri ambarı seması, ETL akısları ve dashboard yapısını tasarlarız.", color: BRAND_COLORS.secondary },
    { step: "03", title: "ETL & Entegrasyon", description: "Veri kaynaklarını baglar, dönüsüm kurallarını uygular ve pipeline'ları devreye alırız.", color: BRAND_COLORS.accent },
    { step: "04", title: "Dashboard gelistirme", description: "Is kullanıcılarının ihtiyacına göre görsel raporlar ve interaktif dashboard'lar hazırlarız.", color: BRAND_COLORS.gold },
    { step: "05", title: "Egitim & Destek", description: "Ekibinizi dashboard kullanımı konusunda egitir, süregelen destek saglarız.", color: "#34d399" },
  ],
  packages: [
    { name: "Baslangıç", price: "₺15.000", desc: "KOBI'ler için", color: BRAND_COLORS.primary, features: ["3 veri kaynagı entegrasyonu", "Power BI / Metabase dashboard", "Haftalık otomatik rapor", "Temel ETL pipeline", "3 ay destek"] },
    { name: "Profesyonel", price: "₺38.000", desc: "Büyüyen isletmeler için", color: BRAND_COLORS.secondary, popular: true, features: ["10 veri kaynagı entegrasyonu", "Özel dashboard gelistirme", "günlük ETL pipeline", "Veri ambarı kurulumu", "Tahminsel analiz modeli", "6 ay destek"] },
    { name: "Kurumsal", price: "Teklif Al", desc: "Büyük ölçekli veri için", color: BRAND_COLORS.accent, features: ["Sınırsız veri kaynagı", "Real-time streaming analiz", "ML tabanlı tahmin modelleri", "KVKK uyumluluk", "SLA garantisi", "12 ay destek"] },
  ],
  ctaTitle: "Verilerinizi Kesfedin",
  ctaDesc: "BI ve veri analitigi çözümlerimizle isletmenizin veri odaklı kararlar almasını saglayın.",
  ctaBtn: "Ücretsiz Teklif Al",
  microServices: [
    { title: "Power BI & Tableau Dashboard gelistirme", keywords: ["Power BI", "Tableau", "DAX", "KPI Takibi", "Drill-down"], color: BRAND_COLORS.gold, icon: BarChart2, description: "Satıs, finans, operasyon ve müsteri verilerinizi anlık takip edebileceginiz interaktif dashboard'lar gelistiriyoruz." },
    { title: "Veri Ambarı (DWH) Tasarımı ve Kurulumu", keywords: ["Star Schema", "BigQuery", "Redshift", "dbt", "Veri Modelleme"], color: BRAND_COLORS.primary, icon: Database, description: "ERP, CRM, e-ticaret gibi farklı sistemlerdeki veriyi tek bir veri ambarında birlestiriyoruz." },
    { title: "ETL / ELT Pipeline gelistirme ve Otomasyonu", keywords: ["Apache Airflow", "Python", "API Entegrasyonu", "Veri Temizleme"], color: BRAND_COLORS.secondary, icon: RefreshCw, description: "Farklı kaynaklardan veri çeken, temizleyen ve hedef sisteme yükleyen otomatik pipeline'lar kuruyoruz." },
    { title: "Tahminsel Analiz ve Makine Ögrenmesi Modelleri", keywords: ["Python", "Scikit-learn", "Zaman Serisi", "Talep Tahmini", "Churn Analizi"], color: "#34d399", icon: TrendingUp, description: "geçmis satıs verilerinden gelecek döneme ait talep tahminleri yapıyoruz." },
  ],
  faqTitle: "Veri Analizi & BI Hakkında Sık Sorulan Sorular",
  faqItems: [
    { question: "Business Intelligence nedir, bize ne faydası var?", answer: "BI, ham verilerinizi anlamlı raporlara ve görsel dashboardlara dönüstürür." },
    { question: "Hangi veri kaynaklarıyla çalısıyorsunuz?", answer: "PostgreSQL, MySQL, MongoDB, Excel, google Sheets, Salesforce, HubSpot, google Analytics ve daha fazlası." },
    { question: "Power BI mı, özel dashboard mı tercih etmeliyim?", answer: "Power BI hızlı kurulum için idealdir. Özel dashboard tam kontrol ve marka uyumu gerektiren durumlar için tercih edilir." },
  ],
};
