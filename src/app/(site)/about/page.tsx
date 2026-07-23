import type { Metadata } from "next";
import { SITE_URL } from "@/config/config";
import { BRAND_COMPANY } from "@/config/brand.config";
import AboutPageClient from "./AboutPageClient";

// ISR - 1 saatte bir yenilenir
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Hakkımızda | Xipsoft",
  description:
    "XipSoft, 2010 yılından bu yana isletmelerin dijital dönüsüm yolculuguna rehberlik eden, yenilikçi teknolojiler gelistiren ve güvenilir yazılım çözümleri sunan profesyonel bir teknoloji firmasıdır.",
  alternates: { canonical: `${SITE_URL}/about` },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  opengraph: {
    type: "website",
    url: `${SITE_URL}/about`,
    title: "Hakkımızda | XipSoft",
    description:
      "XipSoft hakkında bilgi edinin. 15 yılı askın deneyim ve teknoloji odaklı hizmetlerimizle kurumları dijital gelecege tasıyoruz.",
    siteName: "XipSoft",
    locale: "tr_TR",
    alternateLocale: ["en_US"],
    images: [{ url: `${SITE_URL}/images/xipsoft-seo.png`, width: 1200, height: 630, alt: "XipSoft Hakkımızda" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hakkımızda | XipSoft",
    description:
      "XipSoft hakkında bilgi edinin. 15 yılı askın deneyim ve teknoloji odaklı hizmetlerimizle kurumları dijital gelecege tasıyoruz.",
    images: [`${SITE_URL}/images/xipsoft-seo.png`],
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
