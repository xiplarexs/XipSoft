"use client";

import { motion } from "motion/react";
import { cn } from "@/utils";
import {
  Calendar,
  ArrowLeft,
  Tag,
  Clock3,
  BookOpen,
  Share2,
  PenLine,
} from "lucide-react";
import MseLink from "@/components/Ui/MseLink/MseLink";
import { ContentRenderer } from "@/components/ContentEditor";
import LazyImage from "@/components/LazyImage";
import type { BlogHeaderProps } from "./types";

export function BlogHeader({
  post,
  isModerator,
  formattedDate,
  readTime,
  onShare,
}: BlogHeaderProps) {
  return (
    <>
      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-10"
      >
        <MseLink
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-200 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="-mono text-xs uppercase tracking-wider">Blog</span>
        </MseLink>
        <div className="flex items-center gap-2">
          {isModerator && post && (
            <MseLink
              href={`/blog/edit?id=${post.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] -mono uppercase tracking-wider text-amber-500 hover:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all duration-200"
            >
              <PenLine className="w-3 h-3" />
              Düzenle
            </MseLink>
          )}
          <button
            type="button"
            onClick={onShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] -mono uppercase tracking-wider text-zinc-500 hover:text-zinc-200 !bg-transparent border !border-transparent hover:!border-transparent transition-all duration-200"
          >
            <Share2 className="w-3 h-3" />
            Paylas
          </button>
        </div>
      </motion.div>

      {/* Cover image */}
      {post.coverImageURL && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 rounded-2xl overflow-hidden border border-white/[0.06] relative"
        >
          <LazyImage
            src={post.coverImageURL}
            urls={(post as any).coverImageUrls}
            alt={post.title}
            className="w-full max-h-[420px]"
            sizes="(max-width: 480px) 480px, (max-width: 900px) 900px, 1200px"
          />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-obsidian/80 to-transparent" />
        </motion.div>
      )}

      {/* Header card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative mb-10 rounded-2xl overflow-hidden bg-white/[0.018] backdrop-blur-sm border border-white/[0.06] p-6 md:p-8"
      >
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, #22d3ee50, #a78bfa40, #fb718530, transparent 80%)",
          }}
        />
        <div
          className="absolute top-0 right-0 bottom-0 w-[180px] pointer-events-none"
          style={{
            background:
              "linear-gradient(270deg, rgba(251,191,36,0.04) 0%, rgba(251,113,133,0.03) 40%, transparent 100%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[120px] h-[80px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 0% 100%, rgba(167,139,250,0.06) 0%, transparent 70%)",
          }}
        />

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <span className="inline-flex items-center gap-1.5 text-[10px] -mono uppercase tracking-widest text-zinc-600">
            <BookOpen className="w-3 h-3 text-prism-violet" />
            Article
          </span>
          <span className="w-0.5 h-0.5 rounded-full bg-zinc-700" />
          <span className="inline-flex items-center gap-1.5 text-[11px] -mono text-zinc-500">
            <Calendar className="w-3 h-3 text-prism-cyan" />
            {formattedDate}
          </span>
          <span className="w-0.5 h-0.5 rounded-full bg-zinc-700" />
          <span className="inline-flex items-center gap-1 text-[11px] -mono text-zinc-600">
            <Clock3 className="w-2.5 h-2.5" />
            {readTime} min read
          </span>
        </div>

        <h1 className="-display text-3xl sm:text-4xl font-bold bg-prism-gradient bg-clip-text text-transparent tracking-tight mb-4">
          {post.title}
        </h1>

        {post.description && (
          <p className="text-base text-zinc-400 leading-relaxed mb-6">
            {post.description}
          </p>
        )}

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className={cn(
                  "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] -mono",
                  "bg-white/[0.03] border border-white/[0.06] text-zinc-500"
                )}
              >
                <Tag className="w-2.5 h-2.5 text-prism-violet/60" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="h-px w-full bg-gradient-to-r from-white/[0.04] via-white/[0.06] to-transparent mb-5" />

        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full p-[1.5px] shrink-0"
            style={{
              background:
                "linear-gradient(135deg, #22d3ee, #a78bfa, #fb7185)",
            }}
          >
            <span className="block w-full h-full rounded-full overflow-hidden bg-obsidian">
              {post.authorAvatar ? (
                <img
                  src={post.authorAvatar}
                  alt={post.authorName ?? ""}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="w-full h-full flex items-center justify-center bg-prism-violet/15 text-sm font-bold text-prism-violet uppercase">
                  {(post.authorName ?? "U").charAt(0)}
                </span>
              )}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-200">
              {post.authorName}
            </p>
            <p className="text-[10px] -mono text-zinc-600 uppercase tracking-wider">
              Author
            </p>
          </div>
        </div>
        {/* Content moved inside the header card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 pt-8 border-t border-white/[0.06] blog-content-area"
        >
          {post.content ? (
            <ContentRenderer value={post.content} />
          ) : (
            <div className="rounded-2xl bg-white/[0.01] border border-white/[0.04] p-8 text-zinc-500 text-sm">
              Içerik henüz eklenmemis.
            </div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}
