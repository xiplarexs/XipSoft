import PageTransitionWrapper from "@/components/Animate/PageTransitionWrapper/PageTransitionWrapper";
import APP_CONFIg, { SITE_URL } from "@/config/config";
import type { Metadata } from "next";
import DevSetupClient from "./DevSetupClient";

export const metadata: Metadata = {
  title: `Dev Setup guide | ${APP_CONFIg.title}`,
  description: "Step-by-step guide to set up the XipSoft project for local development. Beginner-friendly.",
  robots: { index: false, follow: false },
  opengraph: {
    title: `Dev Setup guide | ${APP_CONFIg.title}`,
    description: "Step-by-step guide to set up the XipSoft project for local development. Beginner-friendly.",
    images: `${SITE_URL}/images/xipsoft-seo.png`,
  },
};

export default function DevSetupPage() {
  return (
    <PageTransitionWrapper>
      <DevSetupClient />
    </PageTransitionWrapper>
  );
}
