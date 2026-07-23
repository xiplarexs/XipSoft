// ── Ülke Engelleme ───────────────────────────────────────────────────────────
// Cloudflare/Vercel header'larından ülke kodu oku, engellenmis ülkeleri kontrol et

import { NextRequest, NextResponse } from "next/server";
import { isCountryBlocked } from "@/lib/security/country-blocklist";
import { STATIC_FILE_PATTERN } from "./constants";

export async function handleCountryBlock(request: NextRequest): Promise<NextResponse | null> {
  const countryCode = request.headers.get("cf-ipcountry") || request.headers.get("x-vercel-ip-country");

  if (!countryCode) return null;

  const isBlocked = await isCountryBlocked(countryCode);
  if (!isBlocked) return null;

  const pathname = request.nextUrl.pathname;
  if (STATIC_FILE_PATTERN.test(pathname)) return null;

  return new NextResponse(
    `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Erisim Engellendi</title>
  <style>
    body { background: #0c0f17; color: #f3f4f6; font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    .card { text-align: center; max-width: 450px; padding: 2.5rem; background: #1e293b; border-radius: 1.5rem; border: 1px solid #334155; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3); }
    h1 { color: #ef4444; font-size: 2.5rem; margin: 0 0 1rem; font-weight: 800; }
    p { font-size: 1rem; color: #9ca3af; line-height: 1.6; margin: 0; }
  </style>
</head>
<body>
  <div class="card">
    <h1>403</h1>
    <p>Bulundugunuz ülke (${countryCode.toUpperCase()}) üzerinden bu web sitesine erisim güvenlik gerekçesiyle sınırlandırılmıstır.</p>
  </div>
</body>
</html>`,
    { status: 403, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}
