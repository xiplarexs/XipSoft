"use client";

import { useState, useEffect } from "react";
import { Search, Globe, FileText, Image, CheckCircle, XCircle, AlertTriangle, Gauge, RefreshCw, ExternalLink } from "lucide-react";

type WebVital = {
  metric: string;
  value: number;
  unit: string;
  target: number;
  status: "good" | "needs-improvement" | "poor";
};

type PageSpeedData = {
  score: number;
  strategy: string;
  metrics: WebVital[];
  opportunities: { title: string; description: string; savings: string }[];
  fetchedAt: string;
};

type AuditItem = {
  category: string;
  name: string;
  status: "ok" | "warning" | "error";
  message: string;
  fix?: string;
};

type AuditSummary = {
  total: number;
  ok: number;
  warnings: number;
  errors: number;
  score: number;
};

const VITAL_STATUS_COLORS: Record<string, string> = {
  good: "bg-green-100 text-green-700 border-green-200",
  "needs-improvement": "bg-yellow-100 text-yellow-700 border-yellow-200",
  poor: "bg-red-100 text-red-700 border-red-200",
};

const SCORE_COLOR = (score: number) =>
  score >= 90 ? "text-green-600" : score >= 50 ? "text-yellow-600" : "text-red-600";

export default function SEOClient() {
  const [pageSpeed, setPageSpeed] = useState<PageSpeedData | null>(null);
  const [audit, setAudit] = useState<{ audit: AuditItem[]; summary: AuditSummary } | null>(null);
  const [loading, setLoading] = useState({ pagespeed: false, audit: false });
  const [strategy, setStrategy] = useState<"mobile" | "desktop">("mobile");

  const fetchPageSpeed = async () => {
    setLoading((l) => ({ ...l, pagespeed: true }));
    try {
      const res = await fetch(`/api/admin/seo/pagespeed?strategy=${strategy}`);
      const json = await res.json();
      if (json.ok) setPageSpeed(json.data);
    } catch {}
    setLoading((l) => ({ ...l, pagespeed: false }));
  };

  const fetchAudit = async () => {
    setLoading((l) => ({ ...l, audit: true }));
    try {
      const res = await fetch("/api/admin/seo/audit");
      const json = await res.json();
      if (json.ok) setAudit({ audit: json.audit, summary: json.summary });
    } catch {}
    setLoading((l) => ({ ...l, audit: false }));
  };

  useEffect(() => {
    fetchAudit();
  }, []);

  return (
    <div className="space-y-6">
      {/* PageSpeed */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-indigo-600" />
            <h2 className="font-semibold text-sm text-gray-700">Core Web Vitals</h2>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value as any)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm bg-white focus:outline-none"
            >
              <option value="mobile">Mobil</option>
              <option value="desktop">Masaüstü</option>
            </select>
            <button
              onClick={fetchPageSpeed}
              disabled={loading.pagespeed}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading.pagespeed ? "animate-spin" : ""}`} />
              {loading.pagespeed ? "Analiz..." : " analiz Et"}
            </button>
          </div>
        </div>

        {!pageSpeed && !loading.pagespeed && (
          <p className="text-sm text-gray-400">Core Web Vitals analizi için yukarıdaki butona tıklayın.</p>
        )}

        {loading.pagespeed && (
          <p className="text-sm text-gray-500">google PageSpeed API'den veri çekiliyor...</p>
        )}

        {pageSpeed && (
          <>
            <div className="flex items-center gap-4 mb-4">
              <div className={`text-4xl font-bold ${SCORE_COLOR(pageSpeed.score)}`}>
                {pageSpeed.score}
              </div>
              <div className="text-sm text-gray-500">
                Performans puanı ({pageSpeed.strategy})
                <br />
                <span className="text-xs text-gray-400">
                  {new Date(pageSpeed.fetchedAt).toLocaleString("tr-TR")}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {pageSpeed.metrics.map((m) => (
                <div key={m.metric} className={`rounded-lg border p-3 ${VITAL_STATUS_COLORS[m.status]}`}>
                  <div className="text-xs font-medium mb-1">{m.metric}</div>
                  <div className="text-lg font-bold">
                    {m.unit === "s" ? `${(m.value / 1000).toFixed(2)}s` :
                     m.unit === "ms" ? `${Math.round(m.value)}ms` :
                     m.value.toFixed(3)}
                  </div>
                  <div className="text-[10px] opacity-70">Hedef: {m.unit === "s" ? `${m.target}s` : m.unit === "ms" ? `${m.target}ms` : m.target}</div>
                </div>
              ))}
            </div>

            {pageSpeed.opportunities.length > 0 && (
              <div className="mt-4">
                <h3 className="text-xs font-semibold text-gray-600 mb-2">Iyilestirme Önerileri</h3>
                <div className="space-y-2">
                  {pageSpeed.opportunities.map((o, i) => (
                    <div key={i} className="bg-white rounded-lg border border-gray-200 p-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">{o.title}</span>
                        <span className="text-xs text-green-600 font-medium">{o.savings} tasarruf</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{o.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* SEO Denetimi */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-indigo-600" />
            <h2 className="font-semibold text-sm text-gray-700">SEO Denetimi</h2>
          </div>
          <button
            onClick={fetchAudit}
            disabled={loading.audit}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading.audit ? "animate-spin" : ""}`} />
            {loading.audit ? "Denetleniyor..." : "Denetle"}
          </button>
        </div>

        {audit && (
          <>
            <div className="flex items-center gap-6 mb-4 p-3 bg-white rounded-lg border border-gray-200">
              <div className="text-center">
                <div className={`text-2xl font-bold ${SCORE_COLOR(audit.summary.score)}`}>{audit.summary.score}</div>
                <div className="text-[10px] text-gray-500">Puan</div>
              </div>
              <div className="flex gap-4 text-sm">
                <span className="text-green-600">{audit.summary.ok} iyi</span>
                <span className="text-yellow-600">{audit.summary.warnings} uyarı</span>
                <span className="text-red-600">{audit.summary.errors} hata</span>
              </div>
            </div>

            <div className="space-y-2">
              {audit.audit.map((item, i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-3">
                  <div className="flex items-center gap-3">
                    {item.status === "ok" ? (
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    ) : item.status === "warning" ? (
                      <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-400">{item.category}</span>
                        <span className="text-sm font-medium text-gray-700">{item.name}</span>
                      </div>
                      <p className="text-xs text-gray-500">{item.message}</p>
                      {item.fix && (
                        <p className="text-xs text-indigo-600 mt-1">Öneri: {item.fix}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!audit && !loading.audit && (
          <p className="text-sm text-gray-400">SEO denetimi için "Denetle" butonuna tıklayın.</p>
        )}
      </div>
    </div>
  );
}
