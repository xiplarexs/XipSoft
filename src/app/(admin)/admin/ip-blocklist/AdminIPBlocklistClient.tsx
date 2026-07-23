"use client";

import { useState, useEffect } from "react";
import { ShieldBan, Plus, Trash2 } from "lucide-react";

type BlockEntry = {
  id: number;
  ip_address: string;
  reason: string;
  is_permanent: boolean;
  expires_at: string | null;
  created_at: string;
};

export default function AdminIPBlocklistClient() {
  const [entries, setEntries] = useState<BlockEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ ip_address: "", reason: "", is_permanent: true, expires_hours: 24 });
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/ip-blocklist");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Veri alınamadı");
      setEntries(json.blocklist || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/ip-blocklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Ekleme basarısız");
      setForm({ ip_address: "", reason: "", is_permanent: true, expires_hours: 24 });
      await load();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("IP engelini kaldırmak istediGinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/ip-blocklist?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Silme basarısız");
      await load();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleClearAll = async () => {
    if (!confirm("Tüm GEÇICI IP engellerini kaldırmak istediGinize emin misiniz?")) return;
    try {
      const res = await fetch("/api/admin/ip-blocklist?clearAll=true", { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Islem basarısız");
      await load();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="text-gray-900">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <ShieldBan className="w-6 h-6 text-red-500" />
          <h1 className="text-2xl font-bold text-gray-900">IP Engelleme Listesi</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">IP Adresi</label>
              <input
                type="text"
                value={form.ip_address}
                onChange={(e) => setForm({ ...form, ip_address: e.target.value })}
                placeholder="192.168.1.1"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Sebep</label>
              <input
                type="text"
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                placeholder="Spam, saldırı vb."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.is_permanent}
                onChange={(e) => setForm({ ...form, is_permanent: e.target.checked })}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              Kalıcı engelle
            </label>
            {!form.is_permanent && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <label>Son kullanma (saat):</label>
                <input
                  type="number"
                  min={1}
                  value={form.expires_hours}
                  onChange={(e) => setForm({ ...form, expires_hours: Number(e.target.value) })}
                  className="w-20 rounded-lg border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40"
                />
              </div>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="ml-auto inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              {submitting ? "Ekleniyor..." : "Ekle"}
            </button>
          </div>
        </form>

        {loading && <p className="text-gray-500 text-sm">Yükleniyor...</p>}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {!loading && !error && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">Toplam {entries.length} kayıt</span>
              {entries.some((e) => !e.is_permanent) && (
                <button
                  onClick={handleClearAll}
                  className="text-xs font-medium text-red-600 hover:text-red-700"
                >
                  Geçici engelleri temizle
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-4 py-3">IP</th>
                    <th className="px-4 py-3">Sebep</th>
                    <th className="px-4 py-3">Süre</th>
                    <th className="px-4 py-3">Eklenme</th>
                    <th className="px-4 py-3 text-right">Islem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {entries.map((e) => (
                    <tr key={e.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs text-gray-900">{e.ip_address}</td>
                      <td className="px-4 py-3 text-gray-700">{e.reason}</td>
                      <td className="px-4 py-3">
                        {e.is_permanent ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-50 text-red-600 border border-red-100">Kalıcı</span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-600 border border-amber-100">
                            {e.expires_at ? new Date(e.expires_at).toLocaleDateString("tr-TR") : "Süresiz"}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{new Date(e.created_at).toLocaleString("tr-TR")}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDelete(e.id)}
                          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                  {entries.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-400">Kayıt bulunamadı</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
