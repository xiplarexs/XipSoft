// ── Middleware Sabitleri ──────────────────────────────────────────────────────
// Tüm middleware modülleri tarafından kullanılan sabitler

// API Whitelist — Sadece bu route'lar aktif
export const ALLOWED_API_ROUTES = [
  "/api/bot",
  "/api/track",
  "/api/telegram",
  "/api/telegram-webhook",
  "/api/teklif",
  "/api/admin/ip-blocklist",
  "/api/admin/country-blocklist",
  "/api/admin/telegram-webhook-setup",
  "/api/admin/seo",
  "/api/admin/security-logs",
  "/api/admin/media",
  "/api/admin/automation",
  "/api/admin/cache",
  "/api/image-optimize",
  "/api/internal/security-log",
  "/api/health",
  "/api/internal/db-keepalive",
  "/api/blog",
  "/api/services",
];

// DDoS koruması
export const DDOS_THRESHOLD = 200;
export const SLOWLORIS_TIMEOUT = 10000;
export const AUTO_BLOCK_THRESHOLD = 300;
export const REPEAT_ATTACKER_MULTIPLIER = 0.7;

// Bot/DDoS user-agent pattern'leri
export const BOT_PATTERNS =
  /sqlmap|nikto|nmap|masscan|zgrab|nuclei|dirbuster|gobuster|wfuzz|hydra|medusa|metasploit|nessus|openvas|burpsuite|acunetix|appscan|qualys|havij|joomscan|wpscan|rustbot|badbot/i;

// Sahte tarayıcı UA tespiti
export const FAKE_BROWSER_UA = /Chrome\/1[4-9]\d\.0\.0\.0|Firefox\/1[2-9]\d\.0/;

// Karanlık mod
export const TURKEY_COUNTRY_CODES = ["TR"];
export const ALLOWED_IPS_DARK_MODE = ["127.0.0.1", "::1"];

// Arama motoru botları — dark mode'dan muaf
export const SEARCH_ENgINE_UA =
  /googlebot|google-sitemaps|bingbot|yandexbot|duckduckbot|baiduspider|facebookexternalhit|twitterbot|linkedinbot|whatsapp|slackbot|lighthouse/i;

// googlebot IP whitelist
export const gOOgLEBOT_IP_RANgES = [
  /^66\.249\./,
  /^216\.73\./,
  /^64\.233\./,
  /^72\.14\./,
  /^209\.85\./,
  /^74\.125\./,
];

// IP block cache TTL
export const IP_BLOCK_CACHE_TTL = 5 * 60 * 1000;

// Statik dosya pattern'i
export const STATIC_FILE_PATTERN = /\.(ico|png|jpg|jpeg|webp|svg|woff2?|ttf|eot|css|js|txt|xml|json|gif|map)$/i;

// Statik dosya pattern (HTML hariç — middleware matcher için)
export const STATIC_FILE_PATTERN_FULL = /\.(ico|png|jpg|jpeg|webp|svg|woff2?|ttf|eot|css|js|txt|xml|json)$/i;
