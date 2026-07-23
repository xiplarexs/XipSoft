// ── Admin Erisim Kontrolü ─────────────────────────────────────────────────────
// Secret path cookie set etme + JWT session + 2FA kontrolü

import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getJwtSecret } from "@/lib/auth-config";

// ── Secret Path Cookie Set ──────────────────────────────────────────────────
export function handleSecretPath(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;
  const secretPath = process.env.ADMIN_SECRET_PATH;

  if (!secretPath) {
    if (pathname === "/admin" || pathname.startsWith("/admin/")) {
      if (pathname === "/admin/login") return NextResponse.next();
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return null;
  }

  // Secret path ayarlı — sadece secret path itself'e müdahale et
  // /admin/login'e erisim admin-auth tarafından yönetilir
  if (pathname !== `/${secretPath}` && !pathname.startsWith(`/${secretPath}/`)) return null;

  const redirectTo = pathname.replace(`/${secretPath}`, "/admin") || "/admin";
  const res = NextResponse.redirect(new URL(redirectTo, request.url));
  res.cookies.set("xipsoft_admin_access", "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 8,
    path: "/",
  });
  return res;
}

// ── Admin Auth Kontrolü (JWT + 2FA) ────────────────────────────────────────
export async function handleAdminAuth(
  request: NextRequest,
  response: NextResponse
): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminApi = pathname === "/api/admin" || pathname.startsWith("/api/admin/");

  if (!isAdminRoute && !isAdminApi) return response;

  // Path Obfuscation — erisim cookie'si kontrolü
  // /admin/login ve /admin/verify-2fa access cookie'siz erisilebilir
  const adminAccessCookie = request.cookies.get("xipsoft_admin_access")?.value;
  if (!adminAccessCookie) {
    if (isAdminApi) {
      return NextResponse.json({ error: "Unauthorized", message: "Erisim cookie'si bulunamadı" }, { status: 401 });
    }
    const isPublicAdminPage = pathname === "/admin/login" || pathname === "/admin/verify-2fa";
    if (isPublicAdminPage) return response;
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Session kontrolü
  const session = request.cookies.get("xipsoft_session");
  if (!session) {
    if (isAdminApi) {
      return NextResponse.json({ error: "Unauthorized", message: "Oturum bulunamadı" }, { status: 401 });
    }
    const isPublicAdminPage = pathname === "/admin/login" || pathname === "/admin/verify-2fa";
    if (isPublicAdminPage) return response;
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    const { payload: user } = await jwtVerify(session.value, getJwtSecret());

    if (user.role !== "admin") {
      if (isAdminApi) {
        return NextResponse.json({ error: "Forbidden", message: "Admin erisimi gerekli" }, { status: 403 });
      }
      const isPublicAdminPage = pathname === "/admin/login" || pathname === "/admin/verify-2fa";
      if (isPublicAdminPage) return response;
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // 2FA Kontrolü
    const is2faVerified = request.cookies.get("xipsoft_2fa_verified")?.value === "1";
    const is2faPage = pathname === "/admin/verify-2fa" || pathname.startsWith("/admin/verify-2fa/");

    if (!is2faVerified && !is2faPage && !isAdminApi) {
      return NextResponse.redirect(new URL("/admin/verify-2fa", request.url));
    }

    response.headers.set("x-user-id", String(user.id ?? user.userId ?? ""));
    response.headers.set("x-user-role", String(user.role ?? ""));
    response.headers.set("x-user-email", String(user.email ?? ""));
  } catch {
    if (isAdminApi) {
      return NextResponse.json({ error: "Invalid session", message: "geçersiz oturum" }, { status: 401 });
    }
    const isPublicAdminPage = pathname === "/admin/login" || pathname === "/admin/verify-2fa";
    if (isPublicAdminPage) return response;
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return response;
}
