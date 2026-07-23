/**
 * Redis — Upstash (primary) ile çalısır.
 * UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN env yoksa no-op stub'a düser.
 */

import { Redis } from '@upstash/redis';

interface SessionData {
  id: string;
  uid?: string;
  email: string;
  display_name: string;
  role: 'user' | 'moderator' | 'admin';
  photo_url?: string;
  rank_id?: number;
  reputation?: number;
  message_count?: number;
}

// TTL constants (seconds)
const TTL = {
  SESSION: 60 * 30, // 30 dakika
} as const;

// ─── Client ──────────────────────────────────────────────────────────────────

let _client: Redis | null = null;

function getClient(): Redis | null {
  if (_client) return _client;
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    _client = new Redis({ url, token });
    return _client;
  } catch {
    return null;
  }
}

/** @deprecated use getClient() internally */
export function getRedisClient() { return getClient(); }

// ─── Health ──────────────────────────────────────────────────────────────────

export async function checkRedisHealth() {
  const client = getClient();
  if (!client) return { status: 'disabled', connected: false };
  try {
    await client.ping();
    return { status: 'ok', connected: true };
  } catch {
    return { status: 'error', connected: false };
  }
}

// ─── Session ─────────────────────────────────────────────────────────────────

export async function setSession(uid: string, data: SessionData, ttl = TTL.SESSION): Promise<boolean> {
  const client = getClient();
  if (!client) return false;
  try {
    await client.set(`session:${uid}`, JSON.stringify(data), { ex: ttl });
    return true;
  } catch { return false; }
}
