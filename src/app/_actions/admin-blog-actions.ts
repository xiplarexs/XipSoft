"use server";

import pool from "@/lib/database";
import { slugify } from "@/utils/slugify";
import { revalidatePath } from "next/cache";
import { getServerActionContext } from "@/lib/api-guard";

async function requireAdminAction() {
  const ctx = await getServerActionContext();
  if (!ctx.isAuthenticated || ctx.userRole !== "admin") {
    throw new Error("Admin yetkisi gerekiyor");
  }
  return ctx;
}

export async function createBlogPost(data: {
  title: string;
  description: string;
  content: any;
  author_id: number;
  status: "draft" | "published";
  tags?: string[];
  cover_image_url?: string;
  slug: string;
}) {
  try {
    await requireAdminAction();

    const { title, description, content, author_id, status, tags = [], cover_image_url, slug: providedSlug } = data;

    // Slug üretimi: API'ye slug gelmezse baslıktan üret ve DB'de benzersizlestir
    let baseSlug = providedSlug ? slugify(providedSlug) : slugify(title || "");
    if (!baseSlug) baseSlug = "yazi";
    const existing = await pool.query(`SELECT slug FROM blog_posts WHERE slug LIKE $1`, [`${baseSlug}%`]);
    const existingSlugs = new Set(existing.rows.map((r: any) => r.slug));
    let uniqueSlug = baseSlug;
    let counter = 2;
    while (existingSlugs.has(uniqueSlug)) {
      uniqueSlug = `${baseSlug}-${counter++}`;
    }

    const result = await pool.query(
      `INSERT INTO blog_posts (title, description, content, author_id, status, tags, cover_image_url, slug, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNINg *`,
      [
        title,
        description,
        JSON.stringify(content),
        author_id,
        status,
        tags,
        cover_image_url,
        uniqueSlug,
        status === "published" ? new Date().toISOString() : null,
      ]
    );

    revalidatePath("/blog");
    revalidatePath("/", "layout");
    revalidatePath("/sitemap.xml");
    revalidatePath("/sitemap-blog.xml");

    // IndexNow + google ping — yeni blog yazısı yayınlandıysa arama motorlarını bildir
    if (status === "published" && result.rows[0]?.slug) {
      const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://xipsoft.net";
    }

    return { success: true, post: result.rows[0] };
  } catch (error: any) {
    console.error("Blog post creation error:", error);
    return { success: false, error: error.message };
  }
}

export async function getBlogPosts(limit = 50, offset = 0) {
  try {
    await requireAdminAction();

    const result = await pool.query(
      `SELECT bp.*, u.display_name as author_name, u.email as author_email
       FROM blog_posts bp
       LEFT JOIN users u ON bp.author_id = u.id
       WHERE bp.deleted_at IS NULL
       ORDER BY bp.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return { success: true, posts: result.rows };
  } catch (error: any) {
    console.error("get blog posts error:", error);
    return { success: false, error: error.message, posts: [] };
  }
}

export async function updateBlogPost(
  id: number,
  data: Partial<{
    title: string;
    description: string;
    content: any;
    status: "draft" | "published";
    tags: string[];
    cover_image_url: string;
    slug: string;
  }>
) {
  try {
    await requireAdminAction();

    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    // Parameterized query — SQL injection koruması
    if (data.title !== undefined) {
      fields.push(`title = $${paramCount++}`);
      values.push(data.title);
    }
    if (data.description !== undefined) {
      fields.push(`description = $${paramCount++}`);
      values.push(data.description);
    }
    if (data.content !== undefined) {
      fields.push(`content = $${paramCount++}`);
      values.push(JSON.stringify(data.content));
    }
    if (data.status !== undefined) {
      fields.push(`status = $${paramCount++}`);
      values.push(data.status);
      if (data.status === "published") {
        fields.push(`published_at = CURRENT_TIMESTAMP`);
      }
    }
    if (data.tags !== undefined) {
      fields.push(`tags = $${paramCount++}`);
      values.push(data.tags);
    }
    if (data.cover_image_url !== undefined) {
      fields.push(`cover_image_url = $${paramCount++}`);
      values.push(data.cover_image_url);
    }
    // Eger explicit slug verilmisse kullan; verilmemis ve baslık degismisse
    // baslıktan otomatik olarak slug üret ve benzersizlestir (mevcut id hariç)
    if (data.slug !== undefined) {
      fields.push(`slug = $${paramCount++}`);
      values.push(slugify(String(data.slug)));
    } else if (data.title !== undefined) {
      const base = slugify(String(data.title));
      const existing = await pool.query(`SELECT slug FROM blog_posts WHERE slug LIKE $1 AND id != $2`, [`${base}%`, id]);
      const existingSlugs = new Set(existing.rows.map((r: any) => r.slug));
      let uniq = base || "yazi";
      let c = 2;
      while (existingSlugs.has(uniq)) {
        uniq = `${base}-${c++}`;
      }
      fields.push(`slug = $${paramCount++}`);
      values.push(uniq);
    }

    if (fields.length === 0) return { success: false, error: "güncellenecek alan yok" };

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await pool.query(
      `UPDATE blog_posts SET ${fields.join(", ")} WHERE id = $${paramCount} RETURNINg *`,
      values
    );

    revalidatePath("/blog");
    revalidatePath("/blog/[slug]", "page");
    if (data.slug) revalidatePath(`/blog/${data.slug}`);
    revalidatePath("/", "layout");
    revalidatePath("/sitemap.xml");
    revalidatePath("/sitemap-blog.xml");

    // IndexNow — blog yazısı yayınlandıysa veya güncellendiyse bildir
    const updatedPost = result.rows[0];
    if (updatedPost?.slug && (data.status === "published" || updatedPost.status === "published")) {
      const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://xipsoft.net";
      const eventType = data.status === "published" ? "add" : "update";
    }

    return { success: true, post: updatedPost };
  } catch (error: any) {
    console.error("Update blog post error:", error);
    return { success: false, error: error.message };
  }
}

// ── Çöp Kutusu ──────────────────────────────────────────────────────────────

export async function getDeletedBlogPostsAction() {
  try {
    await requireAdminAction();
    const result = await pool.query(
      `SELECT bp.id, bp.title, bp.slug, bp.deleted_at, u.display_name as author_name
       FROM blog_posts bp
       LEFT JOIN users u ON bp.author_id = u.id
       WHERE bp.deleted_at IS NOT NULL
       ORDER BY bp.deleted_at DESC
       LIMIT 200`
    );
    return { success: true, posts: result.rows };
  } catch (error: any) {
    return { success: false, error: error.message, posts: [] };
  }
}

export async function restoreBlogPostAction(id: number) {
  try {
    await requireAdminAction();
    if (!Number.isInteger(id) || id <= 0) return { success: false, error: "geçersiz ID" };

    const slugResult = await pool.query<{ slug: string }>(
      `SELECT slug FROM blog_posts WHERE id = $1`,
      [id]
    );
    const slug = slugResult.rows[0]?.slug;

    await pool.query(
      `UPDATE blog_posts SET deleted_at = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [id]
    );

    revalidatePath("/blog");
    revalidatePath("/blog/[slug]", "page");
    if (slug) revalidatePath(`/blog/${slug}`);
    revalidatePath("/", "layout");
    revalidatePath("/sitemap.xml");
    revalidatePath("/sitemap-blog.xml");

    return { success: true };
  } catch (error: any) {
    console.error("restoreBlogPostAction error:", error);
    return { success: false, error: error.message };
  }
}

export async function hardDeleteBlogPostAction(id: number) {
  try {
    await requireAdminAction();
    if (!Number.isInteger(id) || id <= 0) return { success: false, error: "geçersiz ID" };

    await pool.query(
      `DELETE FROM blog_posts WHERE id = $1 AND deleted_at IS NOT NULL`,
      [id]
    );

    revalidatePath("/blog");
    revalidatePath("/", "layout");
    revalidatePath("/sitemap.xml");
    revalidatePath("/sitemap-blog.xml");

    return { success: true };
  } catch (error: any) {
    console.error("hardDeleteBlogPostAction error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteBlogPost(id: number) {
  try {
    await requireAdminAction();

    if (!Number.isInteger(id) || id <= 0) {
      return { success: false, error: "geçersiz ID" };
    }

    const slugResult = await pool.query<{ slug: string }>(
      `SELECT slug FROM blog_posts WHERE id = $1`,
      [id]
    );
    const slug = slugResult.rows[0]?.slug;

    await pool.query(
      `UPDATE blog_posts SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [id]
    );

    revalidatePath("/blog");
    revalidatePath("/blog/[slug]", "page");
    if (slug) revalidatePath(`/blog/${slug}`);
    revalidatePath("/", "layout");
    revalidatePath("/sitemap.xml");
    revalidatePath("/sitemap-blog.xml");

    return { success: true };
  } catch (error: any) {
    console.error("Delete blog post error:", error);
    return { success: false, error: error.message };
  }
}
