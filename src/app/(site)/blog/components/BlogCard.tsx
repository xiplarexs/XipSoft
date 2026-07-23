"use client";

import { cn } from "@/utils";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, useCallback } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Calendar,
  Sparkles,
  Clock3,
  Database,
  FileCode2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useLanguage } from "@/hooks/useLanguage";
import type { BlogItem } from "./types";

export const BlogCard = ({
  blog,
  index,
  isInView,
  isFeatured = false,
}: {
  blog: BlogItem;
  index: number;
  isInView: boolean;
  isFeatured?: boolean;
}) => {
  const t = useTranslations("blog");
  const { isXipSoft} = useLanguage();
  const mm = "";
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 200, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 200, damping: 30 });

  const spotlightX = useTransform(springX, (v) => `${v}px`);
  const spotlightY = useTransform(springY, (v) => `${v}px`);

  const accentColors = ["#22d3ee", "#a78bfa", "#fb7185", "#fbbf24"];
  const accentColor = isFeatured
    ? "#a78bfa"
    : accentColors[index % accentColors.length];

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY]
  );

  const date = new Date(blog.date);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Reading time estimate (rough: ~1min per 200 chars of description)
  const readTime = Math.max(1, Math.ceil((blog.description?.length ?? 80) / 200));

  const SourceIcon = blog.source === "firestore" ? Database : FileCode2;

  return (
    <motion.div
      className={cn(isFeatured && "md:col-span-2 lg:col-span-2")}
      initial={{ opacity: 0, y: 30, scale: 0.97, filter: "blur(4px)" }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
          : { opacity: 0, y: 30, scale: 0.97, filter: "blur(4px)" }
      }
      transition={{
        duration: 0.6,
        delay: 0.2 + index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link href={blog.slug} className="block group h-full">
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          className={cn(
            "relative h-full rounded-2xl overflow-hidden",
            "blog-card-glass",
            "bg-surface/60 backdrop-blur-sm",
            "border border-white/[0.06]",
            "transition-all duration-500 ease-out",
            "hover:-translate-y-1.5 hover:border-white/[0.12]",
            "hover:shadow-[0_20px_60px_-15px_rgba(167,139,250,0.12)]",
          )}
        >
          {/* Top accent bar — always visible, colored by accent */}
          <div
            className="h-[2px] w-full"
            style={{
              background: `linear-gradient(90deg, ${accentColor}50, ${accentColor}20, transparent 80%)`,
            }}
          />

          {/* Cursor-following spotlight */}
          <motion.div
            className="absolute pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              left: spotlightX,
              top: spotlightY,
              width: isFeatured ? 280 : 200,
              height: isFeatured ? 280 : 200,
              x: isFeatured ? -140 : -100,
              y: isFeatured ? -140 : -100,
              background: `radial-gradient(circle, ${accentColor}12 0%, transparent 70%)`,
            }}
          />

          {/* Sagdan ısık yansıması — her kartta */}
          <div
            className="absolute top-0 right-0 bottom-0 w-[140px] pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `linear-gradient(270deg, ${accentColor}08 0%, ${accentColor}04 40%, transparent 100%)`,
            }}
          />

          {/* Sol alttan ısık */}
          <div
            className="absolute bottom-0 left-0 w-[100px] h-[80px] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(ellipse at 0% 100%, ${accentColor}08 0%, transparent 70%)`,
            }}
          />

          {/* Corner glow on hover */}
          <div
            className="absolute -top-12 -right-12 w-32 h-32 opacity-0 group-hover:opacity-[0.06] transition-opacity duration-700 rounded-full"
            style={{
              background: `radial-gradient(circle, ${accentColor}, transparent 70%)`,
            }}
          />

          {/* Content */}
          <div className={cn(
            "relative z-10 flex flex-col h-full",
            isFeatured ? "p-7 md:p-8" : "p-5 md:p-6"
          )}>
            {/* Header row: meta badges */}
            <div className="flex items-center flex-wrap gap-2.5 mb-4">
              {/* Date badge */}
              <span className="inline-flex items-center gap-1.5 text-[11px] -mono text-zinc-500">
                <Calendar className="w-3 h-3" style={{ color: accentColor }} />
                {formattedDate}
              </span>

              <span className="w-0.5 h-0.5 rounded-full bg-zinc-700" />

              {/* Read time */}
              <span className="inline-flex items-center gap-1 text-[11px] -mono text-zinc-600">
                <Clock3 className="w-2.5 h-2.5" />
                {readTime} min
              </span>

              <span className="w-0.5 h-0.5 rounded-full bg-zinc-700" />

              {/* Source micro badge */}
              <span
                className="inline-flex items-center gap-1 text-[9px] -mono uppercase tracking-wider px-1.5 py-0.5 rounded-md border"
                style={{
                  color: `${accentColor}90`,
                  background: `${accentColor}06`,
                  borderColor: `${accentColor}15`,
                }}
              >
                <SourceIcon className="w-2.5 h-2.5" />
                {blog.source === "firestore" ? "Community" : "MDX"}
              </span>

              {/* Featured badge */}
              {isFeatured && (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] -mono uppercase tracking-wider"
                  style={{
                    background: `${accentColor}10`,
                    border: `1px solid ${accentColor}25`,
                    color: accentColor,
                  }}
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  Latest
                </span>
              )}
            </div>

            {/* Title */}
            <h2
              className={cn(
                "-display font-bold tracking-tight text-zinc-100 mb-3",
                "group-hover:text-white transition-colors duration-300",
                isFeatured
                  ? "text-xl md:text-2xl"
                  : "text-base"
              )}
            >
              {blog.title}
            </h2>

            {/* Description */}
            {blog.description && (
              <p
                className={cn(
                  "-body text-sm text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors duration-500",
                  isFeatured ? "line-clamp-3 mb-6" : "line-clamp-2 mb-4"
                )}
              >
                {blog.description}
              </p>
            )}

            {/* Separator */}
            <div
              className="h-px w-full mb-4 mt-auto"
              style={{
                background: `linear-gradient(90deg, ${accentColor}10, white/[0.03], transparent)`,
              }}
            />

            {/* Footer: author + read more */}
            <div className="flex items-center justify-between">
              {/* Author */}
              <div className="flex items-center gap-2">
                {blog.authorPhotoURL ? (
                  <img
                    src={blog.authorPhotoURL}
                    alt={blog.authorName ?? ""}
                    className="w-5 h-5 rounded-full object-cover ring-1 ring-white/[0.08]"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold uppercase ring-1 ring-white/[0.08]"
                    style={{
                      background: `${accentColor}15`,
                      color: `${accentColor}cc`,
                    }}
                  >
                    {(blog.authorName ?? blog.source ?? "M").charAt(0)}
                  </span>
                )}
                {blog.authorName && (
                  <span className="text-[11px] -mono text-zinc-500 truncate max-w-[100px]">
                    {blog.authorName}
                  </span>
                )}
              </div>

              {/* Read more + index */}
              <div className="flex items-center gap-2 text-sm">
                <span
                  className="-mono text-xs transition-colors duration-300"
                  style={{ color: `${accentColor}90` }}
                >
                  <span className={mm}>{t("readArticle")}</span>
                </span>
                <ArrowUpRight
                  className="w-3.5 h-3.5 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  style={{ color: accentColor }}
                />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
