// ── Middleware Ana Modülü ──────────────────────────────────────────────────────
// Tüm middleware modüllerini orkestra eder
// Sorumluluklar ayrı modüllere bölünmüstür, burada sadece sıralama var

import { NextRequest, NextResponse } from "next/server";
import { handleCountryBlock } from "./country-block";
import { handleDarkMode } from "./dark-mode";
import { handleMaintenance } from "./maintenance";
import { handleRedirects } from "./redirects";
import { handleSecretPath, handleAdminAuth } from "./admin-access";
import { handleIpBlocklist } from "./ip-blocklist";
import { trackRequest } from "./request-tracker";
import { handleBotDetection, handleDdosProtection } from "./bot-detection";
import { handleApiRateLimit } from "./api-rate-limit";
import {
  setSecurityHeaders,
  setCspHeaders,
  setCacheHeaders,
  setCorsHeaders,
  setgeoHeaders,
} from "./security-headers";

// pg (PostgreSQL) Edge runtime'da çalısmaz — Node.js runtime zorunlu
export const runtime = "nodejs";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Ülke Engelleme ─────────────────────────────────────────────────────
  const countryBlock = await handleCountryBlock(request);
  if (countryBlock) return countryBlock;

  // ── 2. Karanlık Mod ──────────────────────────────────────────────────────
  const darkMode = handleDarkMode(request);
  if (darkMode) return darkMode;

  // ── 3. Bakım Modu ────────────────────────────────────────────────────────
  const maintenance = handleMaintenance(request);
  if (maintenance) return maintenance;

  // ── 4. URL Redirects ─────────────────────────────────────────────────────
  const redirect = handleRedirects(request);
  if (redirect) return redirect;

  // ── 5. Secret Path ───────────────────────────────────────────────────────
  const secretPath = handleSecretPath(request);
  if (secretPath) return secretPath;

  // ── 6. IP Blocklist ──────────────────────────────────────────────────────
  const ipResult = await handleIpBlocklist(request);
  if (ipResult.blocked) {
    return new NextResponse("Forbidden", { status: 403 });
  }
  const { ip } = ipResult;

  // ── 7. Istek Sayacı ─────────────────────────────────────────────────────
  const { count: reqCount, elapsed: reqElapsed } = trackRequest(ip, pathname);

  // ── 8. Bot/DDoS Tespiti ─────────────────────────────────────────────────
  const ua = request.headers.get("user-agent") || "";
  const botBlock = handleBotDetection(request, ip, ua);
  if (botBlock) return botBlock;

  // ── 9. DDoS Koruması ────────────────────────────────────────────────────
  const ddosBlock = handleDdosProtection(ip);
  if (ddosBlock) return ddosBlock;

  // ── 10. API Rate Limiting ────────────────────────────────────────────────
  const rateLimit = await handleApiRateLimit(request, ip, ua);
  if (rateLimit) return rateLimit;

  // ── 11. Response Olustur ─────────────────────────────────────────────────
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // ── 12. Admin Auth ───────────────────────────────────────────────────────
  const adminAuth = await handleAdminAuth(request, response);
  // Admin auth redirect/json döndürdüyse direkt dön
  if (adminAuth.headers.get("location") || adminAuth.status === 401 || adminAuth.status === 403) {
    return adminAuth;
  }

  // ── 13. Header'ları Ayarla ──────────────────────────────────────────────
  setSecurityHeaders(response, pathname);
  setCspHeaders(response);
  setCacheHeaders(response, pathname);
  setCorsHeaders(response, request);
  setgeoHeaders(response, request, reqCount, reqElapsed);

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?|ttf|eot|css|js|map)$).*)",
  ],
};
