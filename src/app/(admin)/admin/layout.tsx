"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const adminAccess = Cookies.get("xipsoft_admin_access");
    const session = Cookies.get("xipsoft_session");
    const isPublicAdminPage = pathname === "/admin/login" || pathname === "/admin/verify-2fa" || pathname.startsWith("/admin/verify-2fa");

    if (!isPublicAdminPage && (!adminAccess || !session)) {
      router.replace("/admin/login");
    }
  }, [pathname, router]);

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col ml-[240px]">
        <AdminHeader />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
