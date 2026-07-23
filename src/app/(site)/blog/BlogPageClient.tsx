"use client";

import Container from "@/components/Common/Container/Container";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import Link from "next/link";
import { BookOpen, PenLine } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { useBlogList } from "@/hooks/blog/useBlogList";
import { cn } from "@/utils";
import type { BlogItem } from "./components";
import {
  FloatingOrb,
  GridDecoration,
  PrismLine,
  HeroSparkle,
  BlogCard,
  EmptyState,
} from "./components";

/* ── Main Blog Page Client ── */
const BlogPageClient = ({ blogs: staticBlogs }: { blogs: BlogItem[] }) => {
  const heroRef = useRef(null);
  const gridRef = useRef(null);
  const heroInView = useInView(heroRef, { amount: 0.3, once: true });
  const gridInView = useInView(gridRef, { amount: 0.1, once: true });
  const t = useTranslations("blog");
  const { isXipSoft} = useLanguage();
  const mm = "";

  // Merge static + Firestore blogs with pagination
  const { firestoreBlogs, loading: firestoreLoading, hasMore, loadMore, loadingMore } = useBlogList(10);
  const firestoreItems: BlogItem[] = firestoreBlogs.map((p) => ({
    _id: p.id,
    title: p.title,
    description: p.description,
    date: new Date(p.publishedAt ?? p.createdAt).toISOString(),
    slug: `/blog/${p.slug}`,
    source: "firestore" as const,
    authorName: p.authorName ?? undefined,
    authorPhotoURL: p.authorAvatar ?? undefined,
  }));
  // Sadece DB yazıları — static/MDX yazılar artık kullanılmıyor
  const blogs = firestoreItems
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const hasPosts = blogs.length > 0;
  const [featured, ...rest] = blogs;
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative min-h-[60vh] overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <GridDecoration />
        <FloatingOrb
          size={220}
          color="#22d3ee"
          x="-5%"
          y="5%"
          delay={0}
          duration={9}
        />
        <FloatingOrb
          size={180}
          color="#a78bfa"
          x="80%"
          y="25%"
          delay={1.5}
          duration={11}
        />
        <FloatingOrb
          size={140}
          color="#fb7185"
          x="60%"
          y="70%"
          delay={3}
          duration={8}
        />
        <PrismLine delay={0.4} />
        <HeroSparkle delay={0} x="15%" y="12%" />
        <HeroSparkle delay={1.5} x="85%" y="18%" />
        <HeroSparkle delay={3} x="50%" y="8%" />
      </div>

      {/* Hero header */}
      <div ref={heroRef} className="relative z-10 pt-8 pb-10 md:pt-12 md:pb-14">
        <Container withPadding>
          {/* Section label */}
          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={
              heroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
            }
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="flex items-center justify-center w-8 h-8 rounded-lg"
              style={{
                background: "linear-gradient(135deg, #a78bfa12, #22d3ee08)",
                border: "1px solid rgba(167,139,250,0.15)",
              }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <BookOpen className="w-4 h-4 text-prism-violet" />
            </motion.div>
            <span className={`-mono text-[11px] text-zinc-500 uppercase tracking-[0.2em] ${mm}`}>
              {t("label")}
            </span>
          </motion.div>

          {/* Title */}
          <motion.div
            className={`relative mb-4 ${mm ? "" : "overflow-hidden"}`}
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.1, delay: 0.1 }}
          >
            {/* Shimmer sweep behind title */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(167,139,250,0.1) 50%, transparent 100%)",
              }}
              initial={{ x: "-100%" }}
              animate={heroInView ? { x: "200%" } : { x: "-100%" }}
              transition={{ duration: 1.2, delay: 0.6, ease: "easeInOut" }}
            />
            <motion.h1
              className={`-bold text-4xl sm:text-5xl md:text-6xl ${mm ? `${mm} leading-[1.6] py-2 text-prism-violet` : "-display leading-[1.15] bg-gradient-to-r from-prism-cyan via-prism-violet to-prism-rose bg-clip-text text-transparent"}`}
              initial={{ y: 50, opacity: 0, filter: "blur(6px)" }}
              animate={
                heroInView
                  ? { y: 0, opacity: 1, filter: "blur(0px)" }
                  : { y: 50, opacity: 0, filter: "blur(6px)" }
              }
              transition={{
                duration: 0.7,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {t("title")}
            </motion.h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            className={`-body text-base text-zinc-500 max-w-lg leading-relaxed ${mm}`}
            initial={{ opacity: 0, y: 15 }}
            animate={
              heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }
            }
            transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
          >
            {t("subtitle")}
          </motion.p>

          {/* Post count badge */}
          {hasPosts && (
            <motion.div
              className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.06] bg-surface/40"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={
                heroInView
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.9 }
              }
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-prism-cyan"
                animate={{
                  opacity: [1, 0.4, 1],
                  boxShadow: [
                    "0 0 4px rgba(34,211,238,0.6)",
                    "0 0 8px rgba(34,211,238,0.3)",
                    "0 0 4px rgba(34,211,238,0.6)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <span className={`-mono text-[10px] text-zinc-400 uppercase tracking-widest ${mm}`}>
                {blogs.length} {blogs.length === 1 ? t("article") : t("articles")}
              </span>
            </motion.div>
          )}

          {/* Write button for authenticated users */}
          {isAuthenticated && (
            <motion.div
              className="mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Link
                href="/blog/write"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-prism-violet/10 border border-prism-violet/20 text-prism-violet hover:bg-prism-violet/20 hover:border-prism-violet/40 transition-all duration-200"
              >
                <PenLine className="w-4 h-4" />
                <span className={mm}>Konu gir</span>
              </Link>
            </motion.div>
          )}

          {/* Decorative divider */}
          <motion.div
            className="mt-8 h-[1px]"
            style={{
              background:
                "linear-gradient(90deg, #22d3ee15, #a78bfa25, #fb718515, transparent 80%)",
            }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={heroInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          />
        </Container>
      </div>

      {/* Blog grid */}
      <div ref={gridRef} className="relative z-10 pb-16">
        <Container withPadding>
          {firestoreLoading && staticBlogs.length === 0 ? (
            <motion.div
              className="flex items-center justify-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-6 h-6 border-2 border-prism-violet/30 border-t-prism-violet rounded-full animate-spin" />
                <span className={cn("text-[11px] -mono text-zinc-600", mm)}>
                  Loading blogs...
                </span>
              </div>
            </motion.div>
          ) : !hasPosts ? (
            <EmptyState isInView={gridInView} mm={mm} t={t} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Featured (latest) post — spans 2 columns */}
              <BlogCard
                blog={featured!}
                index={0}
                isInView={gridInView}
                isFeatured={blogs.length > 1}
              />

              {/* Remaining posts */}
              {rest.map((blog, i) => (
                <BlogCard
                  key={blog._id}
                  blog={blog}
                  index={i + 1}
                  isInView={gridInView}
                />
              ))}
            </div>
          )}

          {/* Load More */}
          {hasMore && (
            <motion.div
              className="flex justify-center mt-10"
              initial={{ opacity: 0 }}
              animate={gridInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.5 }}
            >
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className={cn(
                  "inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium",
                  "bg-white/[0.04] border border-white/[0.08]",
                  "text-zinc-400 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.12]",
                  "transition-all duration-300",
                  "disabled:opacity-40 disabled:cursor-not-allowed"
                )}
              >
                {loadingMore ? (
                  <>
                    <div className="w-4 h-4 border-2 border-zinc-600 border-t-zinc-300 rounded-full animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load more posts"
                )}
              </button>
            </motion.div>
          )}
        </Container>
      </div>
    </div>
  );
};

export default BlogPageClient;
