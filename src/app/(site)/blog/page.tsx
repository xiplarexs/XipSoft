import APP_CONFIg, { SITE_URL } from "@/config/config";
import { Metadata } from "next";
import BlogPageClient from "./BlogPageClient";
import PageTransitionWrapper from "@/components/Animate/PageTransitionWrapper/PageTransitionWrapper";

// ISR - 30 dakikada bir yenilenir, API yükünü azaltır
export const revalidate = 1800;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Blog | Xipsoft",
    description: "Web yazılım, mobil uygulama ve teknoloji dünyasından güncel makaleler. XipSoft ekibinin deneyimlerini kesfedin.",
    alternates: { canonical: `${SITE_URL}/blog` },
    robots: { index: true, follow: true },
    opengraph: {
      type: "website",
      locale: "tr_TR",
      url: `${SITE_URL}/blog`,
      siteName: "XipSoft",
      title: "Blog | XipSoft",
      description: "Web yazılım, mobil uygulama ve teknoloji dünyasından güncel makaleler.",
      images: [{ url: `${SITE_URL}/images/xipsoft-seo.png`, width: 1200, height: 630, alt: "XipSoft Blog" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Blog | XipSoft",
      description: "Web yazılım, mobil uygulama ve teknoloji dünyasından güncel makaleler.",
      images: [`${SITE_URL}/images/xipsoft-seo.png`],
    },
  };
}

const BlogListPage = async () => {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "XipSoft Blog",
      description: "Web yazılım, mobil uygulama ve teknoloji dünyasından güncel makaleler.",
      url: `${SITE_URL}/blog`,
      publisher: { "@type": "Organization", name: "XipSoft", url: SITE_URL },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "/" },
        { "@type": "ListItem", position: 2, name: "Blog", item: "/blog" },
      ],
    },
  ];

  return (
    <PageTransitionWrapper>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* staticBlogs bos geçildi — tüm yazılar DB'den (useBlogList hook) yüklenir */}
      <BlogPageClient blogs={[]} />
    </PageTransitionWrapper>
  );
};

export default BlogListPage;
