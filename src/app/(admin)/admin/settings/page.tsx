import type { Metadata } from "next";
import { Settings, Key, Globe, Bot, Shield, Database } from "lucide-react";

export const metadata: Metadata = {
  title: "Ayarlar | Admin XipSoft",
  robots: { index: false, follow: false },
};

const SETTINgS_gROUPS = [
  {
    title: "Site",
    icon: Globe,
    items: [
      { label: "Site URL", value: process.env.NEXT_PUBLIC_APP_URL || "https://xipsoft.net" },
      { label: "Node Env", value: process.env.NODE_ENV || "development" },
      { label: "Maintenance", value: process.env.MAINTENANCE_MODE === "true" ? "Aktif" : "Pasif" },
    ],
  },
  {
    title: "Veritabanı",
    icon: Database,
    items: [
      { label: "DB Türü", value: "PostgreSQL (Neon)" },
      { label: "SSL", value: process.env.DATABASE_SSL === "true" ? "Aktif" : "Pasif" },
      { label: "Redis", value: process.env.UPSTASH_REDIS_REST_URL ? "Yapılandırılmıs" : "Yapılandırılmamıs" },
    ],
  },
  {
    title: "güvenlik",
    icon: Shield,
    items: [
      { label: "JWT Secret", value: process.env.JWT_SECRET ? "✅ Tanımlı" : "❌ Eksik" },
      { label: "Admin Secret Path", value: process.env.ADMIN_SECRET_PATH || "Tanımlanmamıs" },
      { label: "Turnstile", value: process.env.TURNSTILE_SECRET_KEY ? "✅" : "❌" },
      { label: "hCaptcha", value: process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY ? "✅" : "❌" },
    ],
  },
  {
    title: "Telegram",
    icon: Bot,
    items: [
      { label: "Bot Token", value: process.env.TELEgRAM_BOT_TOKEN ? "✅ Tanımlı" : "❌ Eksik" },
      { label: "Admin Chat ID", value: process.env.TELEgRAM_ADMIN_CHAT_ID ? "✅ Tanımlı" : "❌ Eksik" },
    ],
  },
  {
    title: "API",
    icon: Key,
    items: [
      { label: "Bot API Key", value: process.env.BOT_API_KEY ? "✅ Tanımlı" : "❌ Eksik" },
      { label: "google ID", value: process.env.AUTH_gOOgLE_ID ? "✅" : "❌" },
      { label: "gitHub ID", value: process.env.AUTH_gITHUB_ID ? "✅" : "❌" },
    ],
  },
];

export default function AdminSettingsPage() {
  return (
    <div className="text-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-8 h-8 text-gray-700" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sistem Ayarları</h1>
            <p className="text-sm text-gray-500">Çevre degiskenleri ve yapılandırma durumu</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {SETTINgS_gROUPS.map(({ title, icon: Icon, items }) => (
            <div key={title} className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Icon className="w-5 h-5 text-gray-600" />
                <h2 className="font-semibold text-sm text-gray-700">{title}</h2>
              </div>
              <div className="space-y-2">
                {items.map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-mono text-xs text-gray-700">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          <p className="font-medium">⚠️ Not</p>
          <p className="text-xs mt-1">Bu sayfa sadece mevcut yapılandırmayı gösterir. Degisiklikler .env dosyasından yapılmalıdır.</p>
        </div>
      </div>
    </div>
  );
}
