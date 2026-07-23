"use client";

export type LineType =
  | "cmd"
  | "output"
  | "info"
  | "success"
  | "warn"
  | "error"
  | "special"
  | "divider"
  | "blank";

export interface TerminalLine {
  id: string;
  type: LineType;
  text: string;
  prompt?: string;
  indent?: boolean;
  raw?: boolean;
}

export interface TerminalState {
  lines: TerminalLine[];
  input: string;
  historyIndex: number;
  cwd: string;
  isBooting: boolean;
  isReady: boolean;
}
