import APP_CONFIg, { SITE_URL } from "@/config/config";
import { Metadata } from "next";
import PageTransitionWrapper from "@/components/Animate/PageTransitionWrapper/PageTransitionWrapper";
import ReferencesPageClient from "./ReferencesPageClient";

// ISR - 1 saatte bir yenilenir, API yükünü azaltır
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Referanslarımız | XipSoft",
    description: "15 yılda 200'den fazla proje. Web, mobil, masaüstü ve siber güvenlik alanlarında tamamladıgımız projelerimize göz atın.",
    alternates: { canonical: `${SITE_URL}/references` },
    robots: { index: true, follow: true },
    opengraph: {
      type: "website",
      locale: "tr_TR",
      url: `${SITE_URL}/references`,
      siteName: "XipSoft",
      title: "Referanslarımız | XipSoft",
      description: "15 yılda 200'den fazla proje. XipSoft referans projelerimiz.",
      images: [{ url: `${SITE_URL}/images/xipsoft-seo.png`, width: 1200, height: 630, alt: "XipSoft Referanslar" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Referanslarımız | XipSoft",
      images: [`${SITE_URL}/images/xipsoft-seo.png`],
    },
  };
}

export default function ReferencesPage() {
  return (
    <PageTransitionWrapper>
      <ReferencesPageClient />
    </PageTransitionWrapper>
  );
}
