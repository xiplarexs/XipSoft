"use client";

import { useState, useCallback, useEffect } from "react";
import { usePostEditor } from "@/hooks/shared/usePostEditor";
import {
  createBlogPostAction,
  updateBlogPostAction,
  getBlogPostAction,
} from "@/app/_actions/blog-actions";
import type { BlogPost, BlogPostInput } from "@/types/blog";
import type { SerializedEditorState } from "lexical";

const BLOg_ACTIONS = {
  getPost: getBlogPostAction,
  createPost: createBlogPostAction,
  updatePost: updateBlogPostAction,
};

export function useBlogEditor(options: { postId?: string } = {}) {
  const { post, postId, saving, loading, error, save, autoSave } =
    usePostEditor<BlogPost, BlogPostInput>(BLOg_ACTIONS, options.postId);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [coverImageURL, setCoverImageURL] = useState<string | null>(null);
  const [content, setContent] = useState<SerializedEditorState | null>(null);

  // Mevcut post yuklenince alanları doldur
   
  useEffect(() => {
    if (!post) return;
    setTitle(post.title);
    setDescription(post.description);
    setTags(post.tags);
    setCoverImageURL(post.coverImageURL);
    setContent(post.content);
  }, [post]);

  // Içerik degisince auto-save tetikle
  useEffect(() => {
    if (!content) return;
    autoSave({ title, description, content, tags, coverImageURL });
  }, [content, title, description, tags, coverImageURL]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = useCallback(async () => {
    if (!content) return null;
    return save({ title, description, content, tags, coverImageURL });
  }, [title, description, content, tags, coverImageURL, save]);

  return {
    title, setTitle,
    description, setDescription,
    tags, setTags,
    coverImageURL, setCoverImageURL,
    content, setContent,
    postId, post,
    saving, loading, error,
    save: handleSave,
  };
}
