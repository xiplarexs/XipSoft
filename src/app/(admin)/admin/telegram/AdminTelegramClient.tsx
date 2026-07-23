"use client";

import { useState, useEffect } from "react";
import { Send, Bot, MessageSquare, RefreshCw, Globe, Shield, BarChart3 } from "lucide-react";

export default function AdminTelegramClient() {
  const [botStatus, setBotStatus] = useState<{ configured: boolean; webhook?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [customMsg, setCustomMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; error?: string } | null>(null);
  const [webhookUrl, setWebhookUrl] = useState("https://xipsoft.net/api/telegram-webhook");
  const [webhookResult, setWebhookResult] = useState<string | null>(null);
  const [webhookInfo, setWebhookInfo] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/telegram", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "test" }),
        });
        const json = await res.json();
        setBotStatus({ configured: json.ok });
      } catch {
        setBotStatus({ configured: false });
      } finally {
        setLoading(false);
      }
    })();
    fetchWebhookInfo();
  }, []);

  const fetchWebhookInfo = async () => {
    try {
      const res = await fetch("/api/admin/telegram-webhook-setup");
      const json = await res.json();
      if (json.ok) setWebhookInfo(json.webhook);
    } catch {}
  };

  const handleSend = async () => {
    if (!customMsg.trim()) return;
    setSending(true);
    setResult(null);
    try {
      const res = await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "custom", text: customMsg }),
      });
      setResult(await res.json());
    } catch {
      setResult({ ok: false, error: "Baglantı hatası" });
    } finally {
      setSending(false);
    }
  };

  const handleTest = async () => {
    setResult(null);
    try {
      const res = await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "test" }),
      });
      setResult(await res.json());
    } catch {
      setResult({ ok: false, error: "Baglantı hatası" });
    }
  };

  const handleSetWebhook = async () => {
    if (!webhookUrl.trim()) return;
    setWebhookResult(null);
    try {
      const res = await fetch("/api/admin/telegram-webhook-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: webhookUrl }),
      });
      const json = await res.json();
      setWebhookResult(json.ok ? "Webhook basarıyla ayarlandı" : `Hata: ${json.error}`);
      if (json.ok) fetchWebhookInfo();
    } catch (e: any) {
      setWebhookResult(`Baglantı hatası: ${e.message}`);
    }
  };

  const handleRemoveWebhook = async () => {
    setWebhookResult(null);
    try {
      const res = await fetch("/api/admin/telegram-webhook-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ remove: true }),
      });
      const json = await res.json();
      setWebhookResult(json.ok ? "Webhook kaldırıldı" : `Hata: ${json.error}`);
      if (json.ok) fetchWebhookInfo();
    } catch (e: any) {
      setWebhookResult(`Baglantı hatası: ${e.message}`);
    }
  };

  return (
    <div className="text-gray-900">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Bot className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Telegram Bot</h1>
            <p className="text-sm text-gray-500">Bot yönetimi ve mesaj gönderimi</p>
          </div>
        </div>

        {/* Bot Durumu */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-1">Bot Durumu</h2>
              {loading ? (
                <p className="text-sm text-gray-400">Kontrol ediliyor...</p>
              ) : botStatus?.configured ? (
                <p className="text-sm text-green-600 font-medium">Bot yapılandırılmıs ve çalısıyor</p>
              ) : (
                <p className="text-sm text-red-600 font-medium">Bot yapılandırılmamıs (TELEgRAM_BOT_TOKEN eksik)</p>
              )}
            </div>
            <button
              onClick={handleTest}
              disabled={sending}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className="w-4 h-4" />
              Test Mesajı
            </button>
          </div>
        </div>

        {/* Webhook Kurulumu */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Bot Komutları Webhook</h2>
          <p className="text-xs text-gray-500 mb-3">
            Telegram botuna /status, /block gibi komutlar gönderebilmek için webhook kurulumu yapın.
          </p>

          {webhookInfo && (
            <div className="mb-3 p-3 bg-white rounded-lg border border-gray-200 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Mevcut URL:</span>
                <span className="font-mono text-gray-700">{webhookInfo.url || "Ayarlanmamıs"}</span>
              </div>
              {webhookInfo.last_error_date && (
                <div className="flex items-center justify-between mt-1">
                  <span className="text-gray-500">Son hata:</span>
                  <span className="text-red-600">{webhookInfo.last_error_message}</span>
                </div>
              )}
              {webhookInfo.has_custom_certificate !== undefined && (
                <div className="flex items-center justify-between mt-1">
                  <span className="text-gray-500">güncel pending update:</span>
                  <span className="text-gray-700">{webhookInfo.pending_update_count}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://xipsoft.net/api/telegram-webhook"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
            <button
              onClick={handleSetWebhook}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <Bot className="w-4 h-4" />
              Webhook Ayarla
            </button>
            <button
              onClick={handleRemoveWebhook}
              className="inline-flex items-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
            >
              Kaldır
            </button>
          </div>
          {webhookResult && (
            <p className={`mt-2 text-sm ${webhookResult.includes("Hata") ? "text-red-600" : "text-green-600"}`}>
              {webhookResult}
            </p>
          )}
        </div>

        {/* Komut Listesi */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Kullanılabilir Komutlar</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {[
              { cmd: "/status", desc: "Sistem durumu" },
              { cmd: "/visitors", desc: "Son 24 saat ziyaretçi" },
              { cmd: "/stats", desc: "genel istatistikler" },
              { cmd: "/block IP", desc: "IP engelle (24s)" },
              { cmd: "/unblock IP", desc: "IP engel kaldır" },
              { cmd: "/country +XX", desc: "Ülke engelle" },
              { cmd: "/country -XX", desc: "Ülke engelini kaldır" },
              { cmd: "/countrylist", desc: "Engellenmis ülkeler" },
              { cmd: "/whois IP", desc: "IP sorgulama" },
              { cmd: "/speed", desc: "Site hız durumu" },
              { cmd: "/blog", desc: "Son 5 blog yazısı" },
              { cmd: "/broadcast", desc: "Kanala duyuru" },
            ].map(({ cmd, desc }) => (
              <div key={cmd} className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-3 py-2">
                <code className="text-xs font-mono text-blue-600">{cmd}</code>
                <span className="text-xs text-gray-500">{desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Özel Mesaj gönder */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Özel Mesaj gönder</h2>
          <textarea
            value={customMsg}
            onChange={(e) => setCustomMsg(e.target.value)}
            placeholder="Telegram kanalına gönderilecek mesaj (HTML formatı desteklenir)"
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 resize-none mb-3"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{customMsg.length}/4096 karakter</span>
            <button
              onClick={handleSend}
              disabled={sending || !customMsg.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {sending ? "gönderiliyor..." : "gönder"}
            </button>
          </div>
          {result && (
            <p className={`mt-3 text-sm ${result.ok ? "text-green-600" : "text-red-600"}`}>
              {result.ok ? "Mesaj gönderildi" : `${result.error || "Hata"}`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
