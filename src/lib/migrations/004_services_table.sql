-- Migration 004: services tablosu
-- Hizmet sayfaları için DB-driven içerik sistemi
-- Çalıstırma: npm run db:init veya psql ile direkt çalıstırın

CREATE TABLE IF NOT EXISTS services (
  id            SERIAL PRIMARY KEY,
  slug          VARCHAR(120) UNIQUE NOT NULL,
  is_active     BOOLEAN DEFAULT true,
  sort_order    INTEgER DEFAULT 0,

  -- Hero bölümü
  badge         VARCHAR(80),
  badge_icon    VARCHAR(40),
  badge_gradient VARCHAR(120),
  badge_color   VARCHAR(40),
  title         VARCHAR(200) NOT NULL,
  title_gradient VARCHAR(120),
  subtitle      TEXT,
  hero_cta      VARCHAR(80),

  -- JSON kolonlar
  stats         JSONB DEFAULT '[]',
  features      JSONB DEFAULT '[]',
  tech_stack    JSONB DEFAULT '[]',
  services_tag  JSONB DEFAULT '[]',
  process_steps JSONB DEFAULT '[]',
  packages      JSONB DEFAULT '[]',
  micro_services JSONB DEFAULT '[]',
  faq_items     JSONB DEFAULT '[]',
  metadata      JSONB DEFAULT '{}',

  -- Process
  process_title VARCHAR(120),
  process_desc  TEXT,

  -- CTA
  cta_title     VARCHAR(200),
  cta_desc      TEXT,
  cta_btn       VARCHAR(80),
  faq_title     VARCHAR(120),

  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);

-- Trigger: updated_at otomatik güncelle
CREATE OR REPLACE FUNCTION update_services_updated_at()
RETURNS TRIggER AS $$
BEgIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANgUAgE plpgsql;

DROP TRIggER IF EXISTS services_updated_at ON services;
CREATE TRIggER services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_services_updated_at();
