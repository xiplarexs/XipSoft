import { FileText, Search } from "lucide-react";
import pool from "@/lib/database";

export const metadata = {
  title: "Sayfalar | XipSoft Admin",
  robots: { index: false, follow: false },
};

export default async function PagesListPage() {
  let pages: any[] = [];
  let error: string | null = null;

  try {
    // Blog sayfaları
    const result = await pool.query(
      `SELECT id, title, slug, status, description, published_at, created_at, deleted_at
       FROM blog_posts
       ORDER BY created_at DESC
       LIMIT 50`
    );
    pages = result.rows;
  } catch (e: any) {
    error = e.message;
  }

  const statusBadge = (status: string, deleted: boolean) => {
    if (deleted) return <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-500">Silinmis</span>;
    switch (status) {
      case "published": return <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700">Yayında</span>;
      case "draft": return <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-yellow-100 text-yellow-700">Taslak</span>;
      default: return <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-500">{status}</span>;
    }
  };

  return (
    <div className="text-gray-900">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-8 h-8 text-indigo-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sayfalar</h1>
            <p className="text-sm text-gray-500">Blog yazıları ve içerik yönetimi</p>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Baslık</th>
                <th className="px-4 py-3 text-left">Slug</th>
                <th className="px-4 py-3 text-left">Durum</th>
                <th className="px-4 py-3 text-left">Tarih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{page.title}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">/{page.slug}</td>
                  <td className="px-4 py-3">{statusBadge(page.status, !!page.deleted_at)}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {page.published_at
                      ? new Date(page.published_at).toLocaleDateString("tr-TR")
                      : new Date(page.created_at).toLocaleDateString("tr-TR")}
                  </td>
                </tr>
              ))}
              {pages.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-400">Sayfa bulunamadı.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
