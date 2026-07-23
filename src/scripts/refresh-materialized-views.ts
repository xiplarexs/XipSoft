import pool from "@/lib/database";
import { runMaterializedViews } from "@/lib/migrations/materialized-views";

async function refreshMaterializedViews() {
  console.log("🔄 Materialized view yenileme baslatılıyor...");

  const client = await pool.connect();

  try {
    await runMaterializedViews(client);
    console.log("✅ Materialized view yenileme tamamlandı.");
  } finally {
    client.release();
  }
}

refreshMaterializedViews().catch((error) => {
  console.error("❌ Materialized view yenileme basarısız:", error);
  process.exit(1);
});
