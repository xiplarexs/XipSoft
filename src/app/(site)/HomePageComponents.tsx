"use client";

import dynamic from "next/dynamic";
import Container from "@/components/Common/Container/Container";
import HeroSection from "@/components/MSE/HeroSection";

const XipsoftFarki        = dynamic(() => import("@/components/MSE/XipsoftFarki"));
const NelerYapabiliriz    = dynamic(() => import("@/components/MSE/NelerYapabiliriz"));
const TechStackSection    = dynamic(() => import("@/components/MSE/TechStackSection"));
const MusteriYorumlari    = dynamic(() => import("@/components/MSE/MusteriYorumlari"));
const LanguageIconSection = dynamic(() => import("@/components/MSE/LanguageIconSection"));
const XipSoftTypoSection  = dynamic(() => import("@/components/MSE/MmsweTypoSection"));
const PlatformSection     = dynamic(() => import("@/components/MSE/PlatformSection"));

export default function HomePageComponents() {
  return (
    <div className="flex flex-col gap-16">

      <HeroSection />

      <Container withPadding>
        <NelerYapabiliriz />
      </Container>

      <Container withPadding>
        <XipsoftFarki />
      </Container>

      <Container withPadding>
        <PlatformSection />
      </Container>

      <Container withPadding>
        <TechStackSection />
      </Container>

      <Container withPadding>
        <MusteriYorumlari />
      </Container>

      <Container withPadding>
        <section style={{ position: "relative", zIndex: 0 }}>
          <LanguageIconSection />
        </section>
      </Container>

      <Container withPadding>
        <XipSoftTypoSection />
      </Container>

    </div>
  );
}
