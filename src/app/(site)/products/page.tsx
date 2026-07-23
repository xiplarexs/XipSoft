import { Metadata } from "next";
import { SITE_URL } from "@/config/config";
import ProductsPageClient from "./ProductsPageClient";

// ISR - 1 saatte bir yenilenir, API yükünü azaltır
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Ürünler | Xipsoft",
    description: "XipSoft hazır web yazılım ürünleri: e-ticaret, dijital ajans ve is yönetim sistemleri. Her proje müsteriye özel kodlanır.",
    alternates: { canonical: `${SITE_URL}/products` },
    robots: { index: true, follow: true },
    opengraph: {
      type: "website",
      locale: "tr_TR",
      url: `${SITE_URL}/products`,
      siteName: "XipSoft",
      title: "Ürünlerimiz | XipSoft",
      description: "XipSoft hazır web yazılım ürünleri: e-ticaret, dijital ajans ve is yönetim sistemleri.",
      images: [{ url: `${SITE_URL}/images/xipsoft-seo.png`, width: 1200, height: 630, alt: "XipSoft Ürünler" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Ürünlerimiz | XipSoft",
      images: [`${SITE_URL}/images/xipsoft-seo.png`],
    },
  };
}

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Hazır Web Yazılım Ürünleri",
    description: "XipSoft hazır web yazılım ürünleri: e-ticaret, dijital ajans ve is yönetim sistemleri.",
    url: `${SITE_URL}/products`,
    publisher: { "@type": "Organization", name: "XipSoft", url: SITE_URL },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Ürünler", item: `${SITE_URL}/products` },
    ],
  },
];

export default function ProductsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductsPageClient />
    </>
  );
}
