import { headers } from "next/headers";

/**
 * Cloudflare Turnstile dogrulaması.
 * TURNSTILE_SECRET_KEY env varsa token zorunludur.
 * Basarısız veya eksik token durumunda hata mesajı döner, null ise basarılı.
 */
export async function verifyTurnstile(captchaToken?: string): Promise<string | null> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) return null;

  if (!captchaToken) {
    return 'Robot dogrulaması gerekli. Lütfen sayfayı yenileyip tekrar deneyin.';
  }

  try {
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for')?.split(',')[0] || '';
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', captchaToken);
    if (ip) formData.append('remoteip', ip);

    const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });
    const turnstileData = await turnstileRes.json();
    if (!turnstileData.success) {
      console.warn('[Auth] Turnstile verification failed:', turnstileData['error-codes']);
      return 'Robot dogrulaması basarısız. Lütfen tekrar deneyin.';
    }
    return null;
  } catch (err) {
    console.error('[Auth] Turnstile request error:', err);
    return 'Dogrulama servisi erisilemedi, lütfen tekrar deneyin.';
  }
}
