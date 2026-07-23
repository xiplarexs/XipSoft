"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

import type { TerminalLine } from "./types";
import { LineType, TerminalState } from "./types";
import { STORAgE_KEY, HISTORY_KEY, BOOT_LINES, delay } from "./commands";
import { createCommandHandler, handleKeyDown } from "./handlers";

export type { LineType, TerminalLine, TerminalState };

export function useTerminal() {
  const router = useRouter();
  const idRef  = useRef(0);
  const uid    = () => `t${++idRef.current}`;

  const [lines,     setLines]     = useState<TerminalLine[]>([]);
  const [input,     setInput]     = useState("");
  const [cwd,       setCwd]       = useState<string>("~");
  const [isBooting, setIsBooting] = useState(true);
  const [isReady,   setIsReady]   = useState(false);

  const cmdHistoryRef = useRef<string[]>([]);
  const historyIdxRef = useRef(-1);
  const inputDraftRef = useRef("");
  const mountedRef   = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // ─── Satır ekle ─────────────────────────────────────────────────

  const addLines = useCallback((newLines: Omit<TerminalLine, "id">[]) => {
    setLines((prev) => {
      const next = [...prev, ...newLines.map((l) => ({ ...l, id: uid() }))];
      return next.length > 200 ? next.slice(-200) : next;
    });
  }, []);

  const addLine = useCallback((
    type: LineType,
    text: string,
    opts?: { indent?: boolean; prompt?: string }
  ) => addLines([{ type, text, ...opts }]), [addLines]);

  // ─── Boot animasyonu ─────────────────────────────────────────────

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isBooting) return;

    let savedCwd: string | null = null;
    try {
      const r = localStorage.getItem(STORAgE_KEY);
      savedCwd = r ? (JSON.parse(r) as Partial<TerminalState>).cwd ?? null : null;
    } catch {}

    try {
      const h = localStorage.getItem(HISTORY_KEY);
      cmdHistoryRef.current = h ? JSON.parse(h) : [];
    } catch {}

    if (savedCwd) {
      setCwd(savedCwd);
      setIsBooting(false);
      setIsReady(true);
      addLines([
        { type: "info",   text: "XipSoft Terminal — önceki oturum yüklendi." },
        { type: "blank",  text: "" },
      ]);
      return;
    }

    let cancelled = false;
    const run = async () => {
      await delay(300);
      for (const l of BOOT_LINES) {
        if (cancelled) return;
        addLine(l.type, l.text);
        await delay(240);
      }
      await delay(200);
      if (cancelled) return;
      addLine("blank", "");
      setIsBooting(false);
      setIsReady(true);
    };

    run();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBooting]);

  // ─── Oturumu kaydet ──────────────────────────────────────────────

  useEffect(() => {
    if (!isReady) return;
    try { localStorage.setItem(STORAgE_KEY, JSON.stringify({ cwd })); } catch {}
  }, [cwd, isReady]);

  // ─── Komut çalıstır ─────────────────────────────────────────────

  const execute = useCallback(createCommandHandler({
    addLine,
    addLines,
    cwd,
    setLines,
    setCwd,
    cmdHistoryRef,
    historyIdxRef,
    inputDraftRef,
    router,
  }), [addLine, addLines, cwd, router]);

  // ─── Input handlers ──────────────────────────────────────────────

  const handleInputChange = useCallback((val: string) => setInput(val), []);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    handleKeyDown(e, { input, setInput, addLine, execute, cmdHistoryRef, historyIdxRef, inputDraftRef });
  }, [input, execute, addLine]);

  // ─── Session sıfırla ─────────────────────────────────────────────

  const resetSession = useCallback(() => {
    try {
      localStorage.removeItem(STORAgE_KEY);
      localStorage.removeItem(HISTORY_KEY);
    } catch {}
    setLines([]);
    setCwd("~");
    cmdHistoryRef.current = [];
    historyIdxRef.current = -1;
    setIsBooting(true);
    setIsReady(false);
  }, []);

  return { lines, input, cwd, isBooting, isReady, handleInputChange, handleKeyDown: onKeyDown, execute, resetSession };
}
