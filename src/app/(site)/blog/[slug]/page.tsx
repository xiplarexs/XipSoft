/**
 * Blog Detay Sayfası — /blog/[slug]
 * Kaynak: DB (blog_posts tablosu)
 */

import { FC } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/config/config";
import { blogSchemaFromDb, breadcrumbSchema } from "@/seobot/schema-registry";
import { generateAutoMetadata } from "@/seobot/db-seo-settings";
import pool from "@/lib/database";
import BlogPostClient from "@/app/(site)/blog/post/BlogPostClient";

export const revalidate = 300;

// ── DB blog helper ────────────────────────────────────────────────────────────

interface DbBlogRow {
  id: string;
  title: string;
  description: string | null;
  content: unknown;
  tags: string[] | null;
  cover_image_url: string | null;
  slug: string;
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
  author_name: string | null;
  author_avatar: string | null;
}

async function getDbBlogBySlug(slug: string): Promise<DbBlogRow | null> {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  try {
    // Önce tam eslesme dene, bulamazsa timestamp suffix'li slug'lar için LIKE ara
    const { rows } = await pool.query<DbBlogRow>(
      `SELECT bp.id, bp.title, bp.description, bp.content, bp.tags,
              bp.cover_image_url, bp.slug, bp.published_at, bp.created_at, bp.updated_at,
              u.display_name AS author_name,
              u.photo_url    AS author_avatar
       FROM blog_posts bp
       LEFT JOIN users u ON u.id = bp.author_id
       WHERE (bp.slug = $1 OR bp.slug LIKE $1 || '-%')
         AND bp.status = 'published'
         AND bp.deleted_at IS NULL
       ORDER BY bp.created_at DESC
       LIMIT 1`,
      [slug]
    );
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

function extractTextFromContent(content: unknown): string {
  if (!content) return "";
  if (typeof content === "string") return content;
  const node = content as any;
  if (node.type === "text") return node.text ?? "";
  if (Array.isArray(node.content)) {
    return node.content.map(extractTextFromContent).join(" ");
  }
  return "";
}

type TBlogDetailPageProps = {
  params: Promise<{ slug: string }>;
};

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: TBlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  const dbBlog = await getDbBlogBySlug(slug);
  if (!dbBlog) {
    return { title: "Blog Yazısı Bulunamadı", robots: { index: false } };
  }

  let autoMetadata: any = {};
  try {
    autoMetadata = await generateAutoMetadata(`/blog/${slug}`);
  } catch {
    autoMetadata = {};
  }

  const title = autoMetadata.title || `${dbBlog.title} | XipSoft`;
  const description = autoMetadata.description || dbBlog.description || dbBlog.title;
  const canonical = autoMetadata.alternates?.canonical || `${SITE_URL}/blog/${slug}`;
  const image = dbBlog.cover_image_url || `${SITE_URL}/images/xipsoft-seo.png`;

  return {
    title,
    description,
    keywords: autoMetadata.keywords || (Array.isArray(dbBlog.tags) ? dbBlog.tags : []),
    alternates: { canonical },
    robots: autoMetadata.robots || {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
    ...(dbBlog.author_name && { authors: [{ name: dbBlog.author_name }] }),
    opengraph: {
      type: "article",
      locale: "tr_TR",
      url: canonical,
      siteName: "XipSoft",
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: dbBlog.title }],
      publishedTime: (dbBlog.published_at ?? dbBlog.created_at)?.toISOString(),
      authors: [dbBlog.author_name ?? "XipBot"],
      tags: Array.isArray(dbBlog.tags) ? dbBlog.tags : [],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

// ── SSR içerik bileseni (googlebot için) ─────────────────────────────────────

function DbBlogSSRContent({ post }: { post: DbBlogRow }) {
  const textContent = extractTextFromContent(post.content);
  const dateStr = (post.published_at ?? post.created_at)?.toLocaleDateString("tr-TR", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <article
      id="blog-post-seo-content"
      itemScope
      itemType="https://schema.org/BlogPosting"
      className="sr-only"
    >
      <h1 itemProp="headline">{post.title}</h1>
      {post.description && <p itemProp="description">{post.description}</p>}
      {post.author_name && (
        <span itemProp="author" itemScope itemType="https://schema.org/Person">
          <span itemProp="name">{post.author_name}</span>
        </span>
      )}
      {dateStr && (
        <time itemProp="datePublished" dateTime={(post.published_at ?? post.created_at)?.toISOString()}>
          {dateStr}
        </time>
      )}
      {Array.isArray(post.tags) && post.tags.length > 0 && (
        <ul>
          {post.tags.map((tag) => (
            <li key={tag} itemProp="keywords">{tag}</li>
          ))}
        </ul>
      )}
      {textContent && <div itemProp="articleBody">{textContent.substring(0, 3000)}</div>}
    </article>
  );
}

// ── Ana Sayfa Bileseni ────────────────────────────────────────────────────────

const BlogDetailPage: FC<TBlogDetailPageProps> = async (props) => {
  const { slug } = await props.params;

  const dbBlog = await getDbBlogBySlug(slug);

  // DB'de yoksa gerçek 404 döndür — google soft 404 algılamasın
  if (!dbBlog) {
    notFound();
  }

  const schema = blogSchemaFromDb({
    title: dbBlog.title,
    description: dbBlog.description || dbBlog.title,
    url: `/blog/${slug}`,
    datePublished: (dbBlog.published_at ?? dbBlog.created_at)?.toISOString(),
    author: dbBlog.author_name ?? undefined,
    image: dbBlog.cover_image_url ?? undefined,
  });

  const breadcrumb = breadcrumbSchema([
    { name: "Ana Sayfa", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: dbBlog.title, url: `/blog/${slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <DbBlogSSRContent post={dbBlog} />
      <BlogPostClient slug={slug} />
    </>
  );
};

export default BlogDetailPage;
