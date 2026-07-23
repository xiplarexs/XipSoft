import { query, queryOne } from "./db-utils";

export interface Visitor {
  id: number;
  ip_address: string;
  path: string;
  user_agent?: string;
  referrer?: string;
  device_type?: string;
  cookie_info?: string;
  created_at: string;
}

export async function addVisitor(
  ip_address: string,
  path: string,
  user_agent?: string,
  referrer?: string
): Promise<{ ok: boolean }> {
  return await queryOne<{ ok: boolean }>(
    `INSERT INTO site_visitors (ip_address, page_url, user_agent, referrer) VALUES ($1, $2, $3, $4)`,
    [ip_address, path, user_agent || null, referrer || null]
  ).then(() => ({ ok: true })).catch(() => ({ ok: false }));
}

export async function addVisitorAsync(
  ip_address: string,
  path: string,
  user_agent?: string,
  referrer?: string
): Promise<void> {
  queryOne(
    `INSERT INTO site_visitors (ip_address, page_url, user_agent, referrer) VALUES ($1, $2, $3, $4)`,
    [ip_address, path, user_agent || null, referrer || null]
  ).catch((err) => {
    console.error("[Visitor] Insert error (background):", err);
  });
}

export async function addVisitorsBatch(
  visitors: Array<{ ip_address: string; path: string; user_agent?: string; referrer?: string; device_type?: string; cookie_info?: string }>
): Promise<number> {
  if (!visitors.length) return 0;

  const placeholders = visitors.map((_, i) => {
    const b = i * 5;
    return `($${b+1}, $${b+2}, $${b+3}, $${b+4}, $${b+5})`;
  }).join(", ");

  const params = visitors.flatMap((v) => [
    v.ip_address,
    v.path,
    v.user_agent || null,
    v.referrer || null,
    v.device_type || null
  ]);

  await queryOne(
    `INSERT INTO site_visitors (ip_address, page_url, user_agent, referrer, device_type) VALUES ${placeholders}`,
    params
  ).catch((err) => {
    console.error("[Visitor] Batch insert error:", err);
  });

  return visitors.length;
}

export async function getVisitors(
  limit: number = 100,
  offset: number = 0
): Promise<Visitor[]> {
  return await query<Visitor>(
    `SELECT id, ip_address, page_url as path, user_agent, referrer, device_type, created_at FROM site_visitors ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
}

export async function getVisitorCountByPath(): Promise<Array<{ path: string; count: number }>> {
  return await query<{ path: string; count: number }>(
    `SELECT page_url as path, COUNT(*) as count FROM site_visitors gROUP BY page_url ORDER BY count DESC`
  );
}

export async function getVisitorCountByIP(): Promise<Array<{ ip_address: string; count: number; last_visit: string }>> {
  return await query<{ ip_address: string; count: number; last_visit: string }>(
    `SELECT ip_address, COUNT(*) as count, MAX(created_at) as last_visit FROM site_visitors gROUP BY ip_address ORDER BY count DESC LIMIT 100`
  );
}

export async function getDailyVisitorStats(): Promise<Array<{ date: string; count: number }>> {
  return await query<{ date: string; count: number }>(
    `SELECT DATE(created_at) as date, COUNT(*) as count FROM site_visitors gROUP BY DATE(created_at) ORDER BY date DESC LIMIT 30`
  );
}

export async function getTotalVisitorCount(): Promise<number> {
  const result = await queryOne<{ count: string }>(`SELECT COUNT(*) as count FROM site_visitors`);
  return parseInt(result?.count || "0", 10);
}

export async function getUniqueVisitorCount(): Promise<number> {
  const result = await queryOne<{ count: string }>(`SELECT COUNT(DISTINCT ip_address) as count FROM site_visitors`);
  return parseInt(result?.count || "0", 10);
}

export async function getTopReferrers(): Promise<Array<{ referrer: string; count: number }>> {
  return await query<{ referrer: string; count: number }>(
    `SELECT referrer, COUNT(*) as count FROM site_visitors WHERE referrer IS NOT NULL AND referrer != '' gROUP BY referrer ORDER BY count DESC LIMIT 20`
  );
}

export async function cleanupOldVisitors(): Promise<number> {
  try {
    const result = await import("@/lib/database").then(({ default: pool }) =>
      pool.query(
        `DELETE FROM site_visitors WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '3 days'`
      )
    );
    return result.rowCount ?? 0;
  } catch {
    return 0;
  }
}
