/**
 * Hizmet Detay Sayfası — /hizmetler/[slug]
 *
 * Önce DB'den çeker (db-services.ts).
 * DB bossa veya kayıt yoksa statik data/services.ts'e fallback yapar.
 * Hiçbirinde bulunamazsa notFound() döner.
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getServiceFromDB, getAllServiceSlugs, type ServicePageData } from "@/lib/db-services";
import { getServiceBySlug as getStaticService, SERVICE_SLUgS } from "@/data/services";
import ServicePageClient from "./ServicePageClient";

// ISR — 10 dakikada bir yenile
export const revalidate = 600;

// ─── Statik slug listesi ──────────────────────────────────────────────────

export async function generateStaticParams() {
  // DB slug'ları + statik slug'lar birlesimi
  const dbSlugs = await getAllServiceSlugs();
  const allSlugs = Array.from(new Set([...dbSlugs, ...SERVICE_SLUgS]));
  return allSlugs.map((slug) => ({ slug }));
}

// ─── Veri çekme yardımcısı ────────────────────────────────────────────────

async function resolveService(slug: string): Promise<ServicePageData | null> {
  // 1. DB'den dene
  const dbService = await getServiceFromDB(slug);
  if (dbService) return dbService;

  // 2. Statik fallback
  const staticSvc = getStaticService(slug);
  if (!staticSvc) return null;

  // Statik veriyi ServicePageData interface'ine uygun hale getir
  const badgeIcon = typeof staticSvc.badgeIcon === "string"
    ? staticSvc.badgeIcon
    : (staticSvc.badgeIcon as any)?.displayName || "Globe";

  const features = staticSvc.features.map((f) => ({
    ...f,
    icon: typeof f.icon === "string" ? f.icon : (f.icon as any)?.displayName || "Globe",
  }));
  const microServices = staticSvc.microServices.map((m) => ({
    ...m,
    icon: typeof m.icon === "string" ? m.icon : (m.icon as any)?.displayName || "Globe",
  }));

  return {
    slug: staticSvc.slug,
    badge: staticSvc.badge,
    badgeIcon,
    badgegradient: staticSvc.badgegradient,
    badgeColor: staticSvc.badgeColor,
    title: staticSvc.title,
    titlegradient: staticSvc.titlegradient,
    subtitle: staticSvc.subtitle,
    heroCta: staticSvc.heroCta,
    stats: staticSvc.stats,
    features,
    techStack: staticSvc.techStack ?? [],
    servicesTag: staticSvc.servicesTag ?? [],
    processTitle: staticSvc.processTitle,
    processDesc: staticSvc.processDesc,
    processSteps: staticSvc.processSteps,
    packages: staticSvc.packages,
    ctaTitle: staticSvc.ctaTitle,
    ctaDesc: staticSvc.ctaDesc,
    ctaBtn: staticSvc.ctaBtn,
    microServices,
    faqTitle: staticSvc.faqTitle,
    faqItems: staticSvc.faqItems,
    metadata: staticSvc.metadata,
  };
}

// ─── Metadata ─────────────────────────────────────────────────────────────

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await resolveService(slug);
  if (!service) return {};

  const canonical = `https://xipsoft.com/hizmetler/${slug}`;

  return {
    title: service.metadata.title,
    description: service.metadata.description,
    keywords: service.metadata.keywords,
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    openGraph: {
      title: service.metadata.title,
      description: service.metadata.description,
      type: "website",
      url: canonical,
    },
  };
}

// ─── Sayfa ────────────────────────────────────────────────────────────────

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = await resolveService(slug);
  if (!service) notFound();
  return <ServicePageClient service={service} />;
}
