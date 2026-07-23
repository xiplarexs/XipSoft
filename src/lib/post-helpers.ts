/**
 * post-helpers.ts — SRP + DIP
 *
 * Tum post tabloları için ortak DB islemleri.
 * Actions bu fonksiyonları kullanır; dogrudan pool'a bagımlı degildir.
 */

import pool from "@/lib/database";
import { slugify } from "@/utils/slugify";
import type { PaginatedResult } from "@/types/common";

/**
 * Slug üretimi — slugify() üzerinden tek kaynak.
 * max 80 karakter, bos ise 'post' döner.
 */
export function generateSlug(base: string): string {
  return slugify(base).slice(0, 80) || "post";
}

/** Sayfalı sorgu sonucunu PaginatedResult'a dönustur */
export async function buildPaginatedResult<T>(
  rows: Record<string, unknown>[],
  pageSize: number,
  offset: number,
  mapper: (row: Record<string, unknown>) => T
): Promise<PaginatedResult<T>> {
  const hasMore = rows.length > pageSize;
  return {
    data: rows.slice(0, pageSize).map(mapper),
    hasMore,
    nextOffset: offset + pageSize,
  };
}

/** Soft delete — tablo adı whitelist ile dogrulanır, SQL injection'dan korunur */
const ALLOWED_TABLES = ['blog_posts', 'job_posts', 'books', 'references'];

export async function softDelete(table: string, id: string): Promise<boolean> {
  try {
    // Tablo adını whitelist ile dogrula
    if (!ALLOWED_TABLES.includes(table)) {
      console.error(`softDelete: Invalid table "${table}" - not in whitelist`);
      return false;
    }
    
    await pool.query(`UPDATE ${table} SET deleted_at = NOW() WHERE id = $1`, [id]);
    return true;
  } catch (err) {
    console.error(`softDelete(${table}) error:`, err);
    return false;
  }
}

/** Yayın durumu güncelleme — publish / unpublish (tablo adı whitelist ile dogrulanır) */
export async function setPublishStatus(
  table: string,
  id: string,
  publish: boolean
): Promise<boolean> {
  try {
    // Tablo adını whitelist ile dogrula
    if (!ALLOWED_TABLES.includes(table)) {
      console.error(`setPublishStatus: Invalid table "${table}" - not in whitelist`);
      return false;
    }

    if (publish) {
      await pool.query(
        `UPDATE ${table} SET status = 'published', published_at = NOW(), updated_at = NOW() WHERE id = $1 AND deleted_at IS NULL`,
        [id]
      );
    } else {
      await pool.query(
        `UPDATE ${table} SET status = 'draft', published_at = NULL, updated_at = NOW() WHERE id = $1 AND deleted_at IS NULL`,
        [id]
      );
    }
    return true;
  } catch (err) {
    console.error(`setPublishStatus(${table}) error:`, err);
    return false;
  }
}
