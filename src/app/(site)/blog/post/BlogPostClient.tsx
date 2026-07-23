"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import {
  getBlogPostBySlugAction,
  getBlogAdjacentPostsAction,
} from "@/app/_actions/blog-actions";
import type { BlogPost } from "@/types/blog";
import RelatedPosts from "@/components/Blog/RelatedPosts";
import BlogPostToolbar from "@/components/Blog/BlogPostToolbar";
import { useAuth } from "@/hooks/useAuth";
import {
  BlogHeader,
  BlogLoadingSkeleton,
  BlogNotFound,
  BlogActions,
} from "./components";
import type { AdjacentPosts } from "./components";

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

interface BlogPostInnerProps {
  slug?: string;
}

function BlogPostInner({ slug: slugProp }: BlogPostInnerProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { user } = useAuth();
  const isModerator = Boolean(
    user &&
      ((user as any).role === "admin" ||
        (user as any).role === "moderator")
  );

  const slug =
    slugProp ||
    searchParams.get("slug") ||
    (pathname.startsWith("/blog/")
      ? pathname.slice("/blog/".length).split("?")[0]
      : null);

  const normalizedSlug = (() => {
    if (!slug) return null;
    let s = slug.trim();
    try {
      s = decodeURIComponent(s);
    } catch {
      /* keep trimmed */
    }
    if (s.startsWith("blog/")) s = s.slice("blog/".length);
    return s.trim() || null;
  })();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [adjacent, setAdjacent] = useState<AdjacentPosts>({
    prev: null,
    next: null,
  });

  useEffect(() => {
    if (!normalizedSlug) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const [data, adj] = await Promise.all([
          getBlogPostBySlugAction(normalizedSlug),
          getBlogAdjacentPostsAction(normalizedSlug),
        ]);
        if (cancelled) return;
        if (data) {
          setPost(data);
          setAdjacent(adj);
        } else {
          setNotFound(true);
        }
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [normalizedSlug]);

  if (loading) {
    return <BlogLoadingSkeleton />;
  }

  if (notFound || !post) {
    return <BlogNotFound />;
  }

  const formattedDate = post.publishedAt
    ? post.publishedAt.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : post.createdAt.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

  const readTime = post.content
    ? calculateReadingTime(
        typeof post.content === "string"
          ? post.content
          : JSON.stringify(post.content)
      )
    : Math.max(2, Math.ceil((post.description?.length ?? 200) / 150));

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: post.title,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-5 relative blog-post-page">
      {/* Arka plan ısık efektleri */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute top-0 right-0 w-[520px] h-[520px] opacity-[0.07] blur-[100px]"
          style={{
            background:
              "radial-gradient(ellipse at 100% 0%, #fbbf24 0%, #fb7185 40%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/3 right-0 w-[380px] h-[380px] opacity-[0.05] blur-[80px]"
          style={{
            background:
              "radial-gradient(ellipse at 100% 50%, #fb7185 0%, #a78bfa 50%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[420px] h-[420px] opacity-[0.06] blur-[90px]"
          style={{
            background:
              "radial-gradient(ellipse at 0% 100%, #a78bfa 0%, #22d3ee 50%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-1/4 left-0 w-[280px] h-[280px] opacity-[0.04] blur-[70px]"
          style={{
            background:
              "radial-gradient(ellipse at 0% 80%, #7c3aed 0%, transparent 70%)",
          }}
        />
      </div>

      <BlogPostToolbar title={post.title} />

      <article className="max-w-3xl mx-auto relative z-10">
        <BlogHeader
          post={post}
          isModerator={isModerator}
          formattedDate={formattedDate}
          readTime={readTime}
          onShare={handleShare}
        />
        <BlogActions
          post={post}
          normalizedSlug={normalizedSlug!}
          adjacent={adjacent}
        />
      </article>

      {post && normalizedSlug && (
        <div className="max-w-3xl mx-auto px-5">
          <RelatedPosts
            currentSlug={normalizedSlug}
            currentTags={post.tags || []}
          />
        </div>
      )}
    </div>
  );
}

export default function BlogPostClient({ slug }: { slug?: string }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-full border-2 border-white/[0.06]" />
            <div
              className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
              style={{
                borderTopColor: "#a78bfa",
                borderRightColor: "#22d3ee",
              }}
            />
          </div>
        </div>
      }
    >
      <BlogPostInner slug={slug} />
    </Suspense>
  );
}
