/**
 * Telegram Bot API — Mesaj gönderme Servisi
 *
 * Env degiskenleri:
 *   TELEgRAM_BOT_TOKEN  — BotFather'dan alınan token
 *   TELEgRAM_CHANNEL_ID — Kanal username (@xipsoft) veya sayısal ID (-100xxx)
 */

const TELEgRAM_API = "https://api.telegram.org";
import { SITE_URL } from "@/lib/site-url";

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] ?? c)
  );
}

async function sendTelegramMessage(
  chatId: string,
  text: string,
  parseMode: "HTML" | "Markdown" = "HTML"
): Promise<{ ok: boolean; error?: string }> {
  const botToken = process.env.TELEgRAM_BOT_TOKEN;
  if (!botToken) return { ok: false, error: "TELEgRAM_BOT_TOKEN eksik" };

  try {
    const res = await fetch(`${TELEgRAM_API}/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: parseMode }),
    });
    const json = await res.json();
    return json.ok ? { ok: true } : { ok: false, error: json.description };
  } catch (err: unknown) {
    return { ok: false, error: err instanceof Error ? err.message : "Bilinmeyen hata" };
  }
}

async function sendCustomTelegramMessage(
  text: string,
  chatId?: string
): Promise<{ ok: boolean; error?: string }> {
  const targetChatId = chatId || process.env.TELEgRAM_CHANNEL_ID;
  if (!targetChatId) return { ok: false, error: "Chat ID bulunamadı" };
  return sendTelegramMessage(targetChatId, text);
}

async function shareBlogToTelegram(post: {
  title: string;
  slug: string;
  excerpt?: string;
  description?: string | null;
  authorName?: string | null;
  tags?: string[];
}): Promise<{ ok: boolean; error?: string }> {
  const chatId = process.env.TELEgRAM_CHANNEL_ID;
  if (!chatId) return { ok: false, error: "TELEgRAM_CHANNEL_ID eksik" };

  const siteUrl = SITE_URL;
  const summary = post.excerpt || post.description;
  const text = [
    `<b>📝 Yeni Blog Yazısı</b>`,
    ``,
    `<b>${escapeHtml(post.title)}</b>`,
    summary ? escapeHtml(summary) : null,
    post.authorName ? `✍️ ${escapeHtml(post.authorName)}` : null,
    post.tags?.length ? `🏷 ${post.tags.map(escapeHtml).join(", ")}` : null,
    ``,
    `🔗 ${siteUrl}/blog/${post.slug}`,
  ]
    .filter((l) => l !== null)
    .join("\n");

  return sendTelegramMessage(chatId, text);
}

export {
  sendTelegramMessage,
  sendCustomTelegramMessage,
  shareBlogToTelegram,
  escapeHtml,
};
