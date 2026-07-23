// ── URL Redirects ─────────────────────────────────────────────────────────────
// WWW canonical, forum, WordPress, blog query string redirect'leri

import { NextRequest, NextResponse } from "next/server";

// ── WWW → NON-WWW CANONICAL REDIRECT (301) ──────────────────────────────────
function handleWwwRedirect(request: NextRequest): NextResponse | null {
  const host = request.headers.get("host") || "";
  if (!host.startsWith("www.")) return null;

  const url = request.nextUrl.clone();
  url.host = host.slice(4);
  return NextResponse.redirect(url, { status: 301 });
}

// ── .html.html DOUBLE EXTENSION FIX (301) ───────────────────────────────────
function handleDoubleExtension(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;
  if (!pathname.endsWith(".html.html")) return null;

  const url = request.nextUrl.clone();
  url.pathname = pathname.slice(0, -5);
  return NextResponse.redirect(url, { status: 301 });
}

// ── FORUM → BLOg REDIRECT (301) ─────────────────────────────────────────────
function handleForumRedirect(request: NextRequest): NextResponse | null {
  if (!request.nextUrl.pathname.startsWith("/forum/")) return null;
  return NextResponse.redirect(new URL("/blog", request.url), { status: 301 });
}

// ── ESKI WORDPRESS URL'LERI — 301 Redirect ─────────────────────────────────
function handleWordPressRedirect(request: NextRequest): NextResponse | null {
  const { searchParams } = request.nextUrl;
  const hasWpParam =
    searchParams.has("p") ||
    searchParams.has("page_id") ||
    searchParams.has("feed") ||
    searchParams.has("cat") ||
    searchParams.has("tag") ||
    searchParams.has("author");

  if (!hasWpParam) return null;
  return NextResponse.redirect(new URL("/", request.url), { status: 301 });
}

// ── BLOg POST QUERY STRINg → PATH-BASED (301) ──────────────────────────────
function handleBlogPostRedirect(request: NextRequest): NextResponse | null {
  const { pathname, searchParams } = request.nextUrl;
  if (pathname !== "/blog/post" || !searchParams.has("slug")) return null;

  const raw = searchParams.get("slug") || "";
  const slug = String(raw).trim();

  if (!slug || slug.toLowerCase() === "undefined") {
    return NextResponse.redirect(new URL("/blog", request.url), { status: 301 });
  }

  const safeSlug = slug.replace(/[^a-z0-9-]/gi, "").toLowerCase();
  if (!safeSlug) return NextResponse.redirect(new URL("/blog", request.url), { status: 301 });

  return NextResponse.redirect(new URL(`/blog/${safeSlug}`, request.url), { status: 301 });
}

// ── TÜM REDIRECT'LERI UYgULA ────────────────────────────────────────────────
export function handleRedirects(request: NextRequest): NextResponse | null {
  return (
    handleWwwRedirect(request) ||
    handleDoubleExtension(request) ||
    handleForumRedirect(request) ||
    handleWordPressRedirect(request) ||
    handleBlogPostRedirect(request)
  );
}
