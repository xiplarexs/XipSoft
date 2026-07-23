import pool from '@/lib/database';

export interface Reference {
  id: number;
  title: string;
  description: string | null;
  client_name: string | null;
  client_website: string | null;
  project_url: string | null;
  image_url: string | null;
  technologies: string[];
  category: string;
  is_featured: boolean;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const REFERENCE_COLUMNS = 'id, title, description, client_name, client_website, project_url, image_url, technologies, category, is_featured, order_index, is_active, created_at, updated_at';

export async function getAllReferences(activeOnly = true): Promise<Reference[]> {
  const query = activeOnly
    ? `SELECT ${REFERENCE_COLUMNS} FROM site_references WHERE is_active = true ORDER BY order_index ASC, created_at DESC`
    : `SELECT ${REFERENCE_COLUMNS} FROM site_references ORDER BY order_index ASC, created_at DESC`;
  const result = await pool.query(query);
  return result.rows;
}

export async function createReference(data: {
  title: string;
  description?: string | null;
  client_name?: string | null;
  client_website?: string | null;
  project_url?: string | null;
  image_url?: string | null;
  technologies?: string[];
  category?: string;
  is_featured?: boolean;
  order_index?: number;
  is_active?: boolean;
}): Promise<Reference> {
  const result = await pool.query(
    `INSERT INTO site_references (title, description, client_name, client_website, project_url, image_url, technologies, category, is_featured, order_index, is_active)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNINg *`,
    [
      data.title,
      data.description ?? null,
      data.client_name ?? null,
      data.client_website ?? null,
      data.project_url ?? null,
      data.image_url ?? null,
      data.technologies ?? [],
      data.category ?? 'web',
      data.is_featured ?? false,
      data.order_index ?? 0,
      data.is_active ?? true
    ]
  );
  return result.rows[0];
}

export async function updateReference(id: number, data: Partial<{
  title: string;
  description: string | null;
  client_name: string | null;
  client_website: string | null;
  project_url: string | null;
  image_url: string | null;
  technologies: string[];
  category: string;
  is_featured: boolean;
  order_index: number;
  is_active: boolean;
}>): Promise<Reference | null> {
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (data.title !== undefined) { fields.push(`title = $${idx++}`); values.push(data.title); }
  if (data.description !== undefined) { fields.push(`description = $${idx++}`); values.push(data.description); }
  if (data.client_name !== undefined) { fields.push(`client_name = $${idx++}`); values.push(data.client_name); }
  if (data.client_website !== undefined) { fields.push(`client_website = $${idx++}`); values.push(data.client_website); }
  if (data.project_url !== undefined) { fields.push(`project_url = $${idx++}`); values.push(data.project_url); }
  if (data.image_url !== undefined) { fields.push(`image_url = $${idx++}`); values.push(data.image_url); }
  if (data.technologies !== undefined) { fields.push(`technologies = $${idx++}`); values.push(data.technologies); }
  if (data.category !== undefined) { fields.push(`category = $${idx++}`); values.push(data.category); }
  if (data.is_featured !== undefined) { fields.push(`is_featured = $${idx++}`); values.push(data.is_featured); }
  if (data.order_index !== undefined) { fields.push(`order_index = $${idx++}`); values.push(data.order_index); }
  if (data.is_active !== undefined) { fields.push(`is_active = $${idx++}`); values.push(data.is_active); }

  if (fields.length === 0) {
    const result = await pool.query(`SELECT ${REFERENCE_COLUMNS} FROM site_references WHERE id = $1`, [id]);
    return result.rows[0] || null;
  }

  fields.push(`updated_at = NOW()`);
  values.push(id);

  const result = await pool.query(
    `UPDATE site_references SET ${fields.join(', ')} WHERE id = $${idx} RETURNINg *`,
    values
  );
  return result.rows[0] || null;
}

export async function deleteReference(id: number): Promise<boolean> {
  const result = await pool.query('DELETE FROM site_references WHERE id = $1 RETURNINg id', [id]);
  return result.rows.length > 0;
}

export async function toggleReferenceActive(id: number): Promise<boolean> {
  const result = await pool.query(
    'UPDATE site_references SET is_active = NOT is_active WHERE id = $1 RETURNINg is_active',
    [id]
  );
  return result.rows[0]?.is_active || false;
}
