import pool from "@/lib/database";

let cachedBlockedCountries: Set<string> | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 dakika

/**
 * Önbellegi temizler (yeni bir ülke engellendiginde veya engel kaldırıldıgında çagrılır).
 */
function invalidateCountryBlockCache(): void {
  cachedBlockedCountries = null;
  cacheTimestamp = 0;
}

/**
 * Engellenmis tüm ülkelerin kodlarını Set olarak döner (ve önbellege alır).
 */
export async function getBlockedCountries(): Promise<Set<string>> {
  const now = Date.now();
  if (cachedBlockedCountries && now - cacheTimestamp < CACHE_TTL) {
    return cachedBlockedCountries;
  }

  try {
    const result = await pool.query<{ country_code: string }>(
      "SELECT country_code FROM country_blocklist"
    );
    const codes = new Set(result.rows.map((row) => row.country_code.toUpperCase()));
    cachedBlockedCountries = codes;
    cacheTimestamp = now;
    return codes;
  } catch (err) {
    console.error("[CountryBlocklist] Veritabanından engelli ülkeler çekilemedi:", err);
    return cachedBlockedCountries || new Set();
  }
}

/**
 * Belirli bir ülke kodunun engelli olup olmadıgını kontrol eder.
 */
export async function isCountryBlocked(countryCode: string | null | undefined): Promise<boolean> {
  if (!countryCode) return false;
  const blockedSet = await getBlockedCountries();
  return blockedSet.has(countryCode.toUpperCase());
}

/**
 * Bir ülkeyi engeller.
 */
export async function blockCountry(countryCode: string, reason?: string): Promise<void> {
  const cleanCode = countryCode.toUpperCase().trim();
  if (cleanCode.length !== 2) {
    throw new Error("Ülke kodu 2 karakterden olusmalıdır (örn: TR, US).");
  }

  await pool.query(
    `INSERT INTO country_blocklist (country_code, reason)
     VALUES ($1, $2)
     ON CONFLICT (country_code) DO UPDATE
       SET reason = EXCLUDED.reason`,
    [cleanCode, reason?.trim() || "Admin tarafından engellendi"]
  );
  invalidateCountryBlockCache();
}

/**
 * Bir ülkenin engelini kaldırır.
 */
export async function unblockCountry(countryCode: string): Promise<void> {
  const cleanCode = countryCode.toUpperCase().trim();
  await pool.query(
    "DELETE FROM country_blocklist WHERE country_code = $1",
    [cleanCode]
  );
  invalidateCountryBlockCache();
}
