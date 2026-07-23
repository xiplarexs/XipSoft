import { GitFork, Terminal, Package, GitBranch, Play, Globe, FileEdit, CheckCircle2, GitCommitHorizontal, Upload, GitPullRequestArrow } from "lucide-react";
import type { StepData } from "./types";

export const prismColors = ["#22d3ee", "#a78bfa", "#fb7185", "#fbbf24"] as const;
export const colorAt = (i: number) => prismColors[i % prismColors.length];

export const getSteps = (t: any): StepData[] => [
  {
    title: t("step1Title"),
    description: t("step1Desc"),
    icon: GitFork,
    terminal: {
      label: "github.com",
      lines: [
        { text: "github.com/xipsoft/xipsoft.github.io" },
        { text: "" },
        { text: "Click the  Fork  button (top right)", accent: "#22d3ee" },
      ],
    },
  },
  {
    title: t("step2Title"),
    description: t("step2Desc"),
    icon: Terminal,
    terminal: {
      label: "terminal",
      lines: [
        { prompt: true, text: "git clone https://github.com/YOUR_USERNAME/xipsoft.github.io.git" },
        { text: "Cloning into 'xipsoft.github.io'...", accent: "#a78bfa" },
      ],
    },
  },
  {
    title: t("step3Title"),
    description: t("step3Desc"),
    icon: Package,
    terminal: {
      label: "terminal",
      lines: [
        { prompt: true, text: "cd xipsoft.github.io" },
        { prompt: true, text: "bun install" },
        { text: "Installed 280+ packages", accent: "#fb7185" },
      ],
    },
  },
  {
    title: t("step4Title"),
    description: t("step4Desc"),
    icon: GitBranch,
    terminal: {
      label: "terminal",
      lines: [
        { prompt: true, text: "git checkout -b your_name" },
        { text: "Switched to a new branch 'your_name'", accent: "#fbbf24" },
      ],
    },
  },
  {
    title: t("step5Title"),
    description: t("step5Desc"),
    icon: Play,
    terminal: {
      label: "terminal",
      lines: [
        { prompt: true, text: "bun dev" },
        { text: "▲ Next.js 16", accent: "#22d3ee" },
        { text: "- Local:    http://localhost:3000" },
        { text: "✓ Ready in 2.1s", accent: "#22d3ee" },
      ],
    },
  },
  {
    title: t("step6Title"),
    description: t("step6Desc"),
    icon: Globe,
    terminal: {
      label: "browser",
      lines: [
        { text: "🌐  http://localhost:3000", accent: "#a78bfa" },
        { text: "" },
        { text: "XipSoftSoftware  — homepage loaded" },
      ],
    },
  },
  {
    title: t("step7Title"),
    description: t("step7Desc"),
    icon: FileEdit,
    terminal: { label: "profile editor", lines: [] },
    optionToggle: {
      labels: [t("optionEditor"), t("optionManual")],
      terminals: [
        {
          label: "profile editor",
          lines: [
            { text: t("step7Line1"), accent: "#fb7185" },
            { text: t("step7Line2") },
            { text: t("step7Line3") },
            { text: t("step7Line4") },
            { prompt: true, text: "content/profile/your_name.mdx" },
          ],
        },
        {
          label: "terminal",
          lines: [
            { prompt: true, text: "touch content/profile/your_name.mdx" },
            { text: "---", accent: "#fb7185" },
            { text: 'name: "Your Name"' },
            { text: 'description: "A short bio"' },
            { text: 'image: "https://github.com/YOUR_USERNAME.png"' },
            { text: "tags:" },
            { text: "  - React" },
            { text: "  - TypeScript" },
            { text: "---", accent: "#fb7185" },
          ],
        },
      ],
    },
  },
  {
    title: t("step8Title"),
    description: t("step8Desc"),
    icon: CheckCircle2,
    terminal: {
      label: "browser",
      lines: [
        { text: "🌐  http://localhost:3000/profile", accent: "#fbbf24" },
        { text: "" },
        { text: t("step8Line1") },
        { text: t("step8Line2"), accent: "#fbbf24" },
      ],
    },
  },
  {
    title: t("step9Title"),
    description: t("step9Desc"),
    icon: GitCommitHorizontal,
    terminal: { label: "terminal", lines: [] },
    subSteps: [
      {
        label: t("step9Sub1"),
        terminal: { label: "terminal", lines: [{ prompt: true, text: "git add content/profile/your_name.mdx" }] },
      },
      {
        label: t("step9Sub2"),
        terminal: { label: "terminal", lines: [{ prompt: true, text: "bun commit" }, { text: "? Select the type of change:", accent: "#a78bfa" }] },
      },
      {
        label: t("step9Sub3"),
        terminal: {
          label: "gitmoji interactive",
          lines: [
            { text: "? Choose a gitmoji:  :fire:  build", accent: "#fbbf24" },
            { text: "? Choose the type:   build", accent: "#22d3ee" },
            { text: "? Scope:             profile" },
            { text: '? Message:           add your_name profile', accent: "#fb7185" },
          ],
        },
      },
      {
        label: t("step9Sub4"),
        terminal: {
          label: "terminal",
          lines: [
            { text: ":fire: build(profile): add your_name profile", accent: "#22d3ee" },
            { text: "1 file changed, 12 insertions(+)" },
          ],
        },
      },
    ],
  },
  {
    title: t("step10Title"),
    description: t("step10Desc"),
    icon: Upload,
    terminal: {
      label: "terminal",
      lines: [
        { prompt: true, text: "git push origin your_name" },
        { text: "Enumerating objects: 5, done.", accent: "#a78bfa" },
        { text: "Writing objects: 100% (3/3), done." },
        { text: "remote: Create a pull request for 'your_name' on gitHub by visiting:", accent: "#fb7185" },
        { text: "remote:   https://github.com/YOUR_USERNAME/...github.io/pull/new/your_name" },
      ],
    },
  },
  {
    title: t("step11Title"),
    description: t("step11Desc"),
    icon: GitPullRequestArrow,
    terminal: { label: "github.com", lines: [] },
    subSteps: [
      {
        label: t("step11Sub1"),
        terminal: {
          label: "github.com",
          lines: [
            { text: t("step11Line1"), accent: "#fbbf24" },
            { text: "" },
            { text: t("step11Line2") },
          ],
        },
      },
      {
        label: t("step11Sub2"),
        terminal: {
          label: "github.com — pull request",
          lines: [
            { text: t("step11Line3"), accent: "#22d3ee" },
            { text: t("step11Line4") },
          ],
        },
      },
      {
        label: t("step11Sub3"),
        terminal: {
          label: "github.com",
          lines: [{ text: t("step11Line5"), accent: "#fb7185" }],
        },
      },
    ],
  },
];
