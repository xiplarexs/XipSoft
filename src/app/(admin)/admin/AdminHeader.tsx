"use client";

import { useRouter } from "next/navigation";
import { LogOut, Bell, User } from "lucide-react";
import { logoutAction } from "@/app/_actions/auth-actions";

export default function AdminHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    router.replace("/admin/login");
  };

  return (
    <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6 flex-shrink-0">
      <div className="text-sm text-gray-500">
        XipSoft Admin Panel
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <User className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="font-medium">Admin</span>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Çıkıs
        </button>
      </div>
    </header>
  );
}
