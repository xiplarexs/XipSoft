// ── Istek Sayacı ──────────────────────────────────────────────────────────────
// Her IP için 60 saniyelik pencerede kaç istek geldigini izler

const requestCountStore = new Map<string, { count: number; resetTime: number; firstSeen: number }>();

// Cleanup — her 5 dakikada bir expired entry'leri temizle
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of requestCountStore.entries()) {
    if (now > value.resetTime) {
      requestCountStore.delete(key);
    }
  }
}, 5 * 60 * 1000).unref();

export function trackRequest(
  ip: string,
  pathname: string
): { count: number; elapsed: number } {
  const now = Date.now();
  const WINDOW = 60_000;
  const key = `reqcount:${ip}`;
  let entry = requestCountStore.get(key);

  if (!entry || now > entry.resetTime) {
    entry = { count: 0, resetTime: now + WINDOW, firstSeen: now };
    requestCountStore.set(key, entry);
  }

  entry.count++;
  const elapsed = Math.round((now - entry.firstSeen) / 1000);

  if (process.env.NODE_ENV !== "production") {
    console.log(`[REQ] ip=${ip} count=${entry.count} path=${pathname} elapsed=${elapsed}s`);
  }

  return { count: entry.count, elapsed };
}
