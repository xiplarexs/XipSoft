export interface ServicePageData {
  slug: string;
  hasDistricts?: boolean;
  metadata: {
    title: string;
    description: string;
    keywords: string[];
  };
  badge: string;
  badgeIcon: any;
  badgegradient: string;
  badgeColor: string;
  title: string;
  titlegradient: string;
  subtitle: string;
  heroCta: string;
  stats: { value: string; label: string }[];
  statsgradient: string;
  features: { icon: any; title: string; description: string; color: string }[];
  techStack: { name: string; color: string }[];
  servicesTag?: { name: string; color: string }[];
  processTitle?: string;
  processDesc?: string;
  processSteps: { step: string; title: string; description: string; color: string }[];
  packages: {
    name: string; price: string; desc: string; color: string; popular?: boolean;
    features: string[];
  }[];
  ctaTitle: string;
  ctaDesc: string;
  ctaBtn: string;
  microServices: {
    title: string; keywords: string[]; color: string; icon: any;
    description: string;
  }[];
  faqTitle: string;
  faqItems: { question: string; answer: string }[];
}
