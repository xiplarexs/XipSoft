"use client";

import { PenLine } from "lucide-react";
import { BlogFormState, EMPTY_FORM } from "./types";

type Props = {
  form: BlogFormState;
  setForm: React.Dispatch<React.SetStateAction<BlogFormState>>;
  editId: number | null;
  setEditId: React.Dispatch<React.SetStateAction<number | null>>;
  setTab: (tab: "published" | "draft" | "trash" | "new") => void;
  submitting: boolean;
  formError: string | null;
  formSuccess: string | null;
  handleSubmit: (e: React.FormEvent) => void;
};

export function BlogForm({
  form,
  setForm,
  editId,
  setEditId,
  setTab,
  submitting,
  formError,
  formSuccess,
  handleSubmit,
}: Props) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Baslık *</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Yazı baslıGı"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2647]/30"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Slug (opsiyonel)</label>
          <input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder="otomatik-olusturulur"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2647]/30"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Açıklama (SEO)</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={2}
          placeholder="Kısa açıklama, meta description olarak kullanılır"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2647]/30 resize-none"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Içerik *</label>
        <textarea
          required
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          rows={10}
          placeholder="Yazı içeriGi (düz metin veya JSON)"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#0A2647]/30 resize-y"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Etiketler (virgülle ayırın)</label>
          <input
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            placeholder="nextjs, react, typescript"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2647]/30"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Kapak Görseli URL</label>
          <input
            value={form.cover_image_url}
            onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })}
            placeholder="https://..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2647]/30"
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-700 font-medium">Durum:</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as "draft" | "published" })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0A2647]/30"
          >
            <option value="draft">Taslak</option>
            <option value="published">Yayınla</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => { setTab("published"); setEditId(null); setForm(EMPTY_FORM); }}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            Iptal
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50 transition-colors"
            style={{ background: "#0A2647" }}
          >
            <PenLine className="w-4 h-4" />
            {submitting ? "Kaydediliyor..." : editId ? "Güncelle" : "Olustur"}
          </button>
        </div>
      </div>
      {formError && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{formError}</p>}
      {formSuccess && <p className="text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">{formSuccess}</p>}
    </form>
  );
}
