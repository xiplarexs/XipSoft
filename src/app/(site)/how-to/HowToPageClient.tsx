"use client";

import { useTranslations } from "next-intl";
import { useLanguage } from "@/hooks/useLanguage";
import { HeroSection } from "./components/HeroSection";
import { StepCard } from "./components/StepCard";
import { CtaSection } from "./components/CtaSection";
import { SectionDivider } from "./components/SectionDivider";
import { ClassesSection } from "./components/ClassesSection";
import { BooksSection } from "./components/BooksSection";
import { EditorSection } from "./components/EditorSection";
import { getSteps } from "./components/steps-data";
import type { ClassItem, BookItem } from "./components/types";

const HowToPageClient = ({ classes, books }: { classes: ClassItem[]; books: BookItem[] }) => {
  const t = useTranslations("howTo");
  const { isXipSoft } = useLanguage();
  const mm = "";
  const steps = getSteps(t);

  return (
    <div className="relative">
      <HeroSection stepCount={steps.length} mm={mm} />

      <div className="relative pt-8 md:pt-12">
        {steps.map((step, i) => (
          <StepCard key={i} step={step} index={i} isLast={i === steps.length - 1} mm={mm} />
        ))}
      </div>

      <CtaSection stepCount={steps.length} mm={mm} />

      <SectionDivider color="#22d3ee" />
      <ClassesSection classes={classes} />

      <SectionDivider color="#a78bfa" />
      <BooksSection books={books} />

      <SectionDivider color="#fb7185" />
      <EditorSection />
    </div>
  );
};

export default HowToPageClient;
