import { NextRequest, NextResponse } from "next/server";
import { sendTelegramMessage, escapeHtml } from "@/lib/telegram";
import pool from "@/lib/database";
import { blockIp } from "@/lib/security-logger";
import { blockCountry, unblockCountry, getBlockedCountries } from "@/lib/security/country-blocklist";

export const runtime = "nodejs";

const ADMIN_CHAT_ID = process.env.TELEgRAM_ADMIN_CHAT_ID;
const BOT_TOKEN = process.env.TELEgRAM_BOT_TOKEN;
const WEBHOOK_SECRET = process.env.TELEgRAM_WEBHOOK_SECRET;

// Update ID ile tekrar eden mesajları engelle
const processedUpdates = new Set<number>();
const MAX_PROCESSED_UPDATES = 1000;

async function reply(chatId: string, text: string) {
  return sendTelegramMessage(chatId, text);
}

async function handleCommand(chatId: string, cmd: string, args: string[]) {
  switch (cmd) {
    case "/start":
    case "/help":
      return reply(chatId, [
        "<b>🤖 XipSoft Bot</b>",
        "",
        "<b>Komutlar:</b>",
        "/status — Sistem durumu",
        "/visitors — Son 24 saat ziyaretçi",
        "/stats — genel istatistikler",
        "/block &lt;IP&gt; — IP engelle (24s)",
        "/unblock &lt;IP&gt; — IP engel kaldır",
        "/country +XX — Ülke engelle (ör: +RU)",
        "/country -XX — Ülke engelini kaldır",
        "/countrylist — Engellenmis ülkeler",
        "/whois &lt;IP&gt; — IP sorgulama",
        "/speed — Site hız durumu",
        "/blog — Son 5 blog yazısı",
        "/broadcast &lt;mesaj&gt; — Tüm kanala duyuru",
        "/help — Bu mesaj",
      ].join("\n"));

    case "/status": {
      try {
        const [visitorRes, blogRes, blockRes, countryRes] = await Promise.all([
          pool.query("SELECT COUNT(*) as c FROM site_visitors WHERE created_at > NOW() - INTERVAL '24 hours'"),
          pool.query("SELECT COUNT(*) as c FROM blog_posts WHERE status = 'published' AND deleted_at IS NULL"),
          pool.query("SELECT COUNT(*) as c FROM ip_blocklist WHERE is_permanent = true OR expires_at > NOW()"),
          pool.query("SELECT COUNT(*) as c FROM country_blocklist"),
        ]);
        const visitors = visitorRes.rows[0]?.c || 0;
        const posts = blogRes.rows[0]?.c || 0;
        const blockedIps = blockRes.rows[0]?.c || 0;
        const blockedCountries = countryRes.rows[0]?.c || 0;
        return reply(chatId, [
          "<b>📊 Sistem Durumu</b>",
          "",
          `👥 Son 24h: ${visitors} ziyaretçi`,
          `📝 Yayındaki blog: ${posts} yazı`,
          `🚫 Engelli IP: ${blockedIps}`,
          `🌍 Engelli ülke: ${blockedCountries}`,
          `✅ Sistem aktif`,
        ].join("\n"));
      } catch {
        return reply(chatId, "❌ Veritabanı hatası");
      }
    }

    case "/visitors": {
      try {
        const res = await pool.query(
          "SELECT ip_address, page_url, created_at FROM site_visitors WHERE created_at > NOW() - INTERVAL '24 hours' ORDER BY created_at DESC LIMIT 10"
        );
        const rows = res.rows.map((r: any) =>
          `• <code>${escapeHtml(r.ip_address)}</code> → ${escapeHtml(r.page_url || "/")} [${new Date(r.created_at).toLocaleTimeString("tr-TR")}]`
        ).join("\n");
        return reply(chatId, `<b>👥 Son 10 Ziyaretçi (24h)</b>\n\n${rows || "Kayıt yok"}`);
      } catch {
        return reply(chatId, "❌ Veritabanı hatası");
      }
    }

    case "/stats": {
      try {
        const [totalVisitors, todayVisitors, totalPosts, totalErrors, topPages] = await Promise.all([
          pool.query("SELECT COUNT(*) as c FROM site_visitors"),
          pool.query("SELECT COUNT(*) as c FROM site_visitors WHERE created_at > NOW() - INTERVAL '24 hours'"),
          pool.query("SELECT COUNT(*) as c FROM blog_posts WHERE status = 'published' AND deleted_at IS NULL"),
          pool.query("SELECT COUNT(*) as c FROM error_logs WHERE created_at > NOW() - INTERVAL '24 hours'"),
          pool.query("SELECT page_url, COUNT(*) as c FROM site_visitors WHERE created_at > NOW() - INTERVAL '7 days' gROUP BY page_url ORDER BY c DESC LIMIT 5"),
        ]);
        const topPagesList = topPages.rows.map((r: any, i: number) =>
          `${i + 1}. ${escapeHtml(r.page_url || "/")} (${r.c})`
        ).join("\n");
        return reply(chatId, [
          "<b>📈 genel Istatistikler</b>",
          "",
          `👥 Toplam ziyaretçi: ${totalVisitors.rows[0]?.c || 0}`,
          `📅 Bugünkü ziyaretçi: ${todayVisitors.rows[0]?.c || 0}`,
          `📝 Yayındaki blog: ${totalPosts.rows[0]?.c || 0}`,
          `⚠️ Son 24h hata: ${totalErrors.rows[0]?.c || 0}`,
          "",
          "<b>🔥 Popüler Sayfalar (7g)</b>",
          topPagesList || "Veri yok",
        ].join("\n"));
      } catch {
        return reply(chatId, "❌ Veritabanı hatası");
      }
    }

    case "/block": {
      const ip = args[0];
      if (!ip) return reply(chatId, "❌ Kullanım: /block <IP>\nÖrnek: /block 192.168.1.1");
      try {
        await blockIp(ip, "Telegram bot ile engellendi", {
          isPermanent: false,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });
        return reply(chatId, `✅ IP engellendi: <code>${escapeHtml(ip)}</code> (24 saat)`);
      } catch {
        return reply(chatId, "❌ IP engellenemedi");
      }
    }

    case "/unblock": {
      const ip = args[0];
      if (!ip) return reply(chatId, "❌ Kullanım: /unblock <IP>\nÖrnek: /unblock 192.168.1.1");
      try {
        await pool.query("DELETE FROM ip_blocklist WHERE ip_address = $1", [ip]);
        return reply(chatId, `✅ IP engeli kaldırıldı: <code>${escapeHtml(ip)}</code>`);
      } catch {
        return reply(chatId, "❌ Engelleme kaldırılamadı");
      }
    }

    case "/country": {
      const arg = args[0];
      if (!arg || !arg.startsWith("+") && !arg.startsWith("-")) {
        return reply(chatId, [
          "❌ Kullanım:",
          "/country +XX — Ülke engelle (ör: /country +RU)",
          "/country -XX — Ülke engelini kaldır (ör: /country -RU)",
        ].join("\n"));
      }
      const code = arg.slice(1).toUpperCase();
      if (code.length !== 2) return reply(chatId, "❌ Ülke kodu 2 karakter olmalı (ör: RU, CN)");

      try {
        if (arg.startsWith("+")) {
          await blockCountry(code, "Telegram bot ile engellendi");
          return reply(chatId, `✅ Ülke engellendi: <b>${escapeHtml(code)}</b>`);
        } else {
          await unblockCountry(code);
          return reply(chatId, `✅ Ülke engeli kaldırıldı: <b>${escapeHtml(code)}</b>`);
        }
      } catch (e: any) {
        return reply(chatId, `❌ Hata: ${escapeHtml(e.message)}`);
      }
    }

    case "/countrylist": {
      try {
        const countries = await getBlockedCountries();
        if (countries.size === 0) return reply(chatId, "🌍 Engellenmis ülke yok.");
        const list = Array.from(countries).map((c) => `• ${c}`).join("\n");
        return reply(chatId, `<b>🌍 Engellenmis Ülkeler (${countries.size})</b>\n\n${list}`);
      } catch {
        return reply(chatId, "❌ Ülke listesi alınamadı");
      }
    }

    case "/whois": {
      const ip = args[0];
      if (!ip) return reply(chatId, "❌ Kullanım: /whois <IP>\nÖrnek: /whois 8.8.8.8");
      try {
        const [blockedRes, reputationRes, eventsRes, visitorsRes] = await Promise.all([
          pool.query("SELECT reason, is_permanent, expires_at FROM ip_blocklist WHERE ip_address = $1", [ip]),
          pool.query(
            "SELECT COUNT(*) as c FROM security_logs WHERE ip_address = $1 AND created_at > NOW() - INTERVAL '7 days'",
            [ip]
          ),
          pool.query(
            "SELECT event_type, created_at FROM security_logs WHERE ip_address = $1 ORDER BY created_at DESC LIMIT 5",
            [ip]
          ),
          pool.query(
            "SELECT page_url, created_at FROM site_visitors WHERE ip_address = $1 ORDER BY created_at DESC LIMIT 5",
            [ip]
          ),
        ]);

        const lines = [`<b>🔍 WHOIS: ${escapeHtml(ip)}</b>`, ""];

        if (blockedRes.rows.length > 0) {
          const b = blockedRes.rows[0];
          lines.push(
            `<b>🚫 Durum:</b> ENgELLI`,
            `<b>Sebep:</b> ${escapeHtml(b.reason)}`,
            `<b>Tür:</b> ${b.is_permanent ? "Kalıcı" : `geçici (bitis: ${new Date(b.expires_at).toLocaleString("tr-TR")})`}`,
          );
        } else {
          lines.push("<b>✅ Durum:</b> Aktif (engellenmemis)");
        }

        lines.push(`\n<b>güvenlik olayları (7g):</b> ${reputationRes.rows[0]?.c || 0}`);

        if (eventsRes.rows.length > 0) {
          lines.push("\n<b>Son olaylar:</b>");
          eventsRes.rows.forEach((r: any) => {
            lines.push(`• ${r.event_type} [${new Date(r.created_at).toLocaleString("tr-TR")}]`);
          });
        }

        if (visitorsRes.rows.length > 0) {
          lines.push("\n<b>Son ziyaretler:</b>");
          visitorsRes.rows.forEach((r: any) => {
            lines.push(`• ${escapeHtml(r.page_url || "/")} [${new Date(r.created_at).toLocaleTimeString("tr-TR")}]`);
          });
        }

        return reply(chatId, lines.join("\n"));
      } catch {
        return reply(chatId, "❌ WHOIS sorgusu basarısız");
      }
    }

    case "/speed": {
      try {
        const res = await pool.query(
          "SELECT page_url, response_time FROM site_visitors WHERE response_time IS NOT NULL ORDER BY created_at DESC LIMIT 20"
        );
        if (res.rows.length === 0) return reply(chatId, "📊 Hız verisi henüz yok.");
        const avg = (res.rows.reduce((s: number, r: any) => s + Number(r.response_time), 0) / res.rows.length).toFixed(2);
        const min = Math.min(...res.rows.map((r: any) => Number(r.response_time))).toFixed(2);
        const max = Math.max(...res.rows.map((r: any) => Number(r.response_time))).toFixed(2);
        return reply(chatId, [
          "<b>🚀 Site Hızı</b>",
          "",
          `Ortalama: ${avg}s`,
          `En hızlı: ${min}s`,
          `En yavas: ${max}s`,
          `Örnek: Son ${res.rows.length} istek`,
        ].join("\n"));
      } catch {
        return reply(chatId, "❌ Hız verisi alınamadı");
      }
    }

    case "/blog": {
      try {
        const res = await pool.query(
          "SELECT title, slug, published_at FROM blog_posts WHERE status = 'published' AND deleted_at IS NULL ORDER BY published_at DESC LIMIT 5"
        );
        if (res.rows.length === 0) return reply(chatId, "📝 Henüz blog yazısı yok.");
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://xipsoft.net";
        const lines = res.rows.map((r: any, i: number) =>
          `${i + 1}. <a href="${siteUrl}/blog/${r.slug}">${escapeHtml(r.title)}</a>`
        ).join("\n");
        return reply(chatId, `<b>📝 Son 5 Blog Yazısı</b>\n\n${lines}`);
      } catch {
        return reply(chatId, "❌ Blog verisi alınamadı");
      }
    }

    case "/broadcast": {
      if (args.length === 0) return reply(chatId, "❌ Kullanım: /broadcast <mesaj>\nÖrnek: /broadcast Sistem bakımda!");
      const message = args.join(" ");
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://xipsoft.net";
      const channelId = process.env.TELEgRAM_CHANNEL_ID;
      if (!channelId) return reply(chatId, "❌ TELEgRAM_CHANNEL_ID yapılandırılmamıs");

      try {
        const broadcastText = [
          `📢 <b>Duyuru</b>`,
          ``,
          escapeHtml(message),
          ``,
          `— XipSoft Ekibi`,
        ].join("\n");
        const result = await sendTelegramMessage(channelId, broadcastText);
        return reply(chatId, result.ok
          ? "✅ Duyuru kanala gönderildi"
          : `❌ gönderilemedi: ${result.error}`);
      } catch {
        return reply(chatId, "❌ Duyuru gönderilemedi");
      }
    }

    default:
      return reply(chatId, `❌ Bilinmeyen komut: ${escapeHtml(cmd)}\n/help yazarak komutları görebilirsin.`);
  }
}

export async function POST(req: NextRequest) {
  if (!BOT_TOKEN || !ADMIN_CHAT_ID) {
    return NextResponse.json({ ok: false, error: "Telegram bot ayarları eksik" }, { status: 500 });
  }

  // Webhook secret token dogrulama
  if (WEBHOOK_SECRET) {
    const secretHeader = req.headers.get("x-telegram-bot-api-secret-token");
    if (secretHeader !== WEBHOOK_SECRET) {
      return NextResponse.json({ ok: false, error: "invalid secret token" }, { status: 403 });
    }
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  // Update ID ile tekrar engelleme
  const updateId = body.update_id;
  if (typeof updateId === "number") {
    if (processedUpdates.has(updateId)) {
      return NextResponse.json({ ok: true });
    }
    processedUpdates.add(updateId);
    // Set boyutunu sınırla
    if (processedUpdates.size > MAX_PROCESSED_UPDATES) {
      const firstEntries = Array.from(processedUpdates).slice(0, MAX_PROCESSED_UPDATES / 2);
      firstEntries.forEach((id) => processedUpdates.delete(id));
    }
  }

  const message = body.message;
  if (!message || !message.text) {
    return NextResponse.json({ ok: true });
  }

  const chatId = String(message.chat.id);

  if (chatId !== ADMIN_CHAT_ID) {
    await reply(chatId, "❌ Bu bot sadece admin tarafından kullanılabilir.");
    return NextResponse.json({ ok: true });
  }

  const text = message.text.trim();
  const parts = text.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  await handleCommand(chatId, cmd, args);

  return NextResponse.json({ ok: true });
}
