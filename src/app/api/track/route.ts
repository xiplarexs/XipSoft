import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/database';

export const runtime = 'nodejs';

/** User-Agent'tan tarayıcı adını tespit eder */
function detectBrowser(ua: string): string {
  if (/Edg\//i.test(ua))          return 'Edge';
  if (/OPR\//i.test(ua))          return 'Opera';
  if (/Chrome\//i.test(ua))       return 'Chrome';
  if (/Firefox\//i.test(ua))      return 'Firefox';
  if (/Safari\//i.test(ua))       return 'Safari';
  if (/MSIE|Trident/i.test(ua))   return 'IE';
  if (/bot|crawler|spider/i.test(ua)) return 'Bot';
  return 'Other';
}

/** User-Agent'tan cihaz tipini tespit eder */
function detectDevice(ua: string): string {
  if (/tablet|ipad/i.test(ua))                          return 'Tablet';
  if (/mobile|iphone|ipod|android.*mobile/i.test(ua))  return 'Mobile';
  return 'Desktop';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, page_url, referrer } = body;

    if (type !== 'pageview') {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    // Cloudflare → proxy → dogrudan sırasıyla IP al (görev 3.3)
    const ip =
      req.headers.get('cf-connecting-ip') ||
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown';

    const ua = req.headers.get('user-agent') || '';

    // Ülke: Cloudflare header'dan al
    const country = req.headers.get('cf-ipcountry') ||
                    req.headers.get('x-vercel-ip-country') ||
                    null;

    // Tarayıcı ve cihaz tespiti (görev 2.1)
    const browser     = detectBrowser(ua);
    const device_type = detectDevice(ua);

    pool.query(
      `INSERT INTO site_visitors
         (ip_address, page_url, user_agent, referrer, country, browser, device_type, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
      [ip, page_url || '/', ua || null, referrer || null, country, browser, device_type]
    ).catch(() => {});

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
