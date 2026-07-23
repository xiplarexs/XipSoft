"use client";

import { useState, useEffect } from "react";
import { Zap, Play, RefreshCw, CheckCircle, XCircle, Clock } from "lucide-react";

type JobResult = {
  name: string;
  status: "success" | "error" | "skipped";
  message: string;
  duration: number;
};

const JOB_LABELS: Record<string, string> = {
  health_check: "Sistem SaGlık Kontrolü",
  cleanup_visitors: "Eski Ziyaretçi TemizliGi",
  cleanup_security_logs: "Güvenlik Logu TemizliGi",
  cleanup_expired_blocks: "Süresi Dolmus IP Engel TemizliGi",
  cleanup_csrf_tokens: "CSRF Token TemizliGi",
  daily_stats: "Günlük Istatistik Raporu",
};

const JOB_SCHEDULES: Record<string, string> = {
  health_check: "Her istekte (otomatik)",
  cleanup_visitors: "Haftalık (Pzt 03:00)",
  cleanup_security_logs: "Haftalık (Pzt 03:00)",
  cleanup_expired_blocks: "Günlük (03:00)",
  cleanup_csrf_tokens: "Günlük (03:00)",
  daily_stats: "Günlük (09:00)",
};

export default function AutomationClient() {
  const [jobs, setJobs] = useState<string[]>([]);
  const [results, setResults] = useState<JobResult[]>([]);
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/automation");
        const json = await res.json();
        if (json.ok) setJobs(json.jobs || []);
      } catch {}
      setLoading(false);
    })();
  }, []);

  const runJob = async (jobName?: string) => {
    setRunning(true);
    setResults([]);
    try {
      const res = await fetch("/api/admin/automation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job: jobName }),
      });
      const json = await res.json();
      if (json.ok) setResults(json.results || []);
    } catch {}
    setRunning(false);
  };

  return (
    <div className="text-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8 text-indigo-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Otomasyon</h1>
              <p className="text-sm text-gray-500">Zamanlanmıs isler ve bakım tasks</p>
            </div>
          </div>
          <button
            onClick={() => runJob()}
            disabled={running}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            <Play className="w-4 h-4" />
            {running ? "Çalıstırılıyor..." : "Tümünü Çalıstır"}
          </button>
        </div>

        {/* Is Listesi */}
        {loading ? (
          <p className="text-gray-500 text-sm">Yükleniyor...</p>
        ) : (
          <div className="space-y-3 mb-8">
            {jobs.map((job) => (
              <div key={job} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">{JOB_LABELS[job] || job}</h3>
                  <p className="text-xs text-gray-400">{JOB_SCHEDULES[job] || "Tanımlı deGil"}</p>
                </div>
                <button
                  onClick={() => runJob(job)}
                  disabled={running}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  <Play className="w-3 h-3" />
                  Çalıstır
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Sonuçlar */}
        {results.length > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Sonuçlar</h2>
            <div className="space-y-2">
              {results.map((r, i) => (
                <div key={i} className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 p-3">
                  {r.status === "success" ? (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">{JOB_LABELS[r.name] || r.name}</p>
                    <p className="text-xs text-gray-500">{r.message}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-medium ${r.status === "success" ? "text-green-600" : "text-red-600"}`}>
                      {r.status === "success" ? "Basarılı" : "Hatalı"}
                    </span>
                    <p className="text-[10px] text-gray-400">{r.duration}ms</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
