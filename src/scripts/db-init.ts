import pool from "@/lib/database";
import { runSchema } from "@/lib/migrations/schema";
import { runMaterializedViews } from "@/lib/migrations/materialized-views";

async function initDatabase() {
  console.log("🚀 Veritabanı baslangıç kurulumu baslatılıyor...");

  const client = await pool.connect();

  try {
    await runSchema(client);
    await runMaterializedViews(client);
    console.log("✅ Veritabanı baslangıç kurulumu tamamlandı.");
  } finally {
    client.release();
  }
}

initDatabase().catch((error) => {
  console.error("❌ Veritabanı kurulumu basarısız:", error);
  process.exit(1);
});
