/**
 * usePostList — OCP + SRP
 *
 * generic pagination hook. Blog ve Job list hook'ları bunu wrap eder.
 * Yeni bir liste eklemek için mevcut kodu degistirmek gerekmez.
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import type { PaginatedResult } from "@/types/common";

type FetchFn<T> = (pageSize: number, offset: number) => Promise<PaginatedResult<T>>;

export interface UsePostListResult<T> {
  items: T[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  loadMore: () => Promise<void>;
}

export function usePostList<T>(
  fetchFn: FetchFn<T>,
  pageSize = 6
): UsePostListResult<T> {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await fetchFn(pageSize, 0);
        if (cancelled) return;
        setItems(result.data);
        setOffset(result.nextOffset);
        setHasMore(result.hasMore);
      } catch (err) {
        if (!cancelled) setError("Failed to load items");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [pageSize]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    try {
      const result = await fetchFn(pageSize, offset);
      setItems((prev) => [...prev, ...result.data]);
      setOffset(result.nextOffset);
      setHasMore(result.hasMore);
    } catch {
      setError("Failed to load more items");
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, offset, pageSize]); // eslint-disable-line react-hooks/exhaustive-deps

  return { items, loading, loadingMore, hasMore, error, loadMore };
}
