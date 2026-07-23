"use client";

import {
  Trash2, RotateCcw, Eye, EyeOff,
  Search, PenLine, Archive, CheckCircle2,
} from "lucide-react";
import { Post, DeletedPost } from "./types";

function StatusBadge({ status }: { status: string }) {
  if (status === "published")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="w-3 h-3" /> Yayında
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
      <EyeOff className="w-3 h-3" /> Taslak
    </span>
  );
}

function EmptyRow({ cols, message }: { cols: number; message: string }) {
  return (
    <tr>
      <td colSpan={cols} className="px-4 py-10 text-center text-gray-400 text-sm">
        {message}
      </td>
    </tr>
  );
}

type BlogListProps = {
  posts: Post[];
  deleted: DeletedPost[];
  filtered: Post[];
  loading: boolean;
  search: string;
  setSearch: (v: string) => void;
  tab: "published" | "draft" | "trash" | "new";
  handleEdit: (post: Post) => void;
  handleDelete: (id: number) => void;
  handleRestore: (id: number) => void;
  handleHardDelete: (id: number) => void;
};

export function BlogList({
  posts,
  deleted,
  filtered,
  loading,
  search,
  setSearch,
  tab,
  handleEdit,
  handleDelete,
  handleRestore,
  handleHardDelete,
}: BlogListProps) {
  return (
    <>
      {(tab === "published" || tab === "draft") && (
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Baslık veya slug ara..."
            className="w-full pl-9 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2647]/30"
          />
        </div>
      )}

      {(tab === "published" || tab === "draft") && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Yükleniyor...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-4 py-3">Baslık</th>
                    <th className="px-4 py-3">Durum</th>
                    <th className="px-4 py-3">Etiketler</th>
                    <th className="px-4 py-3">Yazar</th>
                    <th className="px-4 py-3">Tarih</th>
                    <th className="px-4 py-3 text-right">Islem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.length === 0 && <EmptyRow cols={6} message="Yazı bulunamadı" />}
                  {filtered.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 truncate max-w-[260px]">{post.title}</p>
                        <p className="text-xs text-gray-400 font-mono">/blog/{post.slug}</p>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={post.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {(Array.isArray(post.tags) ? post.tags : []).slice(0, 3).map((tag) => (
                            <span key={tag} className="px-1.5 py-0.5 rounded text-[10px] bg-gray-100 text-gray-600">{tag}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{post.author_name ?? "—"}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {new Date(post.created_at).toLocaleDateString("tr-TR")}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEdit(post)}
                            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-[#0A2647] hover:bg-[#0A2647]/5 transition-colors"
                          >
                            <PenLine className="w-3.5 h-3.5" /> Düzenle
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === "trash" && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-3">Baslık</th>
                  <th className="px-4 py-3">Silinme Tarihi</th>
                  <th className="px-4 py-3">Yazar</th>
                  <th className="px-4 py-3 text-right">Islem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {deleted.length === 0 && <EmptyRow cols={4} message="Çöp kutusunda yazı yok" />}
                {deleted.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-700 truncate max-w-[260px]">{post.title}</p>
                      <p className="text-xs text-gray-400 font-mono">/blog/{post.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(post.deleted_at).toLocaleString("tr-TR")}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{post.author_name ?? "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleRestore(post.id)}
                          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Geri Yükle
                        </button>
                        <button
                          onClick={() => handleHardDelete(post.id)}
                          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Kalıcı Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
