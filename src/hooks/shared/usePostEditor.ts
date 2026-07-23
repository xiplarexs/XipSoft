/**
 * usePostEditor — OCP + SRP
 *
 * generic editor hook: yukleme, auto-save, kaydetme.
 * Blog ve Job editor hook'ları bunu wrap eder.
 */
"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export interface PostEditorActions<TPost, TInput> {
  getPost: (id: string) => Promise<TPost | null>;
  createPost: (input: TInput, user: any) => Promise<string | null>;
  updatePost: (id: string, input: Partial<TInput>) => Promise<boolean>;
}

export interface UsePostEditorResult<TPost, TInput> {
  post: TPost | null;
  postId: string | null;
  saving: boolean;
  loading: boolean;
  error: string | null;
  save: (input: TInput) => Promise<string | null>;
  autoSave: (input: Partial<TInput>) => void;
}

export function usePostEditor<TPost, TInput>(
  actions: PostEditorActions<TPost, TInput>,
  postId?: string
): UsePostEditorResult<TPost, TInput> {
  const { user } = useAuth();
  const [post, setPost] = useState<TPost | null>(null);
  const [currentPostId, setCurrentPostId] = useState<string | null>(postId ?? null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!postId);
  const [error, setError] = useState<string | null>(null);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!postId) return;
    let cancelled = false;
    (async () => {
      try {
        const existing = await actions.getPost(postId);
        if (cancelled || !existing) return;
        setPost(existing);
      } catch {
        setError("Failed to load post");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [postId]); // eslint-disable-line react-hooks/exhaustive-deps

  const autoSave = useCallback(
    (input: Partial<TInput>) => {
      if (!currentPostId || !user) return;
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = setTimeout(() => {
        actions.updatePost(currentPostId, input);
      }, 5000);
    },
    [currentPostId, user] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const save = useCallback(
    async (input: TInput): Promise<string | null> => {
      if (!user) return null;
      setSaving(true);
      setError(null);
      try {
        if (currentPostId) {
          await actions.updatePost(currentPostId, input);
          return currentPostId;
        } else {
          const newId = await actions.createPost(input, user);
          if (newId) setCurrentPostId(newId);
          return newId;
        }
      } catch {
        setError("Failed to save post");
        return null;
      } finally {
        setSaving(false);
      }
    },
    [user, currentPostId] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return { post, postId: currentPostId, saving, loading, error, save, autoSave };
}
