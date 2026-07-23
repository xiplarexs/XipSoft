"use client";

import { useState, useEffect } from "react";
import { Shield, Filter, Trash2, RefreshCw, ChevronLeft, ChevronRight, Search } from "lucide-react";

type SecurityLog = {
  id: number;
  event_type: string;
  ip_address: string | null;
  user_agent: string | null;
  endpoint: string | null;
  payload: any;
  severity: string;
  is_blocked: boolean;
  blocked_until: string | null;
  created_at: string;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const SEVERITY_COLORS: Record<string, string> = {
  low: "bg-gray-100 text-gray-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-orange-100 text-orange-700",
  critical: "bg-red-100 text-red-700",
};

const EVENT_LABELS: Record<string, string> = {
  brute_force: "Brute Force",
  rate_limit: "Rate Limit",
  csrf_fail: "CSRF Hatası",
  sql_inject_attempt: "SQL Injection",
  xss_attempt: "XSS Saldırısı",
  unauthorized_access: "Yetkisiz Erisim",
  suspicious_ip: "süpheli IP",
  bot_detected: "Bot Tespit",
};

export default function SecurityLogsClient() {
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtreler
  const [severity, setSeverity] = useState("");
  const [eventType, setEventType] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [days, setDays] = useState(7);
  const [page, setPage] = useState(1);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("days", String(days));
      if (severity) params.set("severity", severity);
      if (eventType) params.set("event_type", eventType);
      if (ipAddress) params.set("ip_address", ipAddress);

      const res = await fetch(`/api/admin/security-logs?${params}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Veri alınamadı");
      setLogs(json.logs || []);
      setPagination(json.pagination);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, severity, eventType, days]);

  const handleSearch = () => {
    setPage(1);
    fetchLogs();
  };

  const handleCleanup = async () => {
    if (!confirm(`${days} günden eski logları silmek istediginize emin misiniz?`)) return;
    try {
      const res = await fetch(`/api/admin/security-logs?days=${days}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      alert(json.message);
      fetchLogs();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="text-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-8 h-8 text-indigo-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">güvenlik Logları</h1>
            <p className="text-sm text-gray-500">
              {pagination ? `${pagination.total} toplam kayıt` : "Yükleniyor..."}
            </p>
          </div>
        </div>

        {/* Filtreler */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-gray-500" />
            <h2 className="text-sm font-semibold text-gray-700">Filtreler</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Seviye</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                <option value="">Tümü</option>
                <option value="low">Düsük</option>
                <option value="medium">Orta</option>
                <option value="high">Yüksek</option>
                <option value="critical">Kritik</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Olay Türü</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                <option value="">Tümü</option>
                {Object.entries(EVENT_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">IP Adresi</label>
              <input
                type="text"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                placeholder="192.168.1.1"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Son X gün</label>
              <select
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                <option value={1}>1 gün</option>
                <option value={7}>7 gün</option>
                <option value={30}>30 gün</option>
                <option value={90}>90 gün</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={handleSearch}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                <Search className="w-4 h-4" />
                Ara
              </button>
              <button
                onClick={handleCleanup}
                className="inline-flex items-center gap-2 rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {loading && <p className="text-gray-500 text-sm">Yükleniyor...</p>}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {!loading && !error && (
          <>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="px-4 py-3">Seviye</th>
                      <th className="px-4 py-3">Olay</th>
                      <th className="px-4 py-3">IP</th>
                      <th className="px-4 py-3">Hedef</th>
                      <th className="px-4 py-3">Engellendi</th>
                      <th className="px-4 py-3">Tarih</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${SEVERITY_COLORS[log.severity] || "bg-gray-100 text-gray-700"}`}>
                            {log.severity.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {EVENT_LABELS[log.event_type] || log.event_type}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-900">
                          {log.ip_address || "-"}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-500 max-w-[200px] truncate">
                          {log.endpoint || "-"}
                        </td>
                        <td className="px-4 py-3">
                          {log.is_blocked ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-50 text-red-600 border border-red-100">Evet</span>
                          ) : (
                            <span className="text-gray-400 text-xs">Hayır</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                          {new Date(log.created_at).toLocaleString("tr-TR")}
                        </td>
                      </tr>
                    ))}
                    {logs.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                          Bu kriterlere uygun log bulunamadı.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sayfalama */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-gray-500">
                  Sayfa {pagination.page} / {pagination.totalPages} ({pagination.total} kayıt)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page <= 1}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Önceki
                  </button>
                  <button
                    onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                    disabled={page >= pagination.totalPages}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Sonraki
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
