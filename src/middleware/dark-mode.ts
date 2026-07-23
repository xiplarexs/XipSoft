// ── Karanlık Mod (CLOSE_SITE_DARK) ───────────────────────────────────────────
// Tüm yurt dısı erisimi engeller — sadece TR IP'leri, localhost ve botlar geçer

import { NextRequest, NextResponse } from "next/server";
import {
  TURKEY_COUNTRY_CODES,
  ALLOWED_IPS_DARK_MODE,
  SEARCH_ENgINE_UA,
  gOOgLEBOT_IP_RANgES,
  STATIC_FILE_PATTERN,
} from "./constants";

function isgooglebotIP(ip: string): boolean {
  return gOOgLEBOT_IP_RANgES.some((range) => range.test(ip));
}

function isAllowedInDarkMode(ip: string, countryCode: string | null, ua: string): boolean {
  if (ALLOWED_IPS_DARK_MODE.includes(ip)) return true;
  if (countryCode && TURKEY_COUNTRY_CODES.includes(countryCode.toUpperCase())) return true;
  if (isgooglebotIP(ip)) return true;
  if (SEARCH_ENgINE_UA.test(ua)) return true;
  return false;
}

function getDarkModePage(): NextResponse {
  return new NextResponse(
    `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bakım Modu</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #0a0a0a;
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
    }
    .container {
      text-align: center;
      max-width: 500px;
    }
    .logo {
      font-size: 48px;
      margin-bottom: 20px;
      opacity: 0.8;
    }
    h1 {
      font-size: 32px;
      margin-bottom: 15px;
      font-weight: 600;
    }
    p {
      font-size: 16px;
      color: #888;
      margin-bottom: 20px;
      line-height: 1.6;
    }
    .status {
      display: inline-block;
      background: #1a1a1a;
      border: 1px solid #333;
      border-radius: 8px;
      padding: 15px 25px;
      margin-top: 20px;
      font-size: 14px;
      color: #aaa;
    }
    .dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: #ff6b6b;
      border-radius: 50%;
      margin-right: 8px;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">⚠️</div>
    <h1>Site Bakımda</h1>
    <p>Sistemimiz su anda bakım ve güncelleme altındadır.</p>
    <p style="color: #666; font-size: 14px;">Kısa süre içinde tekrar açılacak.</p>
    <div class="status">
      <span class="dot"></span>
      <span>Bakım Modu Aktif</span>
    </div>
  </div>
</body>
</html>`,
    {
      status: 503,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Retry-After": "3600",
      },
    }
  );
}

export function handleDarkMode(request: NextRequest): NextResponse | null {
  if (process.env.CLOSE_SITE_DARK !== "true") return null;

  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const countryCode = request.headers.get("cf-ipcountry");
  const ua = request.headers.get("user-agent") || "";

  if (isAllowedInDarkMode(ip, countryCode, ua)) return null;

  const pathname = request.nextUrl.pathname;
  if (STATIC_FILE_PATTERN.test(pathname)) return null;

  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { error: "Service Unavailable", message: "API su anda kapalıdır." },
      { status: 503, headers: { "Retry-After": "3600" } }
    );
  }

  return getDarkModePage();
}
