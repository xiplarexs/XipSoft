/**
 * db-services.ts — Hizmet sayfası DB katmanı
 * services tablosundan slug ile içerik çeker.
 * Tablo yoksa / DB yoksa static fallback döner.
 */
import pool from "@/lib/database";

export interface ServiceStat { value: string; label: string }
export interface ServiceFeature { icon: string; title: string; description: string; color: string }
export interface ServiceTechItem { name: string; color: string }
export interface ServiceProcessStep { step: string; title: string; description: string; color: string }
export interface ServicePackage {
  name: string; price: string; desc: string; color: string;
  popular?: boolean; features: string[];
}
export interface ServiceMicroService {
  title: string; keywords: string[]; color: string;
  icon: string; description: string;
}
export interface ServiceFaqItem { question: string; answer: string }

export interface ServicePageData {
  slug: string;
  badge: string;
  badgeIcon: string;
  badgegradient: string;
  badgeColor: string;
  title: string;
  titlegradient: string;
  subtitle: string;
  heroCta: string;
  stats: ServiceStat[];
  features: ServiceFeature[];
  techStack: ServiceTechItem[];
  servicesTag?: ServiceTechItem[];
  processTitle?: string;
  processDesc?: string;
  processSteps: ServiceProcessStep[];
  packages: ServicePackage[];
  ctaTitle: string;
  ctaDesc: string;
  ctaBtn: string;
  microServices: ServiceMicroService[];
  faqTitle: string;
  faqItems: ServiceFaqItem[];
  metadata: {
    title: string;
    description: string;
    keywords: string[];
  };
}

/**
 * DB'den hizmet sayfası verisini çeker.
 * Bulamazsa null döner → page.tsx notFound() çagırır.
 */
export async function getServiceFromDB(slug: string): Promise<ServicePageData | null> {
  if (!process.env.DATABASE_URL) return null;

  try {
    const { rows } = await pool.query(
      `SELECT * FROM services WHERE slug = $1 AND is_active = true LIMIT 1`,
      [slug]
    );
    if (!rows[0]) return null;

    const row = rows[0];
    return {
      slug: row.slug,
      badge: row.badge,
      badgeIcon: row.badge_icon,
      badgegradient: row.badge_gradient,
      badgeColor: row.badge_color,
      title: row.title,
      titlegradient: row.title_gradient,
      subtitle: row.subtitle,
      heroCta: row.hero_cta,
      stats: row.stats ?? [],
      features: row.features ?? [],
      techStack: row.tech_stack ?? [],
      servicesTag: row.services_tag ?? [],
      processTitle: row.process_title,
      processDesc: row.process_desc,
      processSteps: row.process_steps ?? [],
      packages: row.packages ?? [],
      ctaTitle: row.cta_title,
      ctaDesc: row.cta_desc,
      ctaBtn: row.cta_btn,
      microServices: row.micro_services ?? [],
      faqTitle: row.faq_title,
      faqItems: row.faq_items ?? [],
      metadata: row.metadata ?? { title: row.title, description: row.subtitle, keywords: [] },
    };
  } catch {
    return null;
  }
}

/**
 * DB'deki tüm aktif hizmet slug'larını döner — generateStaticParams için
 */
export async function getAllServiceSlugs(): Promise<string[]> {
  if (!process.env.DATABASE_URL) return [];
  try {
    const { rows } = await pool.query(
      `SELECT slug FROM services WHERE is_active = true ORDER BY sort_order ASC`
    );
    return rows.map((r) => r.slug);
  } catch {
    return [];
  }
}
