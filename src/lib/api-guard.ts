/**
 * API Request guard - Authentication & Authorization
 * Tum API routes'ta kullan
 */

import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { getJwtSecret } from '@/lib/auth-config';

// getJwtSecret → @/lib/auth-config'den geliyor (tek kaynak)

/**
 * Timing-safe string karsılastırması — timing attack'a karsı koruma
 * crypto.timingSafeEqual kullanır, her iki string'i aynı uzunluga pad'ler
 */
function timingSafeEqual(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const bufA = encoder.encode(a);
  const bufB = encoder.encode(b);

  // Farklı uzunlukta olsa bile sabit zamanlı karsılastırma yap
  // (uzunluk farkını sızdırmamak için her ikisini de max uzunluga pad'le)
  const maxLen = Math.max(bufA.length, bufB.length);
  const paddedA = new Uint8Array(maxLen);
  const paddedB = new Uint8Array(maxLen);
  paddedA.set(bufA);
  paddedB.set(bufB);

  let result = 0;
  for (let i = 0; i < maxLen; i++) {
    result |= (paddedA[i] ?? 0) ^ (paddedB[i] ?? 0);
  }
  // Uzunluk farkı varsa da false döndür
  return result === 0 && bufA.length === bufB.length;
}


// JWT_SECRET → @/lib/auth-config'den geliyor (tek kaynak)

export interface AuthContext {
  userId: string | null;
  userRole: 'admin' | 'moderator' | 'user' | 'guest';
  userEmail: string | null;
  isAuthenticated: boolean;
}

/**
 * Request'ten auth context'i çıkar
 */
export async function extractAuthContext(request: NextRequest): Promise<AuthContext> {
  const sessionCookie = request.cookies.get('xipsoft_session')?.value;

  if (!sessionCookie) {
    return {
      userId: null,
      userRole: 'guest',
      userEmail: null,
      isAuthenticated: false,
    };
  }

  try {
    const { payload: user } = await jwtVerify(sessionCookie, getJwtSecret());
    return {
      userId: String(user.id ?? user.userId ?? ''),
      userRole: (user.role as AuthContext['userRole']) || 'user',
      userEmail: String(user.email ?? ''),
      isAuthenticated: true,
    };
  } catch (error) {
    return {
      userId: null,
      userRole: 'guest',
      userEmail: null,
      isAuthenticated: false,
    };
  }
}

/**
 * Server Action'lar için auth context'i çıkar
 */
export async function getServerActionContext(): Promise<AuthContext> {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  
  const sessionToken = cookieStore.get('xipsoft_session')?.value;

  if (!sessionToken) {
    return {
      userId: null,
      userRole: 'guest',
      userEmail: null,
      isAuthenticated: false,
    };
  }

  try {
    const { payload: user } = await jwtVerify(sessionToken, getJwtSecret());
    return {
      userId: String(user.id ?? user.userId ?? ''),
      userRole: (user.role as AuthContext['userRole']) || 'user',
      userEmail: String(user.email ?? ''),
      isAuthenticated: true,
    };
  } catch (error) {
    return {
      userId: null,
      userRole: 'guest',
      userEmail: null,
      isAuthenticated: false,
    };
  }
}

/**
 * Authentication zorunlu yap (login gerekli)
 */
export function requireAuth(context: AuthContext): { ok: true } | NextResponse {
  if (!context.isAuthenticated) {
    return NextResponse.json(
      {
        error: 'Unauthorized',
        message: 'Kimlik dogrulama gerekli',
        code: 'UNAUTHENTICATED',
      },
      { status: 401 }
    );
  }
  return { ok: true };
}

/**
 * Admin role zorunlu yap
 */
export function requireAdmin(context: AuthContext): { ok: true } | NextResponse {
  if (context.userRole !== 'admin') {
    return NextResponse.json(
      { error: 'Forbidden', message: 'Admin erisimi gerekli', code: 'INSUFFICIENT_PERMISSIONS' },
      { status: 403 }
    );
  }

  return { ok: true };
}

/**
 * Safe error response (info leak'i önle)
 */
export function safeErrorResponse(error: unknown, context: AuthContext) {
  console.error('[API Error]', error);

  // Admin'lere detaylı hata göster
  if (context.userRole === 'admin') {
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Bilinmeyen hata',
        ...(process.env.NODE_ENV === 'development' && {
          stack: error instanceof Error ? error.stack : undefined,
        }),
      },
      { status: 500 }
    );
  }

  // Diger kullanıcılara generic hata
  return NextResponse.json(
    {
      error: 'Internal Server Error',
      message: 'Bir hata meydana geldi. Lutfen daha sonra tekrar deneyin.',
    },
    { status: 500 }
  );
}
