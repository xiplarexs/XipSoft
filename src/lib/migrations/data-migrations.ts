import type { PoolClient } from "pg";

export async function runMigrations(client: PoolClient): Promise<void> {
  // No active migrations
}
