import pool from './database';

interface IProduct {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  base_price: number;
  category: string;
  version: string | null;
  features: string[];
  demo_urls: string[];
  template_files: string[];
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * Product Database Helpers
 * E-commerce product management operations
 */

const PRODUCT_COLUMNS = 'id, name, slug, description, base_price, category, version, features, demo_urls, template_files, is_active, created_at, updated_at';

export async function getProductBySlug(slug: string): Promise<IProduct | null> {
  const query = `SELECT ${PRODUCT_COLUMNS} FROM products WHERE slug = $1 AND is_active = true`;
  const result = await pool.query(query, [slug]);
  return result.rows[0] || null;
}
