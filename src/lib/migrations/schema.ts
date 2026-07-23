import type { PoolClient } from "pg";

export async function runSchema(client: PoolClient): Promise<void> {
  await client.query(`
    CREATE EXTENSION IF NOT EXISTS pgcrypto;
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS csrf_tokens (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      token uuid NOT NULL UNIQUE,
      user_id uuid NULL,
      ip_address text NOT NULL DEFAULT 'unknown',
      user_agent text NOT NULL DEFAULT 'unknown',
      expires_at timestamptz NOT NULL,
      is_used boolean NOT NULL DEFAULT false,
      used_at timestamptz NULL,
      created_at timestamptz NOT NULL DEFAULT NOW()
    );
  `);

  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_csrf_tokens_expires_at ON csrf_tokens (expires_at);
  `);

  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_csrf_tokens_is_used ON csrf_tokens (is_used);
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS country_blocklist (
      id SERIAL PRIMARY KEY,
      country_code VARCHAR(2) NOT NULL UNIQUE,
      reason TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}
