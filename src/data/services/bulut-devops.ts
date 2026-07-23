import {
  Cloud, GitBranch, Server, Monitor, Shield, RefreshCw,
} from "lucide-react";
import { BRAND_COLORS } from "@/config/brand.config";
import type { ServicePageData } from "./types";

export const bulutDevopsData: ServicePageData = {
  slug: "bulut-devops",
  metadata: {
    title: "Bulut & DevOps Hizmetleri | AWS, Docker, Kubernetes | XipSoft",
    description: "AWS, Docker, Kubernetes ile ölçeklenebilir bulut altyapısı. CI/CD pipeline, monitoring, DevSecOps ve cloud migration hizmetleri. Ücretsiz teklif alın!",
    keywords: ["bulut hizmetleri", "devops", "aws", "docker", "kubernetes", "ci/cd pipeline", "cloud migration", "terraform", "monitoring"],
  },
  badge: "Bulut & DevOps",
  badgeIcon: Cloud,
  badgegradient: "from-cyan-500/10 to-blue-500/10",
  badgeColor: "text-cyan-400",
  title: "Bulut & DevOps",
  titlegradient: "from-rose-400 via-orange-400 to-yellow-400",
  subtitle: "AWS, Docker, Kubernetes ile ölçeklenebilir bulut altyapısı kurun. CI/CD pipeline, monitoring ve DevSecOps ile yazılım teslimatınızı hızlandırın.",
  heroCta: "Ücretsiz Teklif Al",
  stats: [
    { value: "100+", label: "Altyapı Projesi" },
    { value: "%99.9", label: "Uptime garantisi" },
    { value: "%40", label: "Maliyet Tasarrufu" },
    { value: "2-8", label: "Hafta Teslimat" },
  ],
  statsgradient: "from-cyan-400 to-blue-400",
  features: [
    { icon: Cloud, title: "Cloud Migration", description: "Mevcut altyapınızı AWS, gCP veya Azure'a sıfır downtime ile tasıyoruz", color: BRAND_COLORS.secondary },
    { icon: GitBranch, title: "CI/CD Pipeline", description: "gitHub Actions, gitLab CI ile otomatik test, build ve deploy süreçleri", color: BRAND_COLORS.primary },
    { icon: Server, title: "Kubernetes & Docker", description: "Container orchestration ile ölçeklenebilir, tasınabilir uygulama altyapısı", color: BRAND_COLORS.accent },
    { icon: Monitor, title: "Izleme & Alerting", description: "grafana, Prometheus ile gerçek zamanlı sistem izleme ve otomatik uyarılar", color: BRAND_COLORS.gold },
    { icon: Shield, title: "güvenlik & Uyumluluk", description: "DevSecOps yaklasımıyla güvenligi gelistirme sürecine entegre ediyoruz", color: "#34d399" },
    { icon: RefreshCw, title: "Disaster Recovery", description: "Otomatik yedekleme ve felaket kurtarma planları ile is sürekliligi", color: BRAND_COLORS.secondary },
  ],
  techStack: [
    { name: "AWS", color: BRAND_COLORS.gold }, { name: "Docker", color: BRAND_COLORS.secondary },
    { name: "Kubernetes", color: "#3b82f6" }, { name: "Terraform", color: BRAND_COLORS.primary },
    { name: "gitHub Actions", color: "#ffffff" }, { name: "grafana", color: BRAND_COLORS.accent },
    { name: "Nginx", color: "#34d399" }, { name: "Vercel", color: "#ffffff" },
  ],
  processSteps: [
    { step: "01", title: "Altyapı Analizi", description: "Mevcut sisteminizi, trafik profilinizi ve ölçekleme ihtiyaçlarınızı analiz ederiz.", color: BRAND_COLORS.secondary },
    { step: "02", title: "Mimari Tasarım", description: "Ihtiyacınıza özel bulut mimarisi ve DevOps pipeline tasarımı yaparız.", color: BRAND_COLORS.primary },
    { step: "03", title: "Kurulum & Migrasyon", description: "Altyapıyı kurar, uygulamaları tasır ve CI/CD pipeline'ları devreye alırız.", color: BRAND_COLORS.accent },
    { step: "04", title: "Test & güvenlik", description: "Yük testleri, güvenlik taramaları ve disaster recovery testleri yaparız.", color: BRAND_COLORS.gold },
    { step: "05", title: "Izleme & Optimizasyon", description: "Canlı sistemin performansını izler, maliyet ve hız optimizasyonu yaparız.", color: "#34d399" },
  ],
  packages: [
    { name: "Baslangıç", price: "₺18.000", desc: "Küçük ekipler için", color: BRAND_COLORS.secondary, features: ["Vercel/Railway deploy", "Temel CI/CD", "SSL & domain", "Uptime izleme", "3 ay destek"] },
    { name: "Profesyonel", price: "₺45.000", desc: "Büyüyen altyapılar için", color: BRAND_COLORS.primary, popular: true, features: ["AWS/gCP kurulum", "Docker & Kubernetes", "CI/CD pipeline", "grafana dashboard", "Otomatik yedekleme", "6 ay destek"] },
    { name: "Kurumsal", price: "Teklif Al", desc: "Kritik sistemler için", color: BRAND_COLORS.accent, features: ["Multi-region deploy", "Zero-downtime migration", "DevSecOps", "SLA garantisi", "7/24 izleme", "12 ay destek"] },
  ],
  ctaTitle: "Altyapınızı Modernize Edelim",
  ctaDesc: "Bulut ve DevOps çözümleriyle daha hızlı, güvenilir ve ölçeklenebilir sistemler kurun.",
  ctaBtn: "Ücretsiz Teklif Al",
  microServices: [
    { title: "AWS & Cloud Altyapısı Kurulum ve Yönetimi", keywords: ["AWS EC2", "S3", "RDS", "CloudFront", "Lambda", "VPC"], color: BRAND_COLORS.gold, icon: Cloud, description: "AWS, google Cloud veya Azure üzerinde production-ready altyapı kuruyoruz. Terraform ile Infrastructure as Code yaklasımıyla tüm altyapı versiyon kontrolünde tutulur." },
    { title: "CI/CD Pipeline & DevOps Otomasyonu", keywords: ["gitHub Actions", "gitLab CI", "Docker Build", "Blue-green Deploy"], color: BRAND_COLORS.primary, icon: GitBranch, description: "Her kod push'unda otomatik çalısan test, build ve deploy pipeline'ları kuruyoruz. Blue-green deployment ile sıfır downtime deploy saglıyoruz." },
    { title: "Kubernetes Cluster Yönetimi & Ölçekleme", keywords: ["EKS", "gKE", "Helm", "HPA", "Service Mesh"], color: BRAND_COLORS.secondary, icon: Server, description: "AWS EKS veya google gKE üzerinde production Kubernetes cluster kuruyoruz. HPA ile yük artısında otomatik pod ölçekleme yapıyoruz." },
    { title: "Monitoring, Logging & Observability", keywords: ["grafana", "Prometheus", "ELK Stack", "Sentry"], color: "#34d399", icon: Monitor, description: "grafana + Prometheus ile sistem metriklerini görsellestiriyoruz. Esik degerleri asıldıgında anında uyarı gönderiyoruz." },
  ],
  faqTitle: "Bulut & DevOps Hakkında Sık Sorulan Sorular",
  faqItems: [
    { question: "Cloud migration ne kadar sürer?", answer: "Mevcut altyapının büyüklügüne göre 2-8 hafta sürer." },
    { question: "Hangi bulut saglayıcılarıyla çalısıyorsunuz?", answer: "AWS, google Cloud, Azure, Vercel ve Cloudflare ile çalısıyoruz." },
    { question: "Kubernetes yönetimi saglıyor musunuz?", answer: "Evet, Kubernetes cluster kurulumu, yönetimi, scaling ve monitoring hizmetleri sunuyoruz." },
  ],
};
