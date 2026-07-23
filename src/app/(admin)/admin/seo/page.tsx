import type { Metadata } from "next";
import { getSEODashboardData } from "@/app/_actions/seo-actions";
import { Search } from "lucide-react";
import SEOClient from "./SEOClient";

export const metadata: Metadata = {
  title: "SEO | Admin XipSoft",
  robots: { index: false, follow: false },
};

export default async function SEOPage() {
  const data = await getSEODashboardData();

  if ((data as any).error) {
    return (
      <div className="text-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Search className="w-8 h-8 text-indigo-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SEO Dashboard</h1>
              <p className="text-sm text-gray-500">Site SEO durumu, performans ve denetim</p>
            </div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            Veriler yüklenemedi. Lütfen tekrar deneyin.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Search className="w-8 h-8 text-indigo-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">SEO Dashboard</h1>
            <p className="text-sm text-gray-500">Site SEO durumu, performans ve denetim</p>
          </div>
        </div>

        {/* Hızlı Durum Özeti */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="text-sm text-gray-500 mb-1">Sitemap</div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${data.sitemap?.status === "ok" ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-sm font-medium">{data.sitemap?.urlCount || 0} URL</span>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="text-sm text-gray-500 mb-1">Blog Yazısı</div>
            <span className="text-sm font-medium">{data.publishedPosts} yayında</span>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="text-sm text-gray-500 mb-1">Og Image</div>
            <span className={`text-sm font-medium ${data.ogImage?.exists ? "text-green-600" : "text-red-600"}`}>
              {data.ogImage?.exists ? "Mevcut" : "Eksik"}
            </span>
          </div>
        </div>

        {/* Blog Meta Uyarıları */}
        {data.blogMeta && (Number(data.blogMeta.missing_desc) > 0 || Number(data.blogMeta.missing_slug) > 0) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <h3 className="text-sm font-semibold text-yellow-800 mb-2">Blog Meta Uyarıları</h3>
            <div className="space-y-1 text-sm text-yellow-700">
              {Number(data.blogMeta.missing_desc) > 0 && (
                <p>{data.blogMeta.missing_desc} yazıda meta açıklama eksik</p>
              )}
              {Number(data.blogMeta.missing_slug) > 0 && (
                <p>{data.blogMeta.missing_slug} yazıda slug eksik</p>
              )}
            </div>
          </div>
        )}

        {/* Interaktif Bilesenler */}
        <SEOClient />
      </div>
    </div>
  );
}
