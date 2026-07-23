"use client";

import { ShieldBan, Globe, ShieldAlert } from "lucide-react";

interface SecurityOverviewProps {
  activeTab: "ip" | "country";
  onTabChange: (tab: "ip" | "country") => void;
}

export default function SecurityOverview({ activeTab, onTabChange }: SecurityOverviewProps) {
  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <ShieldAlert className="w-8 h-8 text-indigo-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">güvenlik Yönetimi</h1>
          <p className="text-sm text-gray-500">IP ve Cografi konumlara dayalı anlık filtreleme ayarları</p>
        </div>
      </div>

      <div className="flex border-b border-gray-200 mb-8">
        <button
          onClick={() => onTabChange("ip")}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
            activeTab === "ip"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          <ShieldBan className="w-4 h-4" />
          IP Engelleme
        </button>
        <button
          onClick={() => onTabChange("country")}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
            activeTab === "country"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          <Globe className="w-4 h-4" />
          Ülke Engelleme
        </button>
      </div>
    </>
  );
}
