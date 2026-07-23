/**
 * migrate-services.ts
 * Statik services.ts verisini PostgreSQL'e aktarır.
 * Çalıstırma: npm run migrate:services
 */
import pool from "@/lib/database";
import { services } from "@/data/services";

async function migrateServices() {
  console.log("🚀 Hizmet verisi migration baslıyor...");

  // Tablo olustur
  await pool.query(`
    CREATE TABLE IF NOT EXISTS services (
      id            SERIAL PRIMARY KEY,
      slug          VARCHAR(120) UNIQUE NOT NULL,
      is_active     BOOLEAN DEFAULT true,
      sort_order    INTEgER DEFAULT 0,
      badge         VARCHAR(80),
      badge_icon    VARCHAR(40),
      badge_gradient VARCHAR(120),
      badge_color   VARCHAR(40),
      title         VARCHAR(200) NOT NULL,
      title_gradient VARCHAR(120),
      subtitle      TEXT,
      hero_cta      VARCHAR(80),
      stats         JSONB DEFAULT '[]',
      features      JSONB DEFAULT '[]',
      tech_stack    JSONB DEFAULT '[]',
      services_tag  JSONB DEFAULT '[]',
      process_steps JSONB DEFAULT '[]',
      packages      JSONB DEFAULT '[]',
      micro_services JSONB DEFAULT '[]',
      faq_items     JSONB DEFAULT '[]',
      metadata      JSONB DEFAULT '{}',
      process_title VARCHAR(120),
      process_desc  TEXT,
      cta_title     VARCHAR(200),
      cta_desc      TEXT,
      cta_btn       VARCHAR(80),
      faq_title     VARCHAR(120),
      created_at    TIMESTAMPTZ DEFAULT NOW(),
      updated_at    TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  const sortedSlugs = Object.keys(services);
  let inserted = 0;
  let updated = 0;

  for (const [i, slug] of sortedSlugs.entries()) {
    const s = services[slug];
    if (!s) {
      console.warn(`Skipping missing service: ${slug}`);
      continue;
    }

    // icon nesnelerini string'e çevir (DB'de JSON olarak saklanır)
    const serializableFeatures = s.features.map((f) => ({
      ...f,
      icon: typeof f.icon === "string" ? f.icon : (f.icon as any)?.displayName || "globe",
    }));
    const serializableMicro = s.microServices.map((m) => ({
      ...m,
      icon: typeof m.icon === "string" ? m.icon : (m.icon as any)?.displayName || "globe",
    }));
    const badgeIcon = typeof s.badgeIcon === "string"
      ? s.badgeIcon
      : (s.badgeIcon as any)?.displayName || "globe";

    const { rows } = await pool.query(`
      INSERT INTO services (
        slug, is_active, sort_order,
        badge, badge_icon, badge_gradient, badge_color,
        title, title_gradient, subtitle, hero_cta,
        stats, features, tech_stack, services_tag,
        process_title, process_desc, process_steps,
        packages, micro_services, faq_title, faq_items,
        cta_title, cta_desc, cta_btn, metadata
      ) VALUES (
        $1, true, $2,
        $3, $4, $5, $6,
        $7, $8, $9, $10,
        $11, $12, $13, $14,
        $15, $16, $17,
        $18, $19, $20, $21,
        $22, $23, $24, $25
      )
      ON CONFLICT (slug) DO UPDATE SET
        is_active      = EXCLUDED.is_active,
        sort_order     = EXCLUDED.sort_order,
        badge          = EXCLUDED.badge,
        badge_icon     = EXCLUDED.badge_icon,
        badge_gradient = EXCLUDED.badge_gradient,
        badge_color    = EXCLUDED.badge_color,
        title          = EXCLUDED.title,
        title_gradient = EXCLUDED.title_gradient,
        subtitle       = EXCLUDED.subtitle,
        hero_cta       = EXCLUDED.hero_cta,
        stats          = EXCLUDED.stats,
        features       = EXCLUDED.features,
        tech_stack     = EXCLUDED.tech_stack,
        services_tag   = EXCLUDED.services_tag,
        process_title  = EXCLUDED.process_title,
        process_desc   = EXCLUDED.process_desc,
        process_steps  = EXCLUDED.process_steps,
        packages       = EXCLUDED.packages,
        micro_services = EXCLUDED.micro_services,
        faq_title      = EXCLUDED.faq_title,
        faq_items      = EXCLUDED.faq_items,
        cta_title      = EXCLUDED.cta_title,
        cta_desc       = EXCLUDED.cta_desc,
        cta_btn        = EXCLUDED.cta_btn,
        metadata       = EXCLUDED.metadata,
        updated_at     = NOW()
      RETURNINg (xmax = 0) AS inserted
    `, [
      slug, i,
      s.badge, badgeIcon, s.badgegradient, s.badgeColor,
      s.title, s.titlegradient, s.subtitle, s.heroCta,
      JSON.stringify(s.stats),
      JSON.stringify(serializableFeatures),
      JSON.stringify(s.techStack ?? []),
      JSON.stringify(s.servicesTag ?? []),
      s.processTitle ?? null,
      s.processDesc ?? null,
      JSON.stringify(s.processSteps),
      JSON.stringify(s.packages),
      JSON.stringify(serializableMicro),
      s.faqTitle,
      JSON.stringify(s.faqItems),
      s.ctaTitle, s.ctaDesc, s.ctaBtn,
      JSON.stringify(s.metadata),
    ]);

    if (rows[0]?.inserted) inserted++;
    else updated++;
    console.log(`  ✅ ${slug} (${rows[0]?.inserted ? "eklendi" : "güncellendi"})`);
  }

  console.log(`\n✨ Migration tamamlandı: ${inserted} eklendi, ${updated} güncellendi`);
  process.exit(0);
}

migrateServices().catch((err) => {
  console.error("❌ Migration hatası:", err);
  process.exit(1);
});
