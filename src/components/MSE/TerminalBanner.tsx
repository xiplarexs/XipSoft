"use client";

/**
 * TerminalBanner.tsx — XipSoft Interaktif Terminal Bileseni
 *
 * Sadece görünüm sorumlulugu:
 * - Satır render (tip bazlı renk)
 * - girdi alanı + prompt
 * - Titlebar (macOS dot'ları)
 * - Otomatik scroll-to-bottom
 * Tüm mantık useTerminal hook'unda.
 */

import { useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import { useTerminal, type TerminalLine, type LineType } from "@/hooks/useTerminal";
import "@/styles/terminal.css";

// ─── Renk sınıfı haritası ─────────────────────────────────────────────────────

const LINE_CLASS: Record<LineType, string> = {
  cmd:     "",                // prompt ile birlikte render edilir
  output:  "term-out-text",
  info:    "term-out-info",
  success: "term-out-success",
  warn:    "term-out-warn",
  error:   "term-out-error",
  special: "term-out-special",
  divider: "term-out-dim",
  blank:   "",
};

// ─── Tek satır ────────────────────────────────────────────────────────────────

function Line({ line }: { line: TerminalLine }) {
  if (line.type === "blank") return <div className="h-1" />;

  if (line.type === "cmd") {
    return (
      <div className="terminal-line">
        <span className="term-prompt-path">{line.prompt ?? "~"}</span>
        <span className="term-prompt-at"> </span>
        <span className="term-prompt-dollar">$</span>
        <span className="term-cmd"> {line.text}</span>
      </div>
    );
  }

  return (
    <div className={`terminal-line ${line.indent ? "term-out-indent" : ""}`}>
      <span className={LINE_CLASS[line.type] || "term-out-text"}>{line.text}</span>
    </div>
  );
}

// ─── girdi satırı ─────────────────────────────────────────────────────────────

function InputLine({
  cwd,
  value,
  onChange,
  onKeyDown,
  disabled,
  inputRef,
}: {
  cwd: string;
  value: string;
  onChange: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <div className="terminal-input-line">
      <span className="term-prompt-path">{cwd}</span>
      <span className="term-prompt-at"> </span>
      <span className="term-prompt-dollar">$</span>
      <input
        ref={inputRef}
        className="terminal-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        disabled={disabled}
        autoCapitalize="none"
        autoCorrect="off"
        autoComplete="off"
        spellCheck={false}
        aria-label="Terminal komut girisi"
        placeholder={disabled ? "Yükleniyor..." : ""}
      />
      {!disabled && <span className="term-cursor" aria-hidden />}
    </div>
  );
}

// ─── Ana bilesen ──────────────────────────────────────────────────────────────

export default function TerminalBannerSection() {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const bodyRef  = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isInView = useInView(wrapRef, { amount: 0.25, once: true });

  const {
    lines,
    input,
    cwd,
    isReady,
    handleInputChange,
    handleKeyDown,
    resetSession,
  } = useTerminal();

  // Yeni satır gelince en alta scroll
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [lines]);

  // görünüme girince input'a focus
  useEffect(() => {
    if (isInView && isReady) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isInView, isReady]);

  // Karta tıklanınca input'a focus
  const handleContainerClick = () => {
    if (isReady) inputRef.current?.focus();
  };

  return (
    <motion.div
      ref={wrapRef}
      className="terminal-root"
      role="region"
      aria-label="XipSoft interaktif terminal"
    >      {/* SEO — ekran okuyucu için gizli özet */}
      <span className="sr-only">
        XipSoft interaktif terminal. Web yazılım, mobil uygulama, masaüstü yazılım,
        siber güvenlik ve SEO hizmetleri. Istanbul — 15 yıllık deneyim.
      </span>

      <div
        className="terminal-window"
        onClick={handleContainerClick}
        role="application"
      >
        {/* Titlebar */}
        <div className="terminal-titlebar">
          <div className="terminal-dots" aria-hidden>
            <span
              className="terminal-dot terminal-dot-red"
              title="Sıfırla"
              onClick={(e) => { e.stopPropagation(); resetSession(); }}
              style={{ cursor: "pointer" }}
            />
            <span className="terminal-dot terminal-dot-yellow" />
            <span className="terminal-dot terminal-dot-green" />
          </div>
          <span className="terminal-title">XipSoft.terminal — bash</span>
        </div>

        {/* Body */}
        <div
          ref={bodyRef}
          className="terminal-body"
          aria-live="polite"
          aria-atomic="false"
        >
          <div className="terminal-lines">
            {lines.map((line) => (
              <Line key={line.id} line={line} />
            ))}

            {/* girdi satırı */}
            <InputLine
              cwd={cwd}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={!isReady}
              inputRef={inputRef}
            />
          </div>

          {/* Alt ipucu */}
          {isReady && (
            <p className="term-hint" aria-hidden>
              Tab — otomatik tamamlama &nbsp;·&nbsp; ↑↓ — geçmis &nbsp;·&nbsp;
              <span
                style={{ color: "var(--term-orange)", cursor: "pointer" }}
                onClick={(e) => { e.stopPropagation(); resetSession(); }}
              >
                kırmızı nokta — sıfırla
              </span>
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
