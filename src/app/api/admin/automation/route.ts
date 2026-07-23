/**
 * Automation Scheduler API
 *
 * Zamanlanmıs isleri yönetir ve çalıstırır.
 * Vercel Cron Jobs veya harici tetikleyici ile çagrılır.
 */

import { NextRequest, NextResponse } from "next/server";
import { extractAuthContext } from "@/lib/api-guard";
import pool from "@/lib/database";
import { sendTelegramMessage, escapeHtml } from "@/lib/telegram";
import { SITE_URL } from "@/lib/site-url";

export const runtime = "nodejs";

interface ScheduledJob {
  name: string;
  status: "success" | "error" | "skipped";
  message: string;
  duration: number;
}

// ── Yardımcı Fonksiyonlar ──────────────────────────────────────────────────

async function jobHealthCheck(): Promise<ScheduledJob> {
  const start = Date.now();
  try {
    const res = await fetch(`${SITE_URL}/api/health`, { signal: AbortSignal.timeout(10000) });
    const data = await res.json();
    return {
      name: "health_check",
      status: data.status === "ok" ? "success" : "error",
      message: `Sistem durumu: ${data.status}`,
      duration: Date.now() - start,
    };
  } catch (e: any) {
    return { name: "health_check", status: "error", message: e.message, duration: Date.now() - start };
  }
}

async function jobCleanupOldVisitors(): Promise<ScheduledJob> {
  const start = Date.now();
  try {
    const result = await pool.query(
      "DELETE FROM site_visitors WHERE created_at < NOW() - INTERVAL '90 days'"
    );
    return {
      name: "cleanup_visitors",
      status: "success",
      message: `${result.rowCount} eski ziyaretçi kaydı silindi`,
      duration: Date.now() - start,
    };
  } catch (e: any) {
    return { name: "cleanup_visitors", status: "error", message: e.message, duration: Date.now() - start };
  }
}

async function jobCleanupOldSecurityLogs(): Promise<ScheduledJob> {
  const start = Date.now();
  try {
    const result = await pool.query(
      "DELETE FROM security_logs WHERE created_at < NOW() - INTERVAL '30 days'"
    );
    return {
      name: "cleanup_security_logs",
      status: "success",
      message: `${result.rowCount} eski güvenlik logu silindi`,
      duration: Date.now() - start,
    };
  } catch (e: any) {
    return { name: "cleanup_security_logs", status: "error", message: e.message, duration: Date.now() - start };
  }
}

async function jobCleanupExpiredIpBlocks(): Promise<ScheduledJob> {
  const start = Date.now();
  try {
    const result = await pool.query(
      "DELETE FROM ip_blocklist WHERE is_permanent = false AND expires_at < NOW()"
    );
    return {
      name: "cleanup_expired_blocks",
      status: "success",
      message: `${result.rowCount} süresi dolmus IP engeli temizlendi`,
      duration: Date.now() - start,
    };
  } catch (e: any) {
    return { name: "cleanup_expired_blocks", status: "error", message: e.message, duration: Date.now() - start };
  }
}

async function jobCleanupOldCsrfTokens(): Promise<ScheduledJob> {
  const start = Date.now();
  try {
    const result = await pool.query(
      "DELETE FROM csrf_tokens WHERE expires_at < NOW()"
    );
    return {
      name: "cleanup_csrf_tokens",
      status: "success",
      message: `${result.rowCount} süresi dolmus CSRF token silindi`,
      duration: Date.now() - start,
    };
  } catch (e: any) {
    return { name: "cleanup_csrf_tokens", status: "error", message: e.message, duration: Date.now() - start };
  }
}

async function jobDailyStats(): Promise<ScheduledJob> {
  const start = Date.now();
  try {
    const [visitors, posts, errors, blockedIps] = await Promise.all([
      pool.query("SELECT COUNT(*) as c FROM site_visitors WHERE created_at > NOW() - INTERVAL '24 hours'"),
      pool.query("SELECT COUNT(*) as c FROM blog_posts WHERE status = 'published' AND deleted_at IS NULL"),
      pool.query("SELECT COUNT(*) as c FROM error_logs WHERE created_at > NOW() - INTERVAL '24 hours'"),
      pool.query("SELECT COUNT(*) as c FROM ip_blocklist WHERE is_permanent = true OR expires_at > NOW()"),
    ]);

    const text = [
      `📊 <b>günlük Rapor — ${new Date().toLocaleDateString("tr-TR")}</b>`,
      ``,
      `👥 Son 24s ziyaretçi: ${visitors.rows[0]?.c || 0}`,
      `📝 Yayındaki blog: ${posts.rows[0]?.c || 0}`,
      `⚠️ Son 24s hata: ${errors.rows[0]?.c || 0}`,
      `🚫 Engelli IP: ${blockedIps.rows[0]?.c || 0}`,
    ].join("\n");

    const ADMIN_CHAT_ID = process.env.TELEgRAM_ADMIN_CHAT_ID;
    if (ADMIN_CHAT_ID) {
      await sendTelegramMessage(ADMIN_CHAT_ID, text);
    }

    return {
      name: "daily_stats",
      status: "success",
      message: "günlük rapor gönderildi",
      duration: Date.now() - start,
    };
  } catch (e: any) {
    return { name: "daily_stats", status: "error", message: e.message, duration: Date.now() - start };
  }
}

// ── Is Tanımları ──────────────────────────────────────────────────────────

const ALL_JOBS = {
  health_check: jobHealthCheck,
  cleanup_visitors: jobCleanupOldVisitors,
  cleanup_security_logs: jobCleanupOldSecurityLogs,
  cleanup_expired_blocks: jobCleanupExpiredIpBlocks,
  cleanup_csrf_tokens: jobCleanupOldCsrfTokens,
  daily_stats: jobDailyStats,
};

type JobName = keyof typeof ALL_JOBS;

/**
 * gET /api/admin/automation — Durum bilgisi
 */
export async function gET(req: NextRequest) {
  const ctx = await extractAuthContext(req);
  if (!ctx.isAuthenticated || ctx.userRole !== "admin") {
    return NextResponse.json({ ok: false, error: "Yetkisiz erisim" }, { status: 403 });
  }

  return NextResponse.json({
    ok: true,
    jobs: Object.keys(ALL_JOBS),
    schedule: {
      health_check: "Her istekte (otomatik)",
      cleanup_visitors: "Haftalık (Pazartesi 03:00)",
      cleanup_security_logs: "Haftalık (Pazartesi 03:00)",
      cleanup_expired_blocks: "günlük (03:00)",
      cleanup_csrf_tokens: "günlük (03:00)",
      daily_stats: "günlük (09:00)",
    },
  });
}

/**
 * POST /api/admin/automation — Is çalıstır
 * Body: { job?: string } — belirli bir isi çalıstır veya tümünü
 */
export async function POST(req: NextRequest) {
  const ctx = await extractAuthContext(req);
  if (!ctx.isAuthenticated || ctx.userRole !== "admin") {
    return NextResponse.json({ ok: false, error: "Yetkisiz erisim" }, { status: 403 });
  }

  let body: { job?: string } = {};
  try { body = await req.json(); } catch {}

  const jobName = body.job as JobName | undefined;

  if (jobName && !(jobName in ALL_JOBS)) {
    return NextResponse.json({ ok: false, error: `Bilinmeyen is: ${jobName}` }, { status: 400 });
  }

  const jobsToRun = jobName ? [jobName] : (Object.keys(ALL_JOBS) as JobName[]);
  const results: ScheduledJob[] = [];

  for (const name of jobsToRun) {
    const result = await ALL_JOBS[name]();
    results.push(result);
  }

  return NextResponse.json({ ok: true, results });
}
