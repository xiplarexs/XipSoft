/**
 * Database — dual pool, load balanced + failover
 * Primary: Neon (DATABASE_URL)
 * Secondary: Supabase (DATABASE_URL_SECONDARY)
 */

import { Pool, PoolClient } from "pg";

// ── Pool ─────────────────────────────────────────────────────────────────────

interface PoolHealth {
  healthy: boolean;
  consecutiveFailures: number;
  totalQueries: number;
  failedQueries: number;
  avgLatency: number;
}

class DBPool {
  pool: Pool;
  name: string;
  health: PoolHealth = {
    healthy: true, consecutiveFailures: 0,
    totalQueries: 0, failedQueries: 0, avgLatency: 0,
  };

  constructor(connectionString: string, name: string) {
    this.name = name;
    const ssl = process.env.DATABASE_SSL === 'false'
      ? false
      : { rejectUnauthorized: process.env.NODE_ENV === 'production' };

    this.pool = new Pool({
      connectionString,
      // PERF: Neon serverless için optimize edildi.
      // max:5 çok düsüktü — concurrent request'lerde pool tükeniyor, sıra bekleniyor.
      // Neon free plan: 25 concurrent connection, production plan: 100+
      max: 10,
      min: 1,              // en az 1 baglantıyı hazır tut — cold start latency azalır
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 3000, // 2000 → 3000: zaman zaman timeout hatası vardı
      statement_timeout: 8000,
      ssl: ssl as any,
      application_name: `xipsoft-${name}`,
      keepAlive: true,
      keepAliveInitialDelayMillis: 10000,
    });
    this.pool.on("error", (err) => {
      console.error(`[DB:${name}] Pool error:`, err.message);
      this.health.healthy = false;
    });
    this.pool.on("connect", () => {
      this.health.healthy = true;
      this.health.consecutiveFailures = 0;
    });
  }

  updateStats(latency: number, success: boolean) {
    this.health.totalQueries++;
    if (success) {
      this.health.consecutiveFailures = 0;
      this.health.healthy = true;
      this.health.avgLatency = this.health.avgLatency === 0
        ? latency : (this.health.avgLatency * 0.9) + (latency * 0.1);
    } else {
      this.health.failedQueries++;
      this.health.consecutiveFailures++;
      if (this.health.consecutiveFailures === 3) {
        // Log only once when first marked unhealthy
        this.health.healthy = false;
        console.error(`[DB:${this.name}] Marked unhealthy after ${this.health.consecutiveFailures} failures`);
      } else if (this.health.consecutiveFailures > 3) {
        // Already unhealthy — update silently
        this.health.healthy = false;
      }
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const t = Date.now();
      await this.pool.query('SELECT 1');
      // Startup probe — directly mark healthy without going through updateStats
      this.health.healthy = true;
      this.health.consecutiveFailures = 0;
      this.health.avgLatency = Date.now() - t;
      return true;
    } catch {
      // Startup probe failed — mark unhealthy silently (no console.error spam)
      this.health.healthy = false;
      this.health.consecutiveFailures = 3; // skip the 1-2 failure window
      return false;
    }
  }

  getStats() {
    return {
      name: this.name,
      healthy: this.health.healthy,
      total: this.pool.totalCount,
      idle: this.pool.idleCount,
      waiting: this.pool.waitingCount,
      avgLatency: `${this.health.avgLatency.toFixed(1)}ms`,
      totalQueries: this.health.totalQueries,
      failedQueries: this.health.failedQueries,
    };
  }
}

class MockPool {
  name: string;
  pool: this;
  health: PoolHealth = {
    healthy: false,
    consecutiveFailures: 0,
    totalQueries: 0,
    failedQueries: 0,
    avgLatency: 0,
  };

  constructor(name: string) {
    this.name = name;
    this.pool = this;
  }

  updateStats(latency: number, success: boolean) {
    this.health.totalQueries++;
    if (success) {
      this.health.consecutiveFailures = 0;
      this.health.healthy = true;
      this.health.avgLatency = this.health.avgLatency === 0
        ? latency : (this.health.avgLatency * 0.9) + (latency * 0.1);
    } else {
      this.health.failedQueries++;
      if (++this.health.consecutiveFailures >= 3) {
        this.health.healthy = false;
      }
    }
  }

  async query(_query: any, _params?: any) {
    this.updateStats(0, true);
    return { rows: [], rowCount: 0, command: 'SELECT' };
  }

  async connect() {
    return {
      release: () => undefined,
      query: this.query.bind(this),
      on: () => undefined,
    } as any;
  }

  async end() {
    return;
  }

  getStats() {
    return {
      name: this.name,
      healthy: this.health.healthy,
      total: 0,
      idle: 0,
      waiting: 0,
      avgLatency: `${this.health.avgLatency.toFixed(1)}ms`,
      totalQueries: this.health.totalQueries,
      failedQueries: this.health.failedQueries,
    };
  }
}

// ── Init ─────────────────────────────────────────────────────────────────────

let primary: DBPool | MockPool;
let secondary: DBPool | null = null;
let initialized = false;
let initError: Error | null = null;
let healthInterval: NodeJS.Timeout | null = null;
let readCounter = 0;
let _primaryConnectedLogged = false; // ✅ Connected sadece bir kez bassın

const initPromise = (async () => {
  try {
    const url = process.env.DATABASE_URL;
    if (!url) {
      primary = new MockPool('primary');
      initError = new Error('DATABASE_URL is not set; using mock database fallback');
      console.warn('[DB:primary] DATABASE_URL is not set — using mock DB fallback');
    } else {
      primary = new DBPool(url, 'primary');
      const ok = await primary.testConnection();
      if (!ok) {
        initError = new Error('Primary DB connection failed health check');
        console.warn('[DB:primary] ⚠️ No database connection on startup — running without DB');
      } else {
        if (!_primaryConnectedLogged) {
          console.log('[DB:primary] ✅ Connected');
          _primaryConnectedLogged = true;
        }
      }

      const url2 = process.env.DATABASE_URL_SECONDARY;
      if (url2) {
        secondary = new DBPool(url2, 'secondary');
        const ok2 = await secondary.testConnection();
        if (ok2) {
          console.log('[DB:secondary] ✅ Connected');
        } else {
          console.warn('[DB:secondary] ⚠️ Unhealthy on startup, will retry');
        }
      }

      healthInterval = setInterval(async () => {
        for (const db of [primary, secondary].filter(Boolean) as DBPool[]) {
          const t = Date.now();
          try {
            await db.pool.query('SELECT 1');
            const wasUnhealthy = !db.health.healthy;
            db.health.healthy = true;
            db.health.consecutiveFailures = 0;
            db.health.avgLatency = (db.health.avgLatency * 0.9) + ((Date.now() - t) * 0.1);
            // Sadece unhealthy → healthy geçisinde log bas (spam önle)
            if (wasUnhealthy) console.log(`[DB:${db.name}] ✅ Recovered`);
          } catch (err: any) {
            const wasHealthy = db.health.healthy;
            db.health.healthy = false;
            if (wasHealthy) console.warn(`[DB:${db.name}] ⚠️ Health check failed:`, err.message);
          }
        }
      }, 30000);
      healthInterval.unref();
    }
  } catch (err) {
    initError = err instanceof Error ? err : new Error(String(err));
    console.error('[DB] ❌ Init failed:', initError.message);
  } finally {
    initialized = true;
  }
})();

// ── Router ───────────────────────────────────────────────────────────────────

function isDBPool(pool: DBPool | MockPool): pool is DBPool {
  return pool instanceof DBPool;
}

function getReadPool(): DBPool | MockPool {
  const pools = [primary, secondary].filter((p): p is DBPool => !!p && p.health.healthy);
  if (pools.length === 0) return primary;
  const idx = readCounter++ % pools.length;
  return pools[idx] ?? primary;
}

function getWritePool(): DBPool | MockPool {
  return primary;
}

function isWriteQuery(sql: string): boolean {
  const normalized = sql.trim().toUpperCase();
  return /^(INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|TRUNCATE|gRANT|REVOKE|BEgIN|COMMIT|ROLLBACK)/.test(normalized);
}

// ── Proxy (default export — drop-in replacement) ──────────────────────────────

const pool = new Proxy({} as Pool, {
  get(_t, prop) {
    return async (...args: any[]) => {
      if (!initialized) await initPromise;
      if (!primary) throw new Error('[DB] Not initialized');

      if (prop === 'query') {
        const sql = typeof args[0] === 'string' ? args[0] : args[0]?.text ?? '';
        const target = isWriteQuery(sql) ? getWritePool() : getReadPool();

        // Mock DB (DATABASE_URL yok): bos dön — gerçek pool'da "unhealthy" olsa bile sorguyu dene;
        // aksi halde geçici kesinti sonrası tüm SELECT'ler sessizce bos kalır ve UI "içerik yok" gösterir.
        if (!primary.health.healthy && !isDBPool(primary)) {
          return { rows: [], rowCount: 0, command: 'SELECT' };
        }

        const t = Date.now();
        try {
          const result = await target.pool.query(args[0], args[1]);
          target.updateStats(Date.now() - t, true);
          return result;
        } catch (err) {
          target.updateStats(Date.now() - t, false);
          if (target !== primary) {
            console.warn(`[DB:${target.name}] Read failed, falling back to primary`);
            // Only fallback if primary is healthy
            if (primary.health.healthy) {
              try {
                const result = await primary.pool.query(args[0], args[1]);
                primary.updateStats(Date.now() - t, true);
                return result;
              } catch (err2) {
                primary.updateStats(Date.now() - t, false);
                throw err2;
              }
            }
          }
          throw err;
        }
      }

      if (prop === 'connect') {
        return getWritePool().pool.connect();
      }

      const method = (getWritePool().pool as any)[prop];
      if (typeof method === 'function') return method.apply(getWritePool().pool, args);
      throw new Error(`[DB] Method ${String(prop)} not available`);
    };
  },
});

export default pool;
