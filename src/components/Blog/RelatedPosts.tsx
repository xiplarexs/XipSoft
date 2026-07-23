"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { getBlogPostsAction } from "@/app/_actions/blog-actions";
import type { BlogPost } from "@/types/blog";

interface RelatedPostsProps {
  currentSlug: string;
  currentTags?: string[];
}

export default function RelatedPosts({ currentSlug, currentTags = [] }: RelatedPostsProps) {
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const posts = await getBlogPostsAction();
        if (cancelled) return;

        // Ilgili yazıları bul (tag'lere göre)
        const related = posts
          .filter((post: BlogPost) => post.slug !== currentSlug)
          .filter((post: BlogPost) => {
            if (!currentTags.length) return true;
            const postTags = post.tags || [];
            return postTags.some((tag) => currentTags.includes(tag));
          })
          .slice(0, 3); // En fazla 3 ilgili yazı

        setRelatedPosts(related);
      } catch (error) {
        console.error("Failed to load related posts:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [currentSlug, currentTags]);

  if (loading || relatedPosts.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-16 pt-8 border-t border-white/10"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Ilgili Yazılar</h2>
      
      <div className="grid gap-6 md:grid-cols-3">
        {relatedPosts.map((post, index) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Link
              href={`/blog/${post.slug}`}
              className="group block h-full rounded-xl border border-white/10 bg-white/[0.02] p-5 hover:border-purple-500/30 hover:bg-white/[0.04] transition-all duration-300"
            >
              {post.coverImageURL && (
                <div className="mb-4 rounded-lg overflow-hidden">
                  <img
                    src={post.coverImageURL}
                    alt={post.title}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              )}
              
              <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors mb-2 line-clamp-2">
                {post.title}
              </h3>
              
              {post.description && (
                <p className="text-sm text-zinc-400 line-clamp-2 mb-3">
                  {post.description}
                </p>
              )}
              
              <div className="flex items-center gap-2 text-sm text-purple-400 group-hover:text-purple-300 transition-colors">
                <span>Devamını Oku</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
