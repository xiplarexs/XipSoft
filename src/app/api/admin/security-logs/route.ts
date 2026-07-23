import { NextRequest, NextResponse } from "next/server";
import { extractAuthContext } from "@/lib/api-guard";
import pool from "@/lib/database";

export const runtime = "nodejs";

/**
 * gET /api/admin/security-logs
 * güvenlik loglarını listeler (admin erisimi gerekli).
 * Query params:
 *   - page (default: 1)
 *   - limit (default: 50, max: 200)
 *   - severity (low|medium|high|critical)
 *   - event_type
 *   - ip_address
 *   - days (son kaç gün, default: 7)
 */
export async function gET(req: NextRequest) {
  const ctx = await extractAuthContext(req);
  if (!ctx.isAuthenticated || ctx.userRole !== "admin") {
    return NextResponse.json({ ok: false, error: "Yetkisiz erisim" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(200, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));
  const severity = searchParams.get("severity");
  const eventType = searchParams.get("event_type");
  const ipAddress = searchParams.get("ip_address");
  const days = Math.min(90, Math.max(1, parseInt(searchParams.get("days") || "7", 10)));

  const offset = (page - 1) * limit;
  const conditions: string[] = ["created_at > NOW() - ($1 || ' days')::interval"];
  const params: any[] = [days];
  let paramIndex = 2;

  if (severity) {
    conditions.push(`severity = $${paramIndex}`);
    params.push(severity);
    paramIndex++;
  }
  if (eventType) {
    conditions.push(`event_type = $${paramIndex}`);
    params.push(eventType);
    paramIndex++;
  }
  if (ipAddress) {
    conditions.push(`ip_address = $${paramIndex}`);
    params.push(ipAddress);
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  try {
    const [dataRes, countRes] = await Promise.all([
      pool.query(
        `SELECT id, event_type, ip_address, user_agent, endpoint, payload, severity, is_blocked, blocked_until, created_at
         FROM security_logs
         ${whereClause}
         ORDER BY created_at DESC
         LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
        [...params, limit, offset]
      ),
      pool.query(
        `SELECT COUNT(*) as total FROM security_logs ${whereClause}`,
        params
      ),
    ]);

    const total = parseInt(countRes.rows[0]?.total || "0", 10);

    return NextResponse.json({
      ok: true,
      logs: dataRes.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/security-logs
 * Eski logları temizler (admin erisimi gerekli).
 * Query params:
 *   - days (kaç günden eski logları sil, default: 30)
 */
export async function DELETE(req: NextRequest) {
  const ctx = await extractAuthContext(req);
  if (!ctx.isAuthenticated || ctx.userRole !== "admin") {
    return NextResponse.json({ ok: false, error: "Yetkisiz erisim" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const days = Math.max(7, parseInt(searchParams.get("days") || "30", 10));

  try {
    const result = await pool.query(
      `DELETE FROM security_logs WHERE created_at < NOW() - ($1 || ' days')::interval`,
      [days]
    );
    return NextResponse.json({
      ok: true,
      deleted: result.rowCount,
      message: `${days} günden eski loglar silindi`,
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
