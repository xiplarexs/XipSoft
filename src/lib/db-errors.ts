import { query, queryOne } from "./db-utils";

export interface ErrorLog {
  id: number;
  error_type: string;
  error_message: string;
  error_stack?: string;
  endpoint?: string;
  http_method?: string;
  status_code?: number;
  user_agent?: string;
  ip_address?: string;
  user_id?: number;
  environment?: string;
  request_body?: any;
  response_body?: any;
  resolved: boolean;
  created_at: string;
  updated_at: string;
}

export interface ErrorStats {
  total_errors: number;
  unresolved_errors: number;
  today_errors: number;
  top_error_types: Array<{ error_type: string; count: number }>;
  top_endpoints: Array<{ endpoint: string; count: number }>;
  top_status_codes: Array<{ status_code: number; count: number }>;
}

/**
 * Hata kaydı olustur
 */
export async function logError(
  error_type: string,
  error_message: string,
  data: {
    error_stack?: string;
    endpoint?: string;
    http_method?: string;
    status_code?: number;
    user_agent?: string;
    ip_address?: string;
    user_id?: number;
    environment?: string;
    request_body?: any;
    response_body?: any;
  }
): Promise<ErrorLog | null> {
  return await queryOne<ErrorLog>(
    `INSERT INTO error_logs 
     (error_type, error_message, error_stack, endpoint, http_method, status_code, 
      user_agent, ip_address, user_id, environment, request_body, response_body, resolved)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, false)
     RETURNINg *`,
    [
      error_type,
      error_message,
      data.error_stack || null,
      data.endpoint || null,
      data.http_method || null,
      data.status_code || null,
      data.user_agent || null,
      data.ip_address || null,
      data.user_id || null,
      data.environment || process.env.NODE_ENV || 'development',
      data.request_body ? JSON.stringify(data.request_body) : null,
      data.response_body ? JSON.stringify(data.response_body) : null,
    ]
  );
}

const ERROR_COLUMNS = 'id, error_type, error_message, error_stack, endpoint, http_method, status_code, user_agent, ip_address, user_id, environment, request_body, response_body, resolved, created_at, updated_at';

/**
 * Tum hataları getir (pagination + filter)
 */
export async function getErrors(
  limit: number = 50,
  offset: number = 0,
  filters?: {
    error_type?: string;
    endpoint?: string;
    resolved?: boolean;
    status_code?: number;
  }
): Promise<ErrorLog[]> {
  let whereClause = "WHERE 1=1";
  const params: any[] = [];

  if (filters?.error_type) {
    whereClause += ` AND error_type = $${params.length + 1}`;
    params.push(filters.error_type);
  }
  if (filters?.endpoint) {
    whereClause += ` AND endpoint ILIKE $${params.length + 1}`;
    params.push(`%${filters.endpoint}%`);
  }
  if (filters?.resolved !== undefined) {
    whereClause += ` AND resolved = $${params.length + 1}`;
    params.push(filters.resolved);
  }
  if (filters?.status_code) {
    whereClause += ` AND status_code = $${params.length + 1}`;
    params.push(filters.status_code);
  }

  params.push(limit);
  params.push(offset);

  return await query<ErrorLog>(
    `SELECT ${ERROR_COLUMNS} FROM error_logs 
     ${whereClause}
     ORDER BY created_at DESC 
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );
}

/**
 * Hata detayını getir
 */
export async function getErrorDetail(id: number): Promise<ErrorLog | null> {
  return await queryOne<ErrorLog>(
    `SELECT ${ERROR_COLUMNS} FROM error_logs WHERE id = $1`,
    [id]
  );
}

/**
 * Endpoint'e göre hataları getir
 */
export async function getErrorsByEndpoint(
  endpoint: string,
  limit: number = 20
): Promise<ErrorLog[]> {
  return await query<ErrorLog>(
    `SELECT ${ERROR_COLUMNS} FROM error_logs 
     WHERE endpoint ILIKE $1
     ORDER BY created_at DESC 
     LIMIT $2`,
    [`%${endpoint}%`, limit]
  );
}

/**
 * Hata istatistiklerini getir
 */
export async function getErrorStats(): Promise<ErrorStats> {
  try {
    const [
      totalResult,
      unresolvedResult,
      todayResult,
      typeResult,
      endpointResult,
      statusResult,
    ] = await Promise.all([
      queryOne<{ count: string }>(
        `SELECT COUNT(*) as count FROM error_logs`
      ).catch(() => null),
      queryOne<{ count: string }>(
        `SELECT COUNT(*) as count FROM error_logs WHERE resolved = false`
      ).catch(() => null),
      queryOne<{ count: string }>(
        `SELECT COUNT(*) as count FROM error_logs WHERE DATE(created_at) = CURRENT_DATE`
      ).catch(() => null),
      query<{ error_type: string; count: string }>(
        `SELECT error_type, COUNT(*) as count 
         FROM error_logs 
         gROUP BY error_type 
         ORDER BY count DESC 
         LIMIT 5`
      ).catch(() => []),
      query<{ endpoint: string; count: string }>(
        `SELECT endpoint, COUNT(*) as count 
         FROM error_logs 
         WHERE endpoint IS NOT NULL
         gROUP BY endpoint 
         ORDER BY count DESC 
         LIMIT 5`
      ).catch(() => []),
      query<{ status_code: number; count: string }>(
        `SELECT status_code, COUNT(*) as count 
         FROM error_logs 
         WHERE status_code IS NOT NULL
         gROUP BY status_code 
         ORDER BY count DESC 
         LIMIT 5`
      ).catch(() => []),
    ]);

    return {
      total_errors: parseInt(totalResult?.count || "0", 10),
      unresolved_errors: parseInt(unresolvedResult?.count || "0", 10),
      today_errors: parseInt(todayResult?.count || "0", 10),
      top_error_types: (typeResult || []).map((r) => ({
        error_type: r.error_type,
        count: parseInt(r.count, 10),
      })),
      top_endpoints: (endpointResult || []).map((r) => ({
        endpoint: r.endpoint,
        count: parseInt(r.count, 10),
      })),
      top_status_codes: (statusResult || []).map((r) => ({
        status_code: r.status_code,
        count: parseInt(r.count, 10),
      })),
    };
  } catch (error) {
    console.error("[getErrorStats] Fatal error:", error);
    // Return empty stats on fatal error
    return {
      total_errors: 0,
      unresolved_errors: 0,
      today_errors: 0,
      top_error_types: [],
      top_endpoints: [],
      top_status_codes: [],
    };
  }
}

/**
 * Hatayı çöz isaretleyin
 */
export async function resolveError(id: number): Promise<ErrorLog | null> {
  return await queryOne<ErrorLog>(
    `UPDATE error_logs 
     SET resolved = true, updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNINg *`,
    [id]
  );
}

/**
 * Hatayı sil
 */
export async function deleteError(id: number): Promise<void> {
  await query(`DELETE FROM error_logs WHERE id = $1`, [id]);
}

/**
 * Eski hataları temizle (7 gunden eskiler)
 */
export async function cleanupOldErrors(): Promise<number> {
  const rows = await query<{ id: number }>(
    `DELETE FROM error_logs
     WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '7 days'
     RETURNINg id`
  );
  return rows.length;
}

/**
 * Çözulen hataları temizle
 */
export async function deleteResolvedErrors(): Promise<number> {
  const rows = await query<{ id: number }>(
    `DELETE FROM error_logs
     WHERE resolved = true AND created_at < CURRENT_TIMESTAMP - INTERVAL '1 day'
     RETURNINg id`
  );
  return rows.length;
}
