"use client";

import { useState, useEffect } from "react";
import { Upload, Trash2, Image, FileText, Search, Grid, List } from "lucide-react";

type MediaFile = {
  name: string;
  path: string;
  size: number;
  sizeFormatted: string;
  type: string;
  ext: string;
  modifiedAt: string;
  isImage: boolean;
};

export default function MediaClient() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [folder, setFolder] = useState("images");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/media?folder=${folder}`);
      const json = await res.json();
      if (json.ok) setFiles(json.files || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { loadFiles(); }, [folder]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const res = await fetch("/api/admin/media", { method: "POST", body: formData });
      const json = await res.json();
      if (json.ok) {
        await loadFiles();
      } else {
        alert(json.error);
      }
    } catch (err: any) {
      alert("Yükleme hatası: " + err.message);
    }
    setUploading(false);
    e.target.value = "";
  };

  const handleDelete = async (path: string) => {
    if (!confirm("Bu dosyayı silmek istediGinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/media?path=${encodeURIComponent(path)}`, { method: "DELETE" });
      const json = await res.json();
      if (json.ok) {
        setFiles((prev) => prev.filter((f) => f.path !== path));
        if (selectedFile?.path === path) setSelectedFile(null);
      } else {
        alert(json.error);
      }
    } catch (err: any) {
      alert("Silme hatası: " + err.message);
    }
  };

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const typeIcon = (type: string) => {
    switch (type) {
      case "image": return <Image className="w-5 h-5 text-blue-500" />;
      case "document": return <FileText className="w-5 h-5 text-red-500" />;
      default: return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="text-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Upload className="w-8 h-8 text-indigo-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Medya Yönetimi</h1>
              <p className="text-sm text-gray-500">{files.length} dosya</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 cursor-pointer disabled:opacity-50">
              <Upload className="w-4 h-4" />
              {uploading ? "Yükleniyor..." : "Dosya Yükle"}
              <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
          </div>
        </div>

        {/* Filtreler */}
        <div className="flex items-center gap-3 mb-4">
          <select
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none"
          >
            <option value="images">images</option>
            <option value="media">media</option>
            <option value="uploads">uploads</option>
          </select>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Dosya ara..."
              className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${viewMode === "grid" ? "bg-indigo-50 text-indigo-600" : "text-gray-500"}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${viewMode === "list" ? "bg-indigo-50 text-indigo-600" : "text-gray-500"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading && <p className="text-gray-500 text-sm">Yükleniyor...</p>}

        {/* Grid View */}
        {!loading && viewMode === "grid" && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredFiles.map((file) => (
              <div
                key={file.path}
                onClick={() => setSelectedFile(file)}
                className={`rounded-xl border p-3 cursor-pointer transition-all hover:shadow-md ${
                  selectedFile?.path === file.path ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {file.isImage ? (
                  <div className="aspect-square bg-gray-100 rounded-lg mb-2 overflow-hidden flex items-center justify-center">
                    <img src={file.path} alt={file.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ) : (
                  <div className="aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                    {typeIcon(file.type)}
                  </div>
                )}
                <p className="text-xs font-medium text-gray-700 truncate">{file.name}</p>
                <p className="text-[10px] text-gray-400">{file.sizeFormatted}</p>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {!loading && viewMode === "list" && (
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Dosya</th>
                  <th className="px-4 py-3 text-left">Boyut</th>
                  <th className="px-4 py-3 text-left">Tür</th>
                  <th className="px-4 py-3 text-left">Tarih</th>
                  <th className="px-4 py-3 text-right">Islem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredFiles.map((file) => (
                  <tr key={file.path} className="hover:bg-gray-50">
                    <td className="px-4 py-3 flex items-center gap-2">
                      {typeIcon(file.type)}
                      <span className="font-medium text-gray-700">{file.name}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{file.sizeFormatted}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{file.type}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(file.modifiedAt).toLocaleString("tr-TR")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(file.path)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Seçili Dosya Detay */}
        {selectedFile && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
            <div className="max-w-6xl mx-auto flex items-center gap-4">
              {selectedFile.isImage && (
                <img src={selectedFile.path} alt={selectedFile.name} className="w-16 h-16 object-cover rounded-lg" />
              )}
              <div className="flex-1">
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">{selectedFile.path} — {selectedFile.sizeFormatted}</p>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(selectedFile.path)}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                Yolu Kopyala
              </button>
              <button
                onClick={() => handleDelete(selectedFile.path)}
                className="rounded-lg bg-red-100 px-3 py-1.5 text-sm text-red-700 hover:bg-red-200"
              >
                <Trash2 className="w-4 h-4 inline mr-1" />
                Sil
              </button>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                Kapat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
