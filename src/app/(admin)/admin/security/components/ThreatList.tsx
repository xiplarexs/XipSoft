"use client";

import { Plus, Trash2 } from "lucide-react";
import type { IPBlockEntry, CountryBlockEntry } from "./types";
import { COUNTRIES } from "./types";

interface IPThreatListProps {
  entries: IPBlockEntry[];
  loading: boolean;
  error: string | null;
  form: { ip_address: string; reason: string; is_permanent: boolean; expires_hours: number };
  onFormChange: (form: { ip_address: string; reason: string; is_permanent: boolean; expires_hours: number }) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete: (id: number) => void;
  onClearAll: () => void;
  submitting: boolean;
}

export function IPThreatList({
  entries,
  loading,
  error,
  form,
  onFormChange,
  onSubmit,
  onDelete,
  onClearAll,
  submitting,
}: IPThreatListProps) {
  return (
    <div>
      <form onSubmit={onSubmit} className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">IP Adresi</label>
            <input
              type="text"
              value={form.ip_address}
              onChange={(e) => onFormChange({ ...form, ip_address: e.target.value })}
              placeholder="192.168.1.1"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Sebep</label>
            <input
              type="text"
              value={form.reason}
              onChange={(e) => onFormChange({ ...form, reason: e.target.value })}
              placeholder="Spam, DDoS saldırısı vb."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.is_permanent}
              onChange={(e) => onFormChange({ ...form, is_permanent: e.target.checked })}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            Kalıcı engelle
          </label>
          {!form.is_permanent && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <label>Süre (saat):</label>
              <input
                type="number"
                min={1}
                value={form.expires_hours}
                onChange={(e) => onFormChange({ ...form, expires_hours: Number(e.target.value) })}
                className="w-20 rounded-lg border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
            </div>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="ml-auto inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {submitting ? "Ekleniyor..." : "IP Engelle"}
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
                onClick={onClearAll}
                className="text-xs font-medium text-red-600 hover:text-red-700"
              >
                geçici engelleri temizle
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-3">IP Adresi</th>
                  <th className="px-4 py-3">Sebep</th>
                  <th className="px-4 py-3">Tür</th>
                  <th className="px-4 py-3">Eklenme Tarihi</th>
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
                        onClick={() => onDelete(e.id)}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Kaldır
                      </button>
                    </td>
                  </tr>
                ))}
                {entries.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400">Kayıtlı engelli IP bulunamadı.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

interface CountryThreatListProps {
  entries: CountryBlockEntry[];
  loading: boolean;
  error: string | null;
  form: { country_code: string; custom_code: string; reason: string };
  onFormChange: (form: { country_code: string; custom_code: string; reason: string }) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete: (code: string) => void;
  submitting: boolean;
}

export function CountryThreatList({
  entries,
  loading,
  error,
  form,
  onFormChange,
  onSubmit,
  onDelete,
  submitting,
}: CountryThreatListProps) {
  return (
    <div>
      <form onSubmit={onSubmit} className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Ülke Seçin</label>
            <select
              value={form.country_code}
              onChange={(e) => onFormChange({ ...form, country_code: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              required
            >
              <option value="">Seçiniz...</option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
              <option value="custom">Özel kod gir...</option>
            </select>
          </div>
          {form.country_code === "custom" && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">2 Haneli Ülke Kodu</label>
              <input
                type="text"
                maxLength={2}
                value={form.custom_code}
                onChange={(e) => onFormChange({ ...form, custom_code: e.target.value.toUpperCase() })}
                placeholder="Örn: US, CN"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                required
              />
            </div>
          )}
          <div className={form.country_code === "custom" ? "md:col-span-1" : "md:col-span-2"}>
            <label className="block text-xs font-medium text-gray-600 mb-1">Sebep</label>
            <input
              type="text"
              value={form.reason}
              onChange={(e) => onFormChange({ ...form, reason: e.target.value })}
              placeholder="Siber saldırı riskleri, hedef dısı cografya vb."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>
        </div>
        <div className="flex">
          <button
            type="submit"
            disabled={submitting}
            className="ml-auto inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {submitting ? "Ekleniyor..." : "Ülkeyi Engelle"}
          </button>
        </div>
      </form>

      {loading && <p className="text-gray-500 text-sm">Yükleniyor...</p>}
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {!loading && !error && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">Toplam {entries.length} engelli ülke</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-3">Ülke Kodu</th>
                  <th className="px-4 py-3">Sebep</th>
                  <th className="px-4 py-3">Eklenme Tarihi</th>
                  <th className="px-4 py-3 text-right">Islem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {entries.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold text-gray-900 flex items-center gap-2">
                      <span className="inline-block w-6 h-4 bg-gray-100 border border-gray-200 text-[10px] text-center font-mono align-middle leading-4">
                        {e.country_code}
                      </span>
                      {e.country_code}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{e.reason}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{new Date(e.created_at).toLocaleString("tr-TR")}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onDelete(e.country_code)}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Kaldır
                      </button>
                    </td>
                  </tr>
                ))}
                {entries.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-400">Kayıtlı engelli ülke bulunamadı.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
