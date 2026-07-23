"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import MseLink from "@/components/Ui/MseLink/MseLink";
import type {
  BlogActionsProps,
  BlogShareButtonsProps,
} from "./types";

/* ── Social Media Icons ── */
const IconWhatsApp = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);

const IconFacebook = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const IconLinkedIn = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const IconTwitter = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const IconReddit = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12zm6.5 8.5a1.5 1.5 0 0 1-1.5 1.5 1.5 1.5 0 0 1-1.5-1.5 1.5 1.5 0 0 1 1.5 1.5zm-1.25 2.75h-10.5a.75.75 0 0 0 0 1.5h10.5a.75.75 0 0 0 0-1.5zm-8.5 1.5a1.5 1.5 0 1 1-1.5-1.5 1.5 1.5 0 0 1 1.5 1.5zm9.25-4.25a8.25 8.25 0 0 1-16.5 0c0-.5.04-.99-.12-1.47-.22l1.28-1.28c.2.2.31.47.31.73 0 .27-.2.48-.47.48-.73L7.53 5.03c-.48-.1-.97-.18-1.47-.18a8.25 8.25 0 0 0-8.25 8.25c0 .5.04.99.12 1.47.22l-1.28 1.28c-.2-.2-.31-.47-.31-.73 0-.27.2-.48.47-.48l1.28 1.28c.1.48.18.97.18 1.47.18a8.25 8.25 0 0 0 8.25-8.25c0-.5-.04-.99-.12-1.47-.22l-1.28 1.28c-.2-.2-.31-.47-.31-.73 0-.27.2-.48.47-.48l1.28 1.28c.1.48.18.97.18 1.47.18z" />
  </svg>
);

const IcongitHub = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.054 0-1.67.72-1.67 1.668 0 1.925.691 1.925 1.668 0 1.002-.378 1.002-1.002 0-.545.451-1.002 1.002-1.002 0 1.11-.892 1.992-1.992 1.11 0 2 .892 2 1.992 0 .545-.451 1.002-1.002 1.002 0-.378-.261-.756-.577-1.002 1.407-1.585 8.207-3.085 11.387-11.387.599-.111.793.261.793.577v2.234c0 3.338-.726 4.033-1.416 4.033-1.416.546 1.387 1.333 1.756 1.333 1.054 0 1.67-.72 1.67-1.668 0-1.925-.691-1.925-1.668 0-1.002.378-1.002 1.002 0 .545-.451 1.002-1.002 1.002 0 1.11-.892 1.992-1.992 1.11 0-2-.892-2-1.992 0-.545.451-1.002 1.002-1.002.378.261.756.577 1.002-1.407 1.585 8.207-3.085 11.387-11.387.599-.111.793.261.793.577z" />
  </svg>
);

const IconCopy = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v5h-10z" />
  </svg>
);

/* ── Share Button Component ── */
const ShareButton = ({
  onClick,
  tooltip,
  children,
  color,
}: {
  onClick: () => void;
  tooltip: string;
  children: React.ReactNode;
  color?: string;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative flex items-center justify-center group">
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={
          "relative w-9 h-9 flex items-center justify-center rounded-lg !bg-transparent transition-all duration-200 text-zinc-500 hover:text-zinc-200"
        }
        style={hovered ? { color: color || undefined } : undefined}
        aria-label={tooltip}
      >
        <span className="absolute inset-0 rounded-lg opacity-0 transition-opacity duration-200 bg-transparent" />
        <span className="relative z-10">{children}</span>
      </button>
      {hovered && (
        <div className="absolute bottom-full mb-2 px-2 py-1 bg-zinc-900 border border-white/[0.08] rounded text-[10px] text-zinc-300 whitespace-nowrap pointer-events-none">
          {tooltip}
        </div>
      )}
    </div>
  );
};

/* ── Blog Share Buttons Component ── */
function BlogShareButtons({ title }: BlogShareButtonsProps) {
  const [shareUrl, setShareUrl] = useState("");
  const shareTitle = encodeURIComponent(title || "");

  useEffect(() => {
    setShareUrl(encodeURIComponent(window.location.href));
  }, []);

  const shareWhatsApp = useCallback(() => {
    window.open(
      `https://wa.me/?text=${shareTitle}%20${shareUrl}`,
      "_blank",
      "noopener,noreferrer"
    );
  }, [shareUrl, shareTitle]);

  const shareFacebook = useCallback(() => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      "_blank",
      "noopener,noreferrer"
    );
  }, [shareUrl]);

  const shareLinkedIn = useCallback(() => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
      "_blank",
      "noopener,noreferrer"
    );
  }, [shareUrl]);

  const shareTwitter = useCallback(() => {
    window.open(
      `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
      "_blank",
      "noopener,noreferrer"
    );
  }, [shareUrl, shareTitle]);

  const shareReddit = useCallback(() => {
    window.open(
      `https://www.reddit.com/submit?url=${shareUrl}&title=${shareTitle}`,
      "_blank",
      "noopener,noreferrer"
    );
  }, [shareUrl, shareTitle]);

  const sharegitHub = useCallback(() => {
    window.open(
      `https://github.com/xiplarexs/discussions/new?title=${shareTitle}&body=${shareUrl}`,
      "_blank",
      "noopener,noreferrer"
    );
  }, [shareUrl, shareTitle]);

  const copyLink = useCallback(() => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
    }
  }, []);

  return (
    <div className="flex items-center gap-1.5">
      <ShareButton
        onClick={shareWhatsApp}
        tooltip="WhatsApp'ta Paylas"
        color="#25D366"
      >
        <IconWhatsApp />
      </ShareButton>

      <ShareButton
        onClick={shareFacebook}
        tooltip="Facebook'ta Paylas"
        color="#1877F2"
      >
        <IconFacebook />
      </ShareButton>

      <ShareButton
        onClick={shareLinkedIn}
        tooltip="LinkedIn'de Paylas"
        color="#0A66C2"
      >
        <IconLinkedIn />
      </ShareButton>

      <ShareButton onClick={shareTwitter} tooltip="X'te Paylas" color="#e4e4e7">
        <IconTwitter />
      </ShareButton>

      <ShareButton
        onClick={shareReddit}
        tooltip="Reddit'te Paylas"
        color="#FF4500"
      >
        <IconReddit />
      </ShareButton>

      <ShareButton
        onClick={sharegitHub}
        tooltip="gitHub'da Paylas"
        color="#333333"
      >
        <IcongitHub />
      </ShareButton>

      <ShareButton
        onClick={copyLink}
        tooltip="Baglantıyı Kopyala"
        color="#6b7280"
      >
        <IconCopy />
      </ShareButton>
    </div>
  );
}

/* ── Blog Actions (bottom nav) ── */
export function BlogActions({
  post,
  normalizedSlug,
  adjacent,
}: BlogActionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="mt-16 pt-8 border-t border-white/[0.04]"
    >
      <div className="flex flex-col gap-5">
        {/* Paylas satırı */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500 -mono uppercase tracking-wider shrink-0">
            Paylas
          </span>
          <div className="flex-1 h-px bg-white/[0.04]" />
          <BlogShareButtons title={post.title} />
        </div>

        {/* Prev / Next navigasyon */}
        <div className="grid grid-cols-2 gap-3">
          {adjacent.prev ? (
            <MseLink
              href={`/blog/${adjacent.prev.slug}`}
              className="group flex flex-col gap-1 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-200"
            >
              <span className="inline-flex items-center gap-1 text-[10px] -mono uppercase tracking-wider text-zinc-600 group-hover:text-zinc-400 transition-colors">
                <ChevronLeft className="w-3 h-3" /> Önceki
              </span>
              <span className="text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors line-clamp-2 leading-relaxed">
                {adjacent.prev.title}
              </span>
            </MseLink>
          ) : (
            <div />
          )}

          {adjacent.next ? (
            <MseLink
              href={`/blog/${adjacent.next.slug}`}
              className="group flex flex-col gap-1 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-200 text-right"
            >
              <span className="inline-flex items-center justify-end gap-1 text-[10px] -mono uppercase tracking-wider text-zinc-600 group-hover:text-zinc-400 transition-colors">
                Sonraki <ChevronRight className="w-3 h-3" />
              </span>
              <span className="text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors line-clamp-2 leading-relaxed">
                {adjacent.next.title}
              </span>
            </MseLink>
          ) : (
            <div />
          )}
        </div>

        {/* geri butonu */}
        <MseLink
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-200 transition-colors duration-200 w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="-mono text-xs uppercase tracking-wider">
            Tüm yazılar
          </span>
        </MseLink>
      </div>
    </motion.div>
  );
}
