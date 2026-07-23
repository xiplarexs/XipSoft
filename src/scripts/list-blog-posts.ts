/**
 * list-blog-posts.ts
 * Veritabanındaki blog yazılarını listeler.
 * Çalıstırma: npm run blog:list
 */

import pool from "@/lib/database";

interface BlogRow {
  id: number;
  title: string;
  slug: string;
  status: string;
  author_name: string | null;
  tags: string[] | null;
  published_at: Date | null;
  created_at: Date;
}

async function listBlogPosts(): Promise<void> {
  console.log("📋 Blog yazıları listeleniyor...\n");

  const { rows } = await pool.query<BlogRow>(`
    SELECT
      bp.id,
      bp.title,
      bp.slug,
      bp.status,
      u.display_name AS author_name,
      bp.tags,
      bp.published_at,
      bp.created_at
    FROM blog_posts bp
    LEFT JOIN users u ON u.id = bp.author_id
    WHERE bp.deleted_at IS NULL
    ORDER BY bp.created_at DESC
  `);

  if (rows.length === 0) {
    console.log("Henüz blog yazısı yok.");
    process.exit(0);
  }

  const published  = rows.filter((r) => r.status === "published");
  const drafts     = rows.filter((r) => r.status === "draft");

  console.log(`Toplam: ${rows.length} yazı — ${published.length} yayında, ${drafts.length} taslak\n`);

  // Yayımdakiler
  if (published.length > 0) {
    console.log("✅ YAYINDA:");
    for (const p of published) {
      const date = p.published_at
        ? new Date(p.published_at).toLocaleDateString("tr-TR")
        : new Date(p.created_at).toLocaleDateString("tr-TR");
      const tags = p.tags?.length ? `[${p.tags.join(", ")}]` : "";
      console.log(
        `  #${p.id} | ${date} | ${(p.author_name ?? "Bilinmiyor").padEnd(20)} | ${tags.padEnd(30)} | ${p.title}`
      );
    }
  }

  // Taslaklar
  if (drafts.length > 0) {
    console.log("\n📝 TASLAK:");
    for (const d of drafts) {
      const date = new Date(d.created_at).toLocaleDateString("tr-TR");
      const tags = d.tags?.length ? `[${d.tags.join(", ")}]` : "";
      console.log(
        `  #${d.id} | ${date} | ${(d.author_name ?? "Bilinmiyor").padEnd(20)} | ${tags.padEnd(30)} | ${d.title}`
      );
    }
  }

  console.log("\nBitti.");
  process.exit(0);
}

listBlogPosts().catch((err) => {
  console.error("❌ Hata:", err);
  process.exit(1);
});
