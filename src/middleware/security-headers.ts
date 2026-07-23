// ── güvenlik Header'ları ──────────────────────────────────────────────────────
// CSP, Cache-Control, CORS, Security headers, geo-location

import { NextRequest, NextResponse } from "next/server";

// ── güvenlik Header'ları ────────────────────────────────────────────────────
export function setSecurityHeaders(response: NextResponse, pathname: string): void {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  // UTF-8 encoding: sadece HTML sayfalarına uygula
  const isHtmlRequest = !pathname.match(/\.(js|css|woff2?|ttf|eot|svg|png|jpg|jpeg|webp|gif|ico|json|txt|xml|map)$/i);
  if (isHtmlRequest && !pathname.startsWith("/api/")) {
    response.headers.set("Content-Type", "text/html; charset=utf-8");
  }

  // HSTS
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
}

// ── CSP (Content Security Policy) ───────────────────────────────────────────
export function setCspHeaders(response: NextResponse): string {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' 'nonce-${nonce}' https://www.googletagmanager.com https://www.google-analytics.com https://js.hcaptcha.com https://*.hcaptcha.com https://mc.yandex.ru https://pagead2.googlesyndication.com https://partner.googleadservices.com https://static.cloudflareinsights.com https://challenges.cloudflare.com https://googleads.g.doubleclick.net https://fundingchoicesmessages.google.com https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google https://*.adtrafficquality.google`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://api.indexnow.org https://hcaptcha.com https://*.hcaptcha.com https://mc.yandex.ru https://vitals.vercel-insights.com https://*.sentry.io https://cloudflareinsights.com https://challenges.cloudflare.com https://googleads.g.doubleclick.net https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google https://*.adtrafficquality.google https://pagead2.googlesyndication.com https://fundingchoicesmessages.google.com",
    "frame-src https://hcaptcha.com https://*.hcaptcha.com https://www.google.com https://pagead2.googlesyndication.com https://challenges.cloudflare.com https://googleads.g.doubleclick.net https://*.doubleclick.net https://tpc.googlesyndication.com https://fundingchoicesmessages.google.com https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google https://*.adtrafficquality.google",
    "media-src 'self' blob:",
    "worker-src 'self' blob:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
    "report-uri /api/security/csp-report",
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("x-nonce", nonce);

  return nonce;
}

// ── Cache Headers ───────────────────────────────────────────────────────────
export function setCacheHeaders(response: NextResponse, pathname: string): void {
  if (pathname.match(/\.(js|css|woff2|woff|ttf|eot)$/)) {
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  } else if (pathname.startsWith("/api/")) {
    response.headers.set("Cache-Control", "private, no-cache, no-store, must-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  } else if (pathname === "/" || pathname === "/contact-us" || pathname === "/blog") {
    response.headers.set("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
  } else {
    response.headers.set("Cache-Control", "public, max-age=3600");
  }
}

// ── CORS (Production Only) ──────────────────────────────────────────────────
export function setCorsHeaders(response: NextResponse, request: NextRequest): void {
  if (process.env.NODE_ENV !== "production") return;

  const allowedOrigins = ["https://xipsoft.net", "https://www.xipsoft.net"];
  const origin = request.headers.get("origin") || "";

  if (allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set("Access-Control-Allow-Methods", "gET, POST, PUT, DELETE, OPTIONS");
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-CSRF-Token, X-Bot-Key"
    );
  }
}

// ── geo-Location & Request ID ──────────────────────────────────────────────
export function setgeoHeaders(
  response: NextResponse,
  request: NextRequest,
  reqCount?: number,
  reqElapsed?: number
): void {
  const country = request.headers.get("x-vercel-ip-country") || "TR";
  const city = request.headers.get("x-vercel-ip-city") || "Unknown";
  response.headers.set("x-user-country", country);
  response.headers.set("x-user-city", city);

  const requestId = request.headers.get("x-request-id") || crypto.randomUUID();
  response.headers.set("x-request-id", requestId);

  if (process.env.NODE_ENV !== "production" && reqCount !== undefined && reqElapsed !== undefined) {
    response.headers.set("x-request-count", String(reqCount));
    response.headers.set("x-request-elapsed", `${reqElapsed}s`);
  }
}
