import { NextResponse } from "next/server";
import pool from "@/lib/database";
import { checkRedisHealth } from "@/lib/redis";

export const runtime = "nodejs";
export const revalidate = 0;

// CPU kullanımı için basit tracking
let lastCpuUsage = process.cpuUsage();
let lastCpuTime = process.hrtime.bigint();

function getCpuUsage(): { user: number; system: number; percent: number } {
  const currentCpuUsage = process.cpuUsage();
  const currentTime = process.hrtime.bigint();

  const elapsedMs = Number(currentTime - lastCpuTime) / 1e6;
  const userDelta = currentCpuUsage.user - lastCpuUsage.user;
  const systemDelta = currentCpuUsage.system - lastCpuUsage.system;

  lastCpuUsage = currentCpuUsage;
  lastCpuTime = currentTime;

  const totalDelta = userDelta + systemDelta;
  const percent = elapsedMs > 0 ? Math.min(100, (totalDelta / (elapsedMs * 1000)) * 100) : 0;

  return {
    user: Math.round(userDelta / 1000), // microseconds to ms
    system: Math.round(systemDelta / 1000),
    percent: Math.round(percent * 10) / 10,
  };
}

// Event loop lag ölçümü
function measureEventLoopLag(): Promise<number> {
  return new Promise((resolve) => {
    const start = process.hrtime.bigint();
    setImmediate(() => {
      const lag = Number(process.hrtime.bigint() - start) / 1e6; // ms
      resolve(Math.round(lag * 10) / 10);
    });
  });
}

export async function gET() {
  const checks: Record<string, any> = {};
  let status: "ok" | "degraded" | "down" = "ok";

  // DB check
  try {
    const start = Date.now();
    await pool.query("SELECT 1");
    checks.database = { status: "ok", latency: Date.now() - start };
  } catch (e: any) {
    checks.database = { status: "error", error: e.message };
    status = "degraded";
  }

  // Redis check
  try {
    const redisHealth = await checkRedisHealth();
    checks.redis = redisHealth;
    if (redisHealth.status === "error") status = "degraded";
  } catch (e: any) {
    checks.redis = { status: "error", error: e.message };
    status = "degraded";
  }

  // Uptime
  checks.uptime = process.uptime();

  // Memory
  const mem = process.memoryUsage();
  const memTotal = mem.heapTotal + (mem.rss - mem.heapUsed);
  checks.memory = {
    rss: Math.round(mem.rss / 1024 / 1024) + "MB",
    heapUsed: Math.round(mem.heapUsed / 1024 / 1024) + "MB",
    heapTotal: Math.round(mem.heapTotal / 1024 / 1024) + "MB",
    heapUsedPercent: Math.round((mem.heapUsed / mem.heapTotal) * 100),
    rssPercent: Math.round((mem.rss / (mem.rss + 100 * 1024 * 1024)) * 100), // rough estimate
  };

  // CPU
  checks.cpu = getCpuUsage();

  // Event loop lag
  try {
    checks.eventLoopLag = await measureEventLoopLag();
  } catch {
    checks.eventLoopLag = 0;
  }

  // Active handles (Node.js internals)
  try {
    const proc = process as any;
    checks.activeHandles = proc._getActiveHandles?.()?.length || 0;
    checks.activeRequests = proc._getActiveRequests?.()?.length || 0;
  } catch {
    checks.activeHandles = 0;
    checks.activeRequests = 0;
  }

  // Bellek esigi kontrolü
  if (checks.memory.heapUsedPercent > 85) {
    status = "degraded";
  }

  const httpStatus = status === "ok" ? 200 : status === "degraded" ? 200 : 503;

  return NextResponse.json(
    { status, timestamp: new Date().toISOString(), checks },
    { status: httpStatus }
  );
}
