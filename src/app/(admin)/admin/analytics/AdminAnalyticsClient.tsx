"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Activity, Users, Bot, MousePointerClick, Globe, TrendingUp, Radio } from "lucide-react";
import {
  getAnalyticsAction,
  getBotVisitsAction,
  getHumanVisitsAction,
  getReferrerStatsAction,
  getDailyStatsAction,
  getLiveVisitorsAction,
} from "@/app/_actions/admin-analytics-actions";

type AnalyticsData = {
  users: {
    total_users: string;
    admin_count: string;
    moderator_count: string;
    banned_count: string;
    new_this_week: string;
  };
  visitors: {
    total_visits: string;
    unique_visitors: string;
    today_visits: string;
  } | null;
  recentVisitors: Array<{
    id: number;
    ip_address: string;
    path: string;
    user_agent?: string;
    referrer?: string;
    country?: string;
    browser?: string;
    device_type?: string;
    created_at: string;
  }>;
  bots: { bot_count: string; human_count: string };
  topPages: Array<{ path: string; count: string; bot_count: string }>;
  topReferrers: Array<{ referrer: string; count: string }>;
  dailyStats: Array<{ date: string; count: string; bot_count: string }>;
};

function StatCard({
  title,
  value,
  sub,
  icon,
}: {
  title: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">
        {icon}
        <span>{title}</span>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
    </div>
  );
}

function isBot(ua: string | undefined) {
  if (!ua) return false;
  return /googlebot|bingbot|yandexbot|duckduckbot|baiduspider|facebookexternalhit|twitterbot|linkedinbot|whatsapp|slackbot|lighthouse|bot|crawler|spider/i.test(ua);
}

function BotBadge({ ua }: { ua?: string }) {
  if (!ua || !isBot(ua)) return null;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-600 border border-blue-100">
      <Bot className="w-3 h-3" />
      Bot
    </span>
  );
}

export default function AdminAnalyticsClient() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [bots, setBots] = useState<any[]>([]);
  const [humans, setHumans] = useState<any[]>([]);
  const [referrers, setReferrers] = useState<any[]>([]);
  const [daily, setDaily] = useState<any[]>([]);
  const [comparison, setComparison] = useState<{ current: number; previous: number; changePercent: number | null; trend: string } | null>(null);
  const [liveData, setLiveData] = useState<{ visitors: any[]; summary: any } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"recent" | "bots" | "humans" | "referrers" | "daily">("recent");
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const loadAll = useCallback(async () => {
    setError(null);
    const [analytics, botRes, humanRes, refRes, dailyRes, live] = await Promise.all([
      getAnalyticsAction(),
      getBotVisitsAction(100),
      getHumanVisitsAction(100),
      getReferrerStatsAction(),
      getDailyStatsAction(),
      getLiveVisitorsAction(),
    ]);

    if (!analytics.success) {
      setError(analytics.error || "Veri yüklenemedi");
    }

    if (analytics.success && analytics.data) setData(analytics.data as AnalyticsData);
    if (botRes.success) setBots(botRes.data ?? []);
    if (humanRes.success) setHumans(humanRes.data ?? []);
    if (refRes.success) setReferrers(refRes.data ?? []);
    if (dailyRes.success) {
      setDaily(dailyRes.data ?? []);
      if ((dailyRes as any).comparison) setComparison((dailyRes as any).comparison);
    }
    if (live.success) setLiveData(live.data ?? null);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAll();
    timerRef.current = setInterval(loadAll, 15000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [loadAll]);

  if (loading) {
    return (
      <div className="text-gray-900">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h1>
          <div className="text-gray-500">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-gray-900">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h1>
          <div className="text-red-500">{error || "Veri yüklenemedi"}</div>
        </div>
      </div>
    );
  }

  const botCount = parseInt(data.bots.bot_count || "0", 10);
  const humanCount = parseInt(data.bots.human_count || "0", 10);
  const totalVisits = botCount + humanCount;
  const todayVisits = data.visitors?.today_visits || "0";

  const tabs = [
    { key: "recent", label: "Son Ziyaretler", icon: <Activity className="w-4 h-4" /> },
    { key: "bots", label: `Bot Gezinmeleri (${botCount})`, icon: <Bot className="w-4 h-4" /> },
    { key: "humans", label: `Kullanıcı Gezinmeleri (${humanCount})`, icon: <Users className="w-4 h-4" /> },
    { key: "referrers", label: "Referanslar", icon: <Globe className="w-4 h-4" /> },
    { key: "daily", label: "Günlük Grafik", icon: <TrendingUp className="w-4 h-4" /> },
  ] as const;

  const renderTable = (rows: any[]) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-500 uppercase border-b border-gray-200">
          <tr>
            <th className="px-4 py-3">Tarih</th>
            <th className="px-4 py-3">Sayfa</th>
            <th className="px-4 py-3">IP</th>
            <th className="px-4 py-3">Ülke</th>
            <th className="px-4 py-3">Cihaz</th>
            <th className="px-4 py-3">Tarayıcı</th>
            <th className="px-4 py-3">Referans</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((r) => (
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                {new Date(r.created_at).toLocaleString("tr-TR")}
              </td>
              <td className="px-4 py-3 text-gray-900 font-mono text-xs">{r.path}</td>
              <td className="px-4 py-3 text-gray-600 font-mono text-xs">{r.ip_address}</td>
              <td className="px-4 py-3 text-gray-600 text-xs">{r.country || "—"}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium ${
                  r.device_type === "Mobile" ? "bg-blue-50 text-blue-600"
                  : r.device_type === "Tablet" ? "bg-purple-50 text-purple-600"
                  : r.device_type ? "bg-gray-100 text-gray-600"
                  : ""
                }`}>
                  {r.device_type || "—"}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 text-xs">{r.browser || r.user_agent?.slice(0, 30) || "—"}</span>
                  <BotBadge ua={r.user_agent} />
                </div>
              </td>
              <td className="px-4 py-3 text-gray-600 text-xs truncate max-w-[160px]">{r.referrer || "—"}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                Kayıt bulunamadı
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const maxDailyCount = Math.max(...daily.map((d) => parseInt(d.count || "0", 10)), 1);

  return (
    <div className="text-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Ziyaretçi & Bot Analizi</h1>
          <p className="text-gray-500 text-sm mt-1">
            Google botlarının ve kullanıcıların site içi hareketlerini izleyin
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard title="Toplam Ziyaret" value={totalVisits} icon={<Activity className="w-4 h-4" />} />
          <StatCard title="Bugün" value={todayVisits} sub="Son 24 saat" icon={<MousePointerClick className="w-4 h-4" />} />
          {liveData?.summary && (
            <StatCard
              title="Anlık (5dk)"
              value={liveData.summary.total ?? "0"}
              sub={`${liveData.summary.last_minute ?? 0} son dakika · ${liveData.summary.unique_ips ?? 0} IP`}
              icon={<Radio className="w-4 h-4" />}
            />
          )}
          <StatCard
            title="Bot"
            value={botCount}
            sub={`%${totalVisits ? Math.round((botCount / totalVisits) * 100) : 0}`}
            icon={<Bot className="w-4 h-4" />}
          />
          <StatCard
            title="Insan"
            value={humanCount}
            sub={`%${totalVisits ? Math.round((humanCount / totalVisits) * 100) : 0}`}
            icon={<Users className="w-4 h-4" />}
          />
        </div>

        {/* Dönem Karsılastırma (Görev 2.3) */}
        {comparison && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-8 shadow-sm flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Son 30 gün karsılastırması</span>
            </div>
            <div className="flex items-center gap-6 text-sm ml-auto flex-wrap">
              <span className="text-gray-500">Önceki dönem: <strong className="text-gray-800">{comparison.previous}</strong></span>
              <span className="text-gray-500">Bu dönem: <strong className="text-gray-800">{comparison.current}</strong></span>
              {comparison.changePercent !== null && (
                <span className={`font-semibold px-2 py-0.5 rounded-full text-xs ${
                  comparison.trend === "up" ? "bg-emerald-50 text-emerald-700"
                  : comparison.trend === "down" ? "bg-red-50 text-red-600"
                  : "bg-gray-100 text-gray-600"
                }`}>
                  {comparison.changePercent > 0 ? "+" : ""}{comparison.changePercent}%
                  {comparison.trend === "up" ? " ↑" : comparison.trend === "down" ? " ↓" : ""}
                </span>
              )}
            </div>
          </div>
        )}

        {liveData && liveData.visitors.length > 0 && (
          <div className="bg-white border border-emerald-200 rounded-xl p-5 mb-8 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-sm font-semibold text-gray-900">Anlık Ziyaretçiler (son 5 dk)</h2>
              <span className="text-xs text-gray-400 ml-auto">15 saniyede bir yenilenir</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-2">Zaman</th>
                    <th className="px-3 py-2">Sayfa</th>
                    <th className="px-3 py-2">IP</th>
                    <th className="px-3 py-2">UA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {liveData.visitors.slice(0, 8).map((v) => (
                    <tr key={v.id} className="hover:bg-emerald-50/50">
                      <td className="px-3 py-2 text-xs text-gray-500 whitespace-nowrap">
                        {new Date(v.created_at).toLocaleTimeString("tr-TR")}
                      </td>
                      <td className="px-3 py-2 text-xs font-mono text-gray-800">{v.path}</td>
                      <td className="px-3 py-2 text-xs font-mono text-gray-500">{v.ip_address}</td>
                      <td className="px-3 py-2 text-xs text-gray-400 truncate max-w-[180px]">
                        {v.user_agent?.slice(0, 60) || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {data.topPages.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-8 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">En Çok Ziyaret Edilen Sayfalar</h2>
            <div className="space-y-3">
              {data.topPages.map((p) => {
                const count = parseInt(p.count || "0", 10);
                const bots = parseInt(p.bot_count || "0", 10);
                const humans = count - bots;
                return (
                  <div key={p.path} className="flex items-center gap-3">
                    <span className="text-xs text-gray-700 font-mono truncate w-64">{p.path}</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full flex">
                        <div
                          className="bg-blue-500 h-full"
                          style={{ width: `${totalVisits ? (bots / count) * 100 : 0}%` }}
                        />
                        <div
                          className="bg-emerald-500 h-full"
                          style={{ width: `${totalVisits ? (humans / count) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 w-20 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Bot</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Insan</span>
            </div>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-1 p-2 border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.key
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "recent" && renderTable(data.recentVisitors)}
          {activeTab === "bots" && renderTable(bots)}
          {activeTab === "humans" && renderTable(humans)}
          {activeTab === "referrers" && (
            <div className="p-4">
              {referrers.length === 0 ? (
                <p className="text-center text-gray-400 py-8">Henüz referans verisi yok</p>
              ) : (
                <div className="space-y-2">
                  {referrers.map((r) => (
                    <div key={r.referrer} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <span className="text-sm text-gray-700 truncate max-w-lg">{r.referrer}</span>
                      <span className="text-xs text-gray-500">{r.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === "daily" && (
            <div className="p-4">
              {daily.length === 0 ? (
                <p className="text-center text-gray-400 py-8">Henüz veri yok</p>
              ) : (
                <div className="space-y-3">
                  {daily.map((d) => {
                    const count = parseInt(d.count || "0", 10);
                    const bots = parseInt(d.bot_count || "0", 10);
                    const humans = count - bots;
                    return (
                      <div key={d.date} className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 w-24">{d.date}</span>
                        <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full flex">
                            <div
                              className="bg-blue-500 h-full"
                              style={{ width: `${maxDailyCount ? (bots / maxDailyCount) * 100 : 0}%` }}
                            />
                            <div
                              className="bg-emerald-500 h-full"
                              style={{ width: `${maxDailyCount ? (humans / maxDailyCount) * 100 : 0}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 w-16 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
