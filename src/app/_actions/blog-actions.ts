"use server";

import pool from "@/lib/database";
import {
  generateSlug,
  buildPaginatedResult,
  softDelete,
  setPublishStatus,
} from "@/lib/post-helpers";
import { shareBlogToTelegram } from "@/lib/telegram";
import type { BlogPost, BlogPostInput } from "@/types/blog";
import type { PaginatedResult } from "@/types/common";
import type { AuthUser } from "@/context/AuthContext";
import { getServerActionContext } from "@/lib/api-guard";

// ── Mapper (SRP: sadece satır → tip dönusumu) ────────────────────────────────

function rowToBlogPost(row: Record<string, unknown>): BlogPost {
  const rawContent = row.content;
  let content: BlogPost["content"] = rawContent as BlogPost["content"];

  if (typeof rawContent === "string") {
    try {
      content = JSON.parse(rawContent) as BlogPost["content"];
    } catch {
      content = rawContent as unknown as BlogPost["content"];
    }
  }

  // content obje ise ama Lexical formatında (root özelligi yok) degilse null yap
  if (typeof content === "object" && content !== null && !("root" in content)) {
    content = null as unknown as BlogPost["content"];
  }

  return {
    id: String(row.id),
    title: row.title as string,
    description: (row.description as string) ?? "",
    content,
    authorId: String(row.author_id),
    authorName: (row.author_name as string) === "XipBOT" ? "XipBot" : ((row.author_name as string) ?? "XipBot"),
    authorAvatar: (row.author_avatar as string) ?? null,
    status: row.status as BlogPost["status"],
    tags: (row.tags as string[]) ?? [],
    coverImageURL: (row.cover_image_url as string) ?? null,
    coverImageUrls: (row.cover_image_urls as any) ?? null,
    slug: row.slug as string,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
    publishedAt: row.published_at ? new Date(row.published_at as string) : null,
  };
}

// ── Ortak sorgu parçası ───────────────────────────────────────────────────────

const SELECT_BLOg =
  `SELECT bp.*, u.display_name AS author_name, u.photo_url AS author_avatar
   FROM blog_posts bp
   LEFT JOIN users u ON u.id = bp.author_id`;

// ── Actions ──────────────────────────────────────────────────────────────────

export async function getBlogPostsAction(): Promise<BlogPost[]> {
  try {
    const { rows } = await pool.query(
      `${SELECT_BLOg}
       WHERE bp.status = 'published' AND bp.deleted_at IS NULL
       ORDER BY bp.published_at DESC`
    );
    return rows.map(rowToBlogPost);
  } catch (err) {
    console.error("getBlogPostsAction error:", err);
    return [];
  }
}

export async function getPublishedBlogPostsAction(
  pageSize = 6,
  offset = 0
): Promise<PaginatedResult<BlogPost>> {
  try {
    // PERF: unstable_cache ile sonuçlar 5 dakika cache'lenir.
    // Blog listesi her ziyarette DB'ye gitmez — özellikle blog anasayfası
    // çok ziyaret alıyor ve içerik sık degismiyor.
    const { unstable_cache } = await import("next/cache");
    const cached = unstable_cache(
      async () => {
        const { rows } = await pool.query(
          `${SELECT_BLOg}
           WHERE bp.status = 'published' AND bp.deleted_at IS NULL
           ORDER BY bp.published_at DESC
           LIMIT $1 OFFSET $2`,
          [pageSize + 1, offset]
        );
        return buildPaginatedResult(rows, pageSize, offset, rowToBlogPost);
      },
      [`blog-list-${pageSize}-${offset}`],
      { revalidate: 300, tags: ["blog-list"] }
    );
    return cached();
  } catch (err) {
    console.error("getPublishedBlogPostsAction error:", err);
    return { data: [], hasMore: false, nextOffset: 0 };
  }
}

export async function getBlogPostAction(id: string): Promise<BlogPost | null> {
  try {
    const { rows } = await pool.query(
      `${SELECT_BLOg} WHERE bp.id = $1 AND bp.deleted_at IS NULL`,
      [id]
    );
    return rows[0] ? rowToBlogPost(rows[0]) : null;
  } catch (err) {
    console.error("getBlogPostAction error:", err);
    return null;
  }
}

export async function getBlogPostBySlugAction(slug: string): Promise<BlogPost | null> {
  try {
    const { rows } = await pool.query(
      `${SELECT_BLOg} WHERE (bp.slug = $1 OR bp.slug LIKE $1 || '-%') AND bp.status = 'published' AND bp.deleted_at IS NULL ORDER BY bp.created_at DESC LIMIT 1`,
      [slug]
    );
    return rows[0] ? rowToBlogPost(rows[0]) : null;
  } catch (err) {
    console.error("getBlogPostBySlugAction error:", err);
    return null;
  }
}

export async function getBlogAdjacentPostsAction(slug: string): Promise<{
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
}> {
  try {
    // PERF: Önceden tüm tablo çekilip JS'de index aranıyordu (O(n)).
    // simdi window query ile sadece komsu 2 satır çekiliyor (O(log n) + 2 rows).
    const { rows } = await pool.query<{
      slug: string; title: string; dir: string
    }>(
       `WITH current AS (
          SELECT COALESCE(published_at, created_at) AS ts
          FROM blog_posts
          WHERE (slug = $1 OR slug LIKE $1 || '-%') AND status = 'published' AND deleted_at IS NULL
          ORDER BY created_at DESC LIMIT 1
        )
       (
         SELECT slug, title, 'prev' AS dir
         FROM blog_posts, current
         WHERE status = 'published' AND deleted_at IS NULL
           AND COALESCE(published_at, created_at) < current.ts
         ORDER BY COALESCE(published_at, created_at) DESC
         LIMIT 1
       )
       UNION ALL
       (
         SELECT slug, title, 'next' AS dir
         FROM blog_posts, current
         WHERE status = 'published' AND deleted_at IS NULL
           AND COALESCE(published_at, created_at) > current.ts
         ORDER BY COALESCE(published_at, created_at) ASC
         LIMIT 1
       )`,
      [slug]
    );
    const prev = rows.find((r) => r.dir === "prev") ?? null;
    const next = rows.find((r) => r.dir === "next") ?? null;
    return {
      prev: prev ? { slug: prev.slug, title: prev.title } : null,
      next: next ? { slug: next.slug, title: next.title } : null,
    };
  } catch (err) {
    console.error("getBlogAdjacentPostsAction error:", err);
    return { prev: null, next: null };
  }
}

export async function getUserBlogPostsAction(
  uid: string,
  pageSize = 6,
  offset = 0
): Promise<PaginatedResult<BlogPost>> {
  try {
    const { rows } = await pool.query(
      `${SELECT_BLOg}
       WHERE u.uid = $1 AND bp.deleted_at IS NULL
       ORDER BY bp.updated_at DESC
       LIMIT $2 OFFSET $3`,
      [uid, pageSize + 1, offset]
    );
    return buildPaginatedResult(rows, pageSize, offset, rowToBlogPost);
  } catch (err) {
    console.error("getUserBlogPostsAction error:", err);
    return { data: [], hasMore: false, nextOffset: 0 };
  }
}

export async function createBlogPostAction(
  input: BlogPostInput,
): Promise<string | null> {
  // author_id her zaman dogrulanmıs session'dan alınır — client parametresine güvenilmez
  const ctx = await getServerActionContext();
  if (!ctx.isAuthenticated || !ctx.userId) return null;
  if (!["admin", "moderator"].includes(ctx.userRole)) return null;

  try {
    let slug = generateSlug(input.title);
    // Benzersizlik için varsa sayı ekle
    const existing = await pool.query(
      'SELECT slug FROM blog_posts WHERE slug = $1 OR slug LIKE $1 || \'-%\' AND deleted_at IS NULL ORDER BY slug DESC LIMIT 1',
      [slug]
    );
    if (existing.rows.length > 0) {
      const last = existing.rows[0].slug as string;
      const match = last.match(/-(\d+)$/);
      const num = match && match[1] ? parseInt(match[1]) + 1 : 2;
      slug = `${slug}-${num}`;
    }
    const { rows } = await pool.query(
      `INSERT INTO blog_posts (title, description, content, author_id, status, tags, cover_image_url, slug)
       VALUES ($1, $2, $3, $4, 'draft', $5, $6, $7)
       RETURNINg id`,
      [
        input.title,
        input.description,
        JSON.stringify(input.content),
        ctx.userId,          // ← session'dan, client'tan degil
        input.tags,
        input.coverImageURL,
        slug,
      ]
    );
    return String(rows[0].id);
  } catch (err) {
    console.error("createBlogPostAction error:", err);
    return null;
  }
}

export async function updateBlogPostAction(
  id: string,
  input: Partial<BlogPostInput>
): Promise<boolean> {
  const ctx = await getServerActionContext();
  if (!ctx.isAuthenticated || !ctx.userId) return false;
  try {
    // Sahiplik veya admin kontrolü
    const ownerCheck = await pool.query<{ author_id: number }>(
      "SELECT author_id FROM blog_posts WHERE id = $1 AND deleted_at IS NULL",
      [id]
    );
    if (!ownerCheck.rows[0]) return false;
    const isOwner = String(ownerCheck.rows[0].author_id) === ctx.userId;
    if (!isOwner && ctx.userRole !== "admin") return false;
    await pool.query(
      `UPDATE blog_posts
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           content = COALESCE($3, content),
           tags = COALESCE($4, tags),
           cover_image_url = COALESCE($5, cover_image_url),
           updated_at = NOW()
       WHERE id = $6 AND deleted_at IS NULL`,
      [
        input.title ?? null,
        input.description ?? null,
        input.content ? JSON.stringify(input.content) : null,
        input.tags ?? null,
        input.coverImageURL ?? null,
        id,
      ]
    );
    return true;
  } catch (err) {
    console.error("updateBlogPostAction error:", err);
    return false;
  }
}

export async function deleteBlogPostAction(id: string): Promise<boolean> {
  const ctx = await getServerActionContext();
  if (!ctx.isAuthenticated || !ctx.userId) return false;
  // Sahiplik veya admin kontrolü
  const ownerCheck = await pool.query<{ author_id: number }>(
    "SELECT author_id FROM blog_posts WHERE id = $1 AND deleted_at IS NULL",
    [id]
  );
  if (!ownerCheck.rows[0]) return false;
  const isOwner = String(ownerCheck.rows[0].author_id) === ctx.userId;
  if (!isOwner && ctx.userRole !== "admin") return false;
  return softDelete("blog_posts", id);
}

export async function publishBlogPostAction(id: string): Promise<boolean> {
  const ctx = await getServerActionContext();
  if (!ctx.isAuthenticated || !ctx.userId) return false;
  const ownerCheck = await pool.query<{ author_id: number; slug: string }>(
    "SELECT author_id, slug FROM blog_posts WHERE id = $1 AND deleted_at IS NULL",
    [id]
  );
  if (!ownerCheck.rows[0]) return false;
  const isOwner = String(ownerCheck.rows[0].author_id) === ctx.userId;
  if (!isOwner && ctx.userRole !== "admin") return false;
  const result = await setPublishStatus("blog_posts", id, true);
  // IndexNow + google ping + Telegram — yeni blog yazısı yayınlandı
  if (result && ownerCheck.rows[0].slug) {
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://xipsoft.net";
    const slug = ownerCheck.rows[0].slug;

    // IndexNow ping (fire-and-forget)

    // Telegram paylasımı (fire-and-forget)
    try {
      // Blog detaylarını çek
      const blogRow = await pool.query<{
        title: string;
        description: string | null;
        tags: string[] | null;
        author_name: string | null;
      }>(
        `SELECT bp.title, bp.description, bp.tags, u.display_name AS author_name
         FROM blog_posts bp
         LEFT JOIN users u ON u.id = bp.author_id
         WHERE bp.id = $1`,
        [id]
      );
      if (blogRow.rows[0]) {
        const { shareBlogToTelegram } = await import("@/lib/telegram");
        
        // Paylasım hem kanala hem de gruba
        shareBlogToTelegram({
          title: blogRow.rows[0].title,
          description: blogRow.rows[0].description,
          slug,
          authorName: blogRow.rows[0].author_name,
          tags: blogRow.rows[0].tags ?? undefined,
        }).catch(() => {});
        
        shareBlogToTelegram({
          title: blogRow.rows[0].title,
          description: blogRow.rows[0].description,
          slug,
          authorName: blogRow.rows[0].author_name,
          tags: blogRow.rows[0].tags ?? undefined,
        }).catch(() => {});
        
        // Facebook paylasımı (fire-and-forget)
        const shareBlogToFacebook = async (data: {
          title: string;
          description?: string | null;
          slug: string;
          authorName?: string | null;
          tags?: string[] | null;
        }) => {
          const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://xipsoft.net";
          const shareUrl = `${SITE_URL}/blog/${data.slug}`;
          
          // Facebook sharer URL olustur
          let fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
          if (data.title) {
            fbShareUrl += `&quote=${encodeURIComponent(data.title)}`;
          }
          
          // Yeni pencerede aç
          if (typeof window !== 'undefined') {
            window.open(fbShareUrl, '_blank', 'noopener,noreferrer');
          }
        };
        
        shareBlogToFacebook({
          title: blogRow.rows[0].title,
          description: blogRow.rows[0].description,
          slug,
          authorName: blogRow.rows[0].author_name,
          tags: blogRow.rows[0].tags,
        }).catch(() => {});
      }
    } catch {
      // Telegram hatası blog yayınını engellemesin
    }
  }
  return result;
}

export async function unpublishBlogPostAction(id: string): Promise<boolean> {
  const ctx = await getServerActionContext();
  if (!ctx.isAuthenticated || !ctx.userId) return false;
  const ownerCheck = await pool.query<{ author_id: number }>(
    "SELECT author_id FROM blog_posts WHERE id = $1 AND deleted_at IS NULL",
    [id]
  );
  if (!ownerCheck.rows[0]) return false;
  const isOwner = String(ownerCheck.rows[0].author_id) === ctx.userId;
  if (!isOwner && ctx.userRole !== "admin") return false;
  return setPublishStatus("blog_posts", id, false);
}
