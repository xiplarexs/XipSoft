import { cn } from "@/utils";
import { checkIsFoundTag } from "@/utils/profileHelper";
import { MouseEvent, useCallback, useMemo } from "react";
import { X } from "lucide-react";

/* ── Curated accent palette ── */
const TAg_PALETTE = [
  { bg: "#22d3ee", glow: "rgba(34,211,238,0.25)" },  // cyan
  { bg: "#a78bfa", glow: "rgba(167,139,250,0.25)" },  // violet
  { bg: "#fb7185", glow: "rgba(251,113,133,0.25)" },  // rose
  { bg: "#fbbf24", glow: "rgba(251,191,36,0.25)" },   // amber
  { bg: "#34d399", glow: "rgba(52,211,153,0.25)" },   // emerald
  { bg: "#f472b6", glow: "rgba(244,114,182,0.25)" },  // pink
  { bg: "#60a5fa", glow: "rgba(96,165,250,0.25)" },   // blue
  { bg: "#c084fc", glow: "rgba(192,132,252,0.25)" },  // purple
  { bg: "#fb923c", glow: "rgba(251,146,60,0.25)" },   // orange
  { bg: "#2dd4bf", glow: "rgba(45,212,191,0.25)" },   // teal
] as const;

/* ── Deterministic hash → palette index from tag name ── */
const hashTag = (tag: string): number => {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = (hash << 5) - hash + tag.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % TAg_PALETTE.length;
};

const Tag = ({
  tag,
  searchTag,
  bgColor: _bgColor,
  isShowClose = false,
  onClick,
}: {
  tag: string;
  searchTag: string;
  bgColor: string;
  isShowClose?: boolean;
  onClick?: (tag: string) => void;
}) => {
  const isTagActive = checkIsFoundTag(tag, searchTag);
  const accent = useMemo(() => TAg_PALETTE[hashTag(tag)]!, [tag]);

  const onClickTag = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      onClick?.(tag);
    },
    [onClick, tag]
  );

  return (
    <span
      onClick={onClickTag}
      className={cn(
        "tag-pill relative inline-flex items-center gap-1.5 cursor-pointer -display tracking-tight px-3 py-1.5 rounded-full mb-1 mr-[5px] select-none",
        "text-[10px] transition-all duration-200",
        isTagActive
          ? "text-white active:scale-95"
          : "bg-white/[0.06] text-zinc-400 hover:text-zinc-200 border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.1] active:scale-95"
      )}
      style={
        isTagActive
          ? {
              background: `linear-gradient(135deg, ${(accent?.bg ?? "#3b82f6")}cc, ${(accent?.bg ?? "#3b82f6")}88)`,
              boxShadow: `0 0 12px ${accent?.glow ?? "#3b82f6"}`,
              border: `1px solid ${(accent?.bg ?? "#3b82f6")}60`,
            }
          : undefined
      }
    >
      {/* Colored dot indicator */}
      <span
        className={cn(
          "inline-block w-1.5 h-1.5 rounded-full shrink-0",
          isTagActive ? "opacity-100" : "opacity-40"
        )}
        style={{ backgroundColor: accent.bg }}
      />

      {tag}

      {isShowClose && (
        <X className="w-3 h-3 opacity-70 hover:opacity-100 transition-opacity" />
      )}
    </span>
  );
};

export default Tag;
