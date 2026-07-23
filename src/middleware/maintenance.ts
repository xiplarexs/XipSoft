// ── Bakım Modu ────────────────────────────────────────────────────────────────
// MAINTENANCE_MODE=true iken /maintenance dısındaki tüm sayfalar yönlendirilir

import { NextRequest, NextResponse } from "next/server";
import { STATIC_FILE_PATTERN_FULL } from "./constants";

export function handleMaintenance(request: NextRequest): NextResponse | null {
  if (process.env.MAINTENANCE_MODE !== "true") return null;

  const pathname = request.nextUrl.pathname;

  const bypass =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname === "/maintenance" ||
    STATIC_FILE_PATTERN_FULL.test(pathname);

  if (bypass) return null;

  return NextResponse.redirect(new URL("/maintenance", request.url));
}
