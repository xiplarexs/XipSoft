"use client";

import { usePostList, type UsePostListResult } from "@/hooks/shared/usePostList";
import { getPublishedBlogPostsAction } from "@/app/_actions/blog-actions";
import type { BlogPost } from "@/types/blog";

/** Blog listesi — usePostList'in blog için özellesmis wrapper'ı */
export function useBlogList(pageSize = 6): UsePostListResult<BlogPost> & { firestoreBlogs: BlogPost[] } {
  const result = usePostList<BlogPost>(getPublishedBlogPostsAction, pageSize);
  // firestoreBlogs: BlogPageClient.tsx'teki mevcut kullanımla uyumluluk için alias
  return { ...result, firestoreBlogs: result.items };
}
