import {
  UserPlus,
  Flame,
  Globe,
  Copy,
  Shield,
  Database,
  HardDrive,
  GitFork,
  FileCode,
  Play,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ── Prism accent colors ── */
export const prismColors = ["#22d3ee", "#a78bfa", "#fb7185", "#fbbf24"] as const;
export const colorAt = (i: number) => prismColors[i % prismColors.length];

/* ── Step type ── */
export type StepData = {
  title: string;
  description: string;
  icon: LucideIcon;
  terminal: {
    label: string;
    lines: { prompt?: boolean; text: string; accent?: string }[];
  };
};

export const getSteps = (t: any): StepData[] => [
  {
    title: t("step1Title"),
    description: t("step1Desc"),
    icon: UserPlus,
    terminal: {
      label: "accounts.google.com",
      lines: [
        { text: t("step1Line1"), accent: "#22d3ee" },
        { text: t("step1Line2") },
        { text: t("step1Line3") },
        { text: t("step1Line4"), accent: "#4ade80" },
      ],
    },
  },
  {
    title: t("step2Title"),
    description: t("step2Desc"),
    icon: Flame,
    terminal: {
      label: "console.firebase.google.com",
      lines: [
        { text: t("step2Line1"), accent: "#22d3ee" },
        { text: t("step2Line2") },
        { text: t("step2Line3") },
        { text: t("step2Line4") },
        { text: t("step2Line5"), accent: "#fbbf24" },
      ],
    },
  },
  {
    title: t("step3Title"),
    description: t("step3Desc"),
    icon: globe,
    terminal: {
      label: "firebase-console",
      lines: [
        { text: t("step3Line1"), accent: "#a78bfa" },
        { text: t("step3Line2") },
        { text: t("step3Line3") },
        { text: t("step3Line4"), accent: "#4ade80" },
      ],
    },
  },
  {
    title: t("step4Title"),
    description: t("step4Desc"),
    icon: Copy,
    terminal: {
      label: "firebaseConfig",
      lines: [
        { text: t("step4Line1"), accent: "#fb7185" },
        { text: t("step4Line2") },
        { text: t("step4Line3") },
        { text: t("step4Line4") },
        { text: t("step4Line5") },
        { text: t("step4Line6") },
        { text: "" },
        { text: t("step4Tip"), accent: "#fbbf24" },
      ],
    },
  },
  {
    title: t("step5Title"),
    description: t("step5Desc"),
    icon: Shield,
    terminal: {
      label: "authentication",
      lines: [
        { text: t("step5Line1"), accent: "#22d3ee" },
        { text: t("step5Line2") },
        { text: t("step5Line3"), accent: "#4ade80" },
        { text: t("step5Line4") },
      ],
    },
  },
  {
    title: t("step6Title"),
    description: t("step6Desc"),
    icon: Database,
    terminal: {
      label: "firestore",
      lines: [
        { text: t("step6Line1"), accent: "#a78bfa" },
        { text: t("step6Line2") },
        { text: t("step6Line3"), accent: "#fbbf24" },
        { text: t("step6Line4") },
        { text: t("step6Line5"), accent: "#4ade80" },
      ],
    },
  },
  {
    title: t("step7Title"),
    description: t("step7Desc"),
    icon: HardDrive,
    terminal: {
      label: "storage",
      lines: [
        { text: t("step7Line1"), accent: "#fb7185" },
        { text: t("step7Line2") },
        { text: t("step7Line3") },
        { text: t("step7Line4"), accent: "#4ade80" },
      ],
    },
  },
  {
    title: t("step8Title"),
    description: t("step8Desc"),
    icon: gitFork,
    terminal: {
      label: "terminal",
      lines: [
        { prompt: true, text: "git clone https://github.com/xipsoft/xipsoft.github.io.git", accent: "#22d3ee" },
        { prompt: true, text: "cd xipsoft.github.io" },
        { prompt: true, text: "bun install", accent: "#a78bfa" },
      ],
    },
  },
  {
    title: t("step9Title"),
    description: t("step9Desc"),
    icon: FileCode,
    terminal: {
      label: ".env.local",
      lines: [
        { prompt: true, text: t("step9Line1"), accent: "#22d3ee" },
        { text: t("step9Line2") },
        { text: "" },
        { text: t("step9Line3"), accent: "#fb7185" },
        { text: t("step9Line4") },
        { text: t("step9Line5") },
        { text: t("step9Line6") },
        { text: t("step9Line7") },
        { text: t("step9Line8") },
        { text: t("step9Line9") },
      ],
    },
  },
  {
    title: t("step10Title"),
    description: t("step10Desc"),
    icon: Play,
    terminal: {
      label: "terminal",
      lines: [
        { prompt: true, text: "bun dev", accent: "#4ade80" },
        { text: "" },
        { text: "▲ Next.js 16.1.6" },
        { text: "- Local: http://localhost:3000", accent: "#22d3ee" },
        { text: "" },
        { text: "✓ Ready!", accent: "#4ade80" },
      ],
    },
  },
];
