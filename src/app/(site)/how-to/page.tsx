import PageTransitionWrapper from "@/components/Animate/PageTransitionWrapper/PageTransitionWrapper";
import { SITE_URL } from "@/config/config";
import { Metadata } from "next";
import HowToPageClient from "./HowToPageClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
    opengraph: {
      images: `${SITE_URL}/images/xipsoft-seo.png`,
    },
    twitter: { card: "summary_large_image", images: [`${SITE_URL}/images/xipsoft-seo.png`] },
  };
}

export default async function HowToPage() {
  return (
    <PageTransitionWrapper>
      <HowToPageClient classes={[]} books={[]} />
    </PageTransitionWrapper>
  );
}
