// ── Middleware — Thin Wrapper ──────────────────────────────────────────────────
// Tüm mantık src/middleware/ modüllerine bölünmüstür.
// Bu dosya sadece Next.js'in bekledigi export'ları saglar.

import { default as middlewareHandler } from "./src/middleware";

export default middlewareHandler;

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?|ttf|eot|css|js|map)$).*)",
  ],
};

export { invalidateIpBlockCache } from "./src/middleware/ip-blocklist";
