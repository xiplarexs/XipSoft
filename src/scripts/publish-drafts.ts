/**
 * publish-drafts.ts
 * Taslak blog yazılarını yayınlar.
 * ID listesi verilirse yalnızca o yazıları, verilmezse tümünü yayınlar.
 *
 * Çalıstırma:
 *   npm run blog:publish              → tüm taslakları yayınla
 *   npm run blog:publish -- 12 34 56  → sadece belirtilen ID'leri yayınla
 */

import pool from "@/lib/database";

interface DraftRow {
  id: number;
  title: string;
  slug: string;
  author_name: string | null;
  created_at: Date;
}

async function publishDrafts(): Promise<void> {
  // CLI'dan ID listesi al: `tsx ... publish-drafts.ts 12 34`
  const idArgs = process.argv.slice(2).map(Number).filter((n) => n > 0 && Number.isInteger(n));

  // Hedef taslakları bul
  let query: string;
  let params: (number | string)[];

  if (idArgs.length > 0) {
    const placeholders = idArgs.map((_, i) => `$${i + 1}`).join(", ");
    query = `
      SELECT bp.id, bp.title, bp.slug, u.display_name AS author_name, bp.created_at
      FROM blog_posts bp
      LEFT JOIN users u ON u.id = bp.author_id
      WHERE bp.id IN (${placeholders})
        AND bp.status = 'draft'
        AND bp.deleted_at IS NULL
      ORDER BY bp.created_at ASC
    `;
    params = idArgs;
  } else {
    query = `
      SELECT bp.id, bp.title, bp.slug, u.display_name AS author_name, bp.created_at
      FROM blog_posts bp
      LEFT JOIN users u ON u.id = bp.author_id
      WHERE bp.status = 'draft'
        AND bp.deleted_at IS NULL
      ORDER BY bp.created_at ASC
    `;
    params = [];
  }

  const { rows: drafts } = await pool.query<DraftRow>(query, params);

  if (drafts.length === 0) {
    console.log("Yayınlanacak taslak bulunamadı.");
    process.exit(0);
  }

  const label = idArgs.length > 0
    ? `belirtilen ${drafts.length} taslak`
    : `${drafts.length} taslak`;

  console.log(`🚀 ${label} yayınlanıyor...\n`);

  let published = 0;
  let failed = 0;

  for (const draft of drafts) {
    try {
      await pool.query(
        `UPDATE blog_posts
         SET status = 'published',
             published_at = NOW(),
             updated_at = NOW()
         WHERE id = $1
           AND status = 'draft'
           AND deleted_at IS NULL`,
        [draft.id]
      );
      published++;
      console.log(`  ✅ #${draft.id} — ${draft.title} (${draft.slug})`);
    } catch (err: unknown) {
      failed++;
      const message = err instanceof Error ? err.message : String(err);
      console.error(`  ❌ #${draft.id} — ${draft.title} — Hata: ${message}`);
    }
  }

  console.log(`\n✨ Tamamlandı: ${published} yayınlandı${failed > 0 ? `, ${failed} basarısız` : ""}.`);
  process.exit(failed > 0 ? 1 : 0);
}

publishDrafts().catch((err) => {
  console.error("❌ Beklenmeyen hata:", err);
  process.exit(1);
});
