import type { PoolClient } from "pg";

export async function runIndexes(client: PoolClient): Promise<void> {
  // Blog posts
  await client.query(`CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts (slug)`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts (status, deleted_at, published_at)`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts (author_id)`);

  // Products
  await client.query(`CREATE INDEX IF NOT EXISTS idx_products_slug ON products (slug)`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_products_category_active ON products (category, is_active)`);

  // Service pages
  await client.query(`CREATE INDEX IF NOT EXISTS idx_service_pages_slug ON service_pages (slug, is_active)`);

  // References
  await client.query(`CREATE INDEX IF NOT EXISTS idx_site_references_active ON site_references (is_active, order_index)`);

  // Users
  await client.query(`CREATE INDEX IF NOT EXISTS idx_users_uid ON users (uid)`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users (email)`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_users_display_name ON users (display_name)`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_users_nick ON users (nick)`);

  // Site visitors
  await client.query(`CREATE INDEX IF NOT EXISTS idx_site_visitors_created_at ON site_visitors (created_at)`);

  // Security logs
  await client.query(`CREATE INDEX IF NOT EXISTS idx_security_logs_ip_event ON security_logs (ip_address, event_type, created_at)`);

  // Verification tokens
  await client.query(`CREATE INDEX IF NOT EXISTS idx_verification_tokens_email_type ON verification_tokens (email, type)`);

  // Teklif requests
  await client.query(`CREATE INDEX IF NOT EXISTS idx_teklif_requests_token ON teklif_requests (token)`);

  // IP blocklist
  await client.query(`CREATE INDEX IF NOT EXISTS idx_ip_blocklist_address ON ip_blocklist (ip_address)`);
}
