import type { LucideIcon } from "lucide-react";

export type TerminalLine = { prompt?: boolean; text: string; accent?: string };

export type TerminalData = {
  label: string;
  lines: TerminalLine[];
};

export type SubStepData = {
  label: string;
  terminal: TerminalData;
};

export type StepData = {
  title: string;
  description: string;
  icon: LucideIcon;
  terminal: TerminalData;
  optionToggle?: {
    labels: [string, string];
    terminals: [TerminalData, TerminalData];
  };
  subSteps?: SubStepData[];
};

export type ClassItem = {
  _id: string;
  title: string;
  status: string;
  classType: string;
  description: string;
  instructorName: string;
  tags: string[];
  classLink: string;
};

export type BookItem = {
  _id: string;
  title: string;
  authorName: string;
  authorEmail?: string;
  authorLink?: string;
  image?: string;
  link: string;
};
