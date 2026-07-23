"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/utils";

/* ── Ikonlar — SVg inline (lucide-react'ta bazıları yok) ── */
const IconAPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <text x="1" y="16" fontSize="13" fontWeight="700" stroke="none" fill="currentColor">A</text>
    <text x="14" y="10" fontSize="9" fontWeight="700" stroke="none" fill="currentColor">+</text>
  </svg>
);

const IconAMinus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <text x="1" y="16" fontSize="13" fontWeight="700" stroke="none" fill="currentColor">A</text>
    <text x="14" y="10" fontSize="9" fontWeight="700" stroke="none" fill="currentColor">−</text>
  </svg>
);

const IconLink = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const IconPrint = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </svg>
);

const IconFacebook = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const IconWhatsApp = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
);


const IconLinkedIn = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const IconX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const IconReddit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0A12 12 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12zm6.5 8.5a1.5 1.5 0 0 1-1.5 1.5 1.5 1.5 0 0 1-1.5-1.5 1.5 1.5 0 0 1 1.5 1.5zm-1.25 2.75h-10.5a.75.75 0 0 0 0 1.5h10.5a.75.75 0 0 0 0-1.5zm-8.5 1.5a1.5 1.5 0 1 1-1.5-1.5 1.5 1.5 0 0 1 1.5 1.5zm9.25-4.25a8.25 8.25 0 0 1-16.5 0c0-.5.04-.99-.12-1.47-.22l1.28-1.28c.2.2.31.47.31.73 0 .27-.2.48-.47.48-.73L7.53 5.03c-.48-.1-.97-.18-1.47-.18a8.25 8.25 0 0 0-8.25 8.25c0 .5.04.99.12 1.47.22l-1.28 1.28c-.2-.2-.31-.47-.31-.73 0-.27.2-.48.47-.48l1.28 1.28c.1.48.18.97.18 1.47.18a8.25 8.25 0 0 0 8.25-8.25c0-.5-.04-.99-.12-1.47-.22l-1.28 1.28c-.2-.2-.31-.47-.31-.73 0-.27.2-.48.47-.48l1.28 1.28c.1.48.18.97.18 1.47.18z"/>
  </svg>
);

const IcongitHub = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.054 0-1.67.72-1.67 1.668 0 1.925.691 1.925 1.668 0 1.002-.378 1.002-1.002 0-.545.451-1.002 1.002-1.002 0 1.11-.892 1.992-1.992 1.11 0 2 .892 2 1.992 0 .545-.451 1.002-1.002 1.002 0-.378-.261-.756-.577-1.002 1.407-1.585 8.207-3.085 11.387-11.387.599-.111.793.261.793.577v2.234c0 3.338-.726 4.033-1.416 4.033-1.416.546 1.387 1.333 1.756 1.333 1.054 0 1.67-.72 1.67-1.668 0-1.925-.691-1.925-1.668 0-1.002.378-1.002 1.002 0-.545.451-1.002 1.002-1.002 0 1.11-.892 1.992-1.992 1.11 0 2 .892 2 1.992 0 .545-.451 1.002-1.002 1.002 0-.378-.261-.756-.577-1.002 1.407-1.585 8.207-3.085 11.387-11.387.599-.111.793.261.793.577v2.234c0 3.338-.726 4.033-1.416 4.033-1.416.546 1.387 1.333 1.756 1.333 1.054 0 1.67-.72 1.67-1.668 0-1.925-.691-1.925-1.668 0-1.002.378-1.002 1.002 0 .545-.451 1.002-1.002 1.002 0 1.11-.892 1.992-1.992 1.11 0-2-.892-2-1.992 0-.545.451-1.002 1.002-1.002.378.261.756.577 1.002-1.407 1.585 8.207-3.085 11.387-11.387.599-.111.793.261.793.577z"/>
  </svg>
);

/* ── Tooltip ── */
const Tooltip = ({ text, visible }: { text: string; visible: boolean }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0, x: 8, scale: 0.92 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 8, scale: 0.92 }}
        transition={{ duration: 0.15 }}
        className="absolute right-full mr-2.5 top-1/2 -translate-y-1/2 pointer-events-none z-50"
      >
        <div className="relative px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap
          bg-zinc-900 border border-white/[0.08] text-zinc-300 shadow-xl">
          {text}
          {/* Arrow */}
          <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0
            border-t-[4px] border-t-transparent
            border-b-[4px] border-b-transparent
            border-l-[5px] border-l-zinc-900" />
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ── Toolbar Butonu ── */
const ToolbarBtn = ({
  onClick,
  tooltip,
  children,
  active = false,
  color,
}: {
  onClick: () => void;
  tooltip: string;
  children: React.ReactNode;
  active?: boolean;
  color?: string;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative flex items-center justify-center">
      <Tooltip text={tooltip} visible={hovered} />
      <motion.button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        whileTap={{ scale: 0.88 }}
        className={cn(
          "relative w-9 h-9 flex items-center justify-center rounded-xl !bg-transparent",
          "transition-all duration-200",
          "text-zinc-500 hover:text-zinc-200",
          active && "text-prism-violet",
        )}
        style={hovered ? { color: color || undefined } : undefined}
        aria-label={tooltip}
      >
        {/* Hover bg */}
        <span
          className={cn(
            "absolute inset-0 rounded-xl transition-opacity duration-200 bg-transparent"
          )}
        />
        <span className="relative z-10">{children}</span>
      </motion.button>
    </div>
  );
};

/* ── Divider ── */
const Divider = () => (
  <div className="w-5 h-px bg-white/[0.06] mx-auto my-0.5" />
);

/* ── Ana Bilesen ── */
interface BlogPostToolbarProps {
  title?: string;
}

export default function BlogPostToolbar({ title }: BlogPostToolbarProps) {
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState(16); // px

  // Font boyutunu article içerigine uygula
  useEffect(() => {
    const article = document.querySelector<HTMLElement>(".blog-content-area");
    if (article) {
      article.style.fontSize = `${fontSize}px`;
    }
  }, [fontSize]);

  const increaseFontSize = useCallback(() => {
    setFontSize((prev) => Math.min(prev + 2, 24));
  }, []);

  const decreaseFontSize = useCallback(() => {
    setFontSize((prev) => Math.max(prev - 2, 12));
  }, []);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const shareUrl = typeof window !== "undefined" ? encodeURIComponent(window.location.href) : "";
  const shareTitle = encodeURIComponent(title || "");

  const shareWhatsApp = useCallback(() => {
    window.open(`https://wa.me/?text=${shareTitle}%20${shareUrl}`, "_blank", "noopener,noreferrer");
  }, [shareUrl, shareTitle]);

  const shareFacebook = useCallback(() => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, "_blank", "noopener,noreferrer");
  }, [shareUrl]);

  const shareLinkedIn = useCallback(() => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, "_blank", "noopener,noreferrer");
  }, [shareUrl]);

  const shareTwitter = useCallback(() => {
    window.open(`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`, "_blank", "noopener,noreferrer");
  }, [shareUrl, shareTitle]);

  const shareReddit = useCallback(() => {
    window.open(`https://www.reddit.com/submit?url=${shareUrl}&title=${shareTitle}`, "_blank", "noopener,noreferrer");
  }, [shareUrl, shareTitle]);

  const sharegitHub = useCallback(() => {
    window.open(`https://github.com/xiplarexs/discussions/new?title=${shareTitle}&body=${shareUrl}`, "_blank", "noopener,noreferrer");
  }, [shareUrl, shareTitle]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-0.5"
      aria-label="Blog araç çubugu"
    >
      {/* Kart */}
      <div className="relative flex flex-col items-center gap-0.5 px-1 py-2 rounded-2xl
        bg-transparent backdrop-blur-md
        border border-transparent
        shadow-none">

        {/* Sag kenar ısık çizgisi */}
        <div className="absolute right-0 top-4 bottom-4 w-[1px] rounded-full
          bg-gradient-to-b from-transparent via-white/[0] to-transparent pointer-events-none" />

        {/* Sol alt köse ısık */}
        <div className="absolute -bottom-2 -left-2 w-12 h-12 rounded-full pointer-events-none
          bg-[radial-gradient(circle,rgba(167,139,250,0.15)_0%,transparent_70%)] blur-sm" />

        {/* Yazı boyutu */}
        <ToolbarBtn onClick={increaseFontSize} tooltip="Yazıyı Büyüt" color="#a78bfa">
          <IconAPlus />
        </ToolbarBtn>

        <Divider />

        <ToolbarBtn onClick={decreaseFontSize} tooltip="Yazıyı Küçült" color="#a78bfa">
          <IconAMinus />
        </ToolbarBtn>

        <Divider />

        {/* Link kopyala */}
        <ToolbarBtn onClick={copyLink} tooltip={copied ? "Kopyalandı!" : "Linki Kopyala"} active={copied} color="#22d3ee">
          <IconLink />
        </ToolbarBtn>

        <Divider />

        {/* Yazdır */}
        <ToolbarBtn onClick={handlePrint} tooltip="Yazdır" color="#fbbf24">
          <IconPrint />
        </ToolbarBtn>

        {/* Bosluk */}
        <div className="h-2" />

        {/* Paylas */}
        <ToolbarBtn onClick={shareWhatsApp} tooltip="WhatsApp'ta Paylas" color="#25D366">
          <IconWhatsApp />
        </ToolbarBtn>

        <ToolbarBtn onClick={shareFacebook} tooltip="Facebook'ta Paylas" color="#1877F2">
          <IconFacebook />
        </ToolbarBtn>

        <Divider />

        <ToolbarBtn onClick={shareLinkedIn} tooltip="LinkedIn'de Paylas" color="#0A66C2">
          <IconLinkedIn />
        </ToolbarBtn>

        <Divider />

        <ToolbarBtn onClick={shareTwitter} tooltip="X'te Paylas" color="#e4e4e7">
          <IconX />
        </ToolbarBtn>

        <ToolbarBtn onClick={shareReddit} tooltip="Reddit'te Paylas" color="#FF4500">
          <IconReddit />
        </ToolbarBtn>

        <ToolbarBtn onClick={sharegitHub} tooltip="gitHub'da Paylas" color="#333333">
          <IcongitHub />
        </ToolbarBtn>
      </div>
    </motion.div>
  );
}
