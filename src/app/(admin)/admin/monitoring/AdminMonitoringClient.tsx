"use client";

import { useState, useEffect, useRef } from "react";
import { Activity, Database, HardDrive, Heart, RefreshCw, Cpu, Clock, AlertTriangle } from "lucide-react";

export default function AdminMonitoringClient() {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [history, setHistory] = useState<{ timestamp: string; status: string; dbLatency?: number; heapUsed?: number }[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      setHealth(data);
      // Son 20 kaydı tut
      setHistory((prev) => {
        const next = [...prev, {
          timestamp: data.timestamp,
          status: data.status,
          dbLatency: data.checks?.database?.latency,
          heapUsed: data.checks?.memory?.heapUsedPercent,
        }];
        return next.slice(-20);
      });
    } catch {
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(load, 10000); // 10 saniyede bir
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [autoRefresh]);

  const statusColor = (s: string) =>
    s === "ok" ? "text-green-600 bg-green-50 border-green-200"
    : s === "degraded" ? "text-amber-600 bg-amber-50 border-amber-200"
    : "text-red-600 bg-red-50 border-red-200";

  const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${d}g ${h}sa ${m}dk`;
  };

  return (
    <div className="text-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-rose-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sistem Monitörü</h1>
              <p className="text-sm text-gray-500">Sunucu saglıgı ve performans metrikleri</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              Oto Yenile (10s)
            </label>
            <button
              onClick={load}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Yenile
            </button>
          </div>
        </div>

        {/* genel Durum */}
        {health && (
          <div className={`rounded-xl border p-5 mb-6 ${statusColor(health.status)}`}>
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6" />
              <div>
                <p className="font-semibold">
                  Sistem {health.status === "ok" ? "Saglıklı" : health.status === "degraded" ? "Kısmi Sorunlu" : "Çevrim Dısı"}
                </p>
                <p className="text-sm opacity-80">Son güncelleme: {new Date(health.timestamp).toLocaleString("tr-TR")}</p>
              </div>
            </div>
          </div>
        )}

        {/* Uyarılar */}
        {health?.checks?.memory?.heapUsedPercent > 85 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <div className="text-sm">
              <span className="font-medium text-yellow-800">Yüksek bellek kullanımı:</span>{" "}
              <span className="text-yellow-700">%{health.checks.memory.heapUsedPercent}</span>
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {/* Veritabanı */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Database className="w-5 h-5 text-indigo-600" />
              <h2 className="font-semibold text-sm text-gray-700">Veritabanı (PostgreSQL)</h2>
            </div>
            {health ? (
              <div className="space-y-1 text-sm">
                <p className={health.checks.database.status === "ok" ? "text-green-600" : "text-red-600"}>
                  {health.checks.database.status === "ok" ? "Bagli" : `Hata: ${health.checks.database.error}`}
                </p>
                {health.checks.database.latency != null && (
                  <p className="text-gray-500">gecikme: {health.checks.database.latency}ms</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-400">Yükleniyor...</p>
            )}
          </div>

          {/* Redis */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Database className="w-5 h-5 text-amber-600" />
              <h2 className="font-semibold text-sm text-gray-700">Redis (Önbellek)</h2>
            </div>
            {health ? (
              <div className="space-y-1 text-sm">
                <p className={
                  health.checks.redis.status === "ok" ? "text-green-600"
                  : health.checks.redis.status === "disabled" ? "text-gray-400"
                  : "text-red-600"
                }>
                  {health.checks.redis.status === "ok" ? "Baglı"
                   : health.checks.redis.status === "disabled" ? "Yapılandırılmamıs"
                   : "Hata"}
                </p>
                {health.checks.redis.status === "disabled" && (
                  <p className="text-xs text-gray-400">UPSTASH_REDIS_REST_URL eksik</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-400">Yükleniyor...</p>
            )}
          </div>

          {/* CPU */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="w-5 h-5 text-purple-600" />
              <h2 className="font-semibold text-sm text-gray-700">CPU Kullanımı</h2>
            </div>
            {health?.checks?.cpu ? (
              <div className="space-y-1 text-sm text-gray-600">
                <p>Kullanım: <span className="font-medium">%{health.checks.cpu.percent}</span></p>
                <p>User: {health.checks.cpu.user}ms | System: {health.checks.cpu.system}ms</p>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Yükleniyor...</p>
            )}
          </div>

          {/* Bellek */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <HardDrive className="w-5 h-5 text-blue-600" />
              <h2 className="font-semibold text-sm text-gray-700">Bellek Kullanımı</h2>
            </div>
            {health?.checks?.memory ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Heap</span>
                  <span className="font-medium">{health.checks.memory.heapUsed} / {health.checks.memory.heapTotal} (%{health.checks.memory.heapUsedPercent})</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      health.checks.memory.heapUsedPercent > 85 ? "bg-red-500" :
                      health.checks.memory.heapUsedPercent > 60 ? "bg-yellow-500" : "bg-green-500"
                    }`}
                    style={{ width: `${Math.min(100, health.checks.memory.heapUsedPercent)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">RSS: {health.checks.memory.rss}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Yükleniyor...</p>
            )}
          </div>

          {/* Çalısma Süresi */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-emerald-600" />
              <h2 className="font-semibold text-sm text-gray-700">Çalısma Süresi</h2>
            </div>
            {health?.checks?.uptime ? (
              <p className="text-sm text-gray-600">{formatUptime(health.checks.uptime)}</p>
            ) : (
              <p className="text-sm text-gray-400">Yükleniyor...</p>
            )}
          </div>

          {/* Event Loop */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-5 h-5 text-rose-600" />
              <h2 className="font-semibold text-sm text-gray-700">Event Loop Lag</h2>
            </div>
            {health?.checks?.eventLoopLag != null ? (
              <div>
                <p className="text-sm text-gray-600">{health.checks.eventLoopLag}ms</p>
                <p className="text-xs text-gray-400 mt-1">
                  {health.checks.eventLoopLag < 50 ? "Saglıklı" :
                   health.checks.eventLoopLag < 200 ? "Yüksek" : "Kritik"}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Yükleniyor...</p>
            )}
          </div>
        </div>

        {/* Son Metrikler grafigi */}
        {history.length > 1 && (
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-5">
            <h2 className="font-semibold text-sm text-gray-700 mb-3">Son Ölçümler</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-gray-500 border-b border-gray-200">
                  <tr>
                    <th className="pb-2 font-medium">Zaman</th>
                    <th className="pb-2 font-medium">Durum</th>
                    <th className="pb-2 font-medium">DB gecikme</th>
                    <th className="pb-2 font-medium">Heap %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {history.slice().reverse().slice(0, 10).map((h, i) => (
                    <tr key={i}>
                      <td className="py-1.5 text-gray-600">{new Date(h.timestamp).toLocaleTimeString("tr-TR")}</td>
                      <td className="py-1.5">
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          h.status === "ok" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}>{h.status}</span>
                      </td>
                      <td className="py-1.5 text-gray-600">{h.dbLatency != null ? `${h.dbLatency}ms` : "-"}</td>
                      <td className="py-1.5 text-gray-600">{h.heapUsed != null ? `%${h.heapUsed}` : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
