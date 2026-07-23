"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Send,
  LogOut,
  Settings,
  BarChart3,
  Shield,
  Heart,
  Search,
  ShoppingBag,
  Globe,
  Upload,
  Zap,
} from "lucide-react";
import { logoutAction } from "@/app/_actions/auth-actions";

const NAV_ITEMS = [
  { label: "Dashboard",   href: "/admin",               icon: LayoutDashboard },
  { label: "Blog",        href: "/admin/blog",          icon: FileText },
  { label: "Sayfalar",    href: "/admin/cms/pages",     icon: Globe },
  { label: "Medya",       href: "/admin/cms/media",     icon: Upload },
  { label: "Siparisler",  href: "/admin/orders",        icon: ShoppingBag },
  { label: "Analytics",   href: "/admin/analytics",     icon: BarChart3 },
  { label: "SEO",         href: "/admin/seo",           icon: Search },
  { label: "Güvenlik",   href: "/admin/security",      icon: Shield },
  { label: "Monitör",    href: "/admin/monitoring",    icon: Heart },
  { label: "Otomasyon",  href: "/admin/automation",    icon: Zap },
  { label: "Telegram",   href: "/admin/telegram",      icon: Send },
  { label: "Ayarlar",    href: "/admin/settings",      icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    router.replace("/admin/login");
  };

  return (
    <aside style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "240px",
      height: "100vh",
      background: "#fff",
      borderRight: "1px solid #e5e7eb",
      display: "flex",
      flexDirection: "column",
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{
        padding: "1.5rem 1.25rem 1.25rem",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
      }}>
        <img src="/media/logo.webp" alt="XipSoft" style={{ height: "28px", width: "auto" }} />
        <div>
          <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#111" }}>XipSoft</div>
          <div style={{ fontSize: "0.7rem", color: "#6b7280", letterSpacing: "0.08em" }}>ADMIN PANEL</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "1rem 0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.65rem",
                padding: "0.6rem 0.875rem",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: active ? 600 : 400,
                color: active ? "#4f46e5" : "#374151",
                background: active ? "#eef2ff" : "transparent",
                textDecoration: "none",
                transition: "background 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLAnchorElement).style.background = "#f9fafb";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                }
              }}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: "0.75rem", borderTop: "1px solid #e5e7eb" }}>
        <button
          type="button"
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.65rem",
            width: "100%",
            padding: "0.6rem 0.875rem",
            borderRadius: "0.5rem",
            fontSize: "0.875rem",
            fontWeight: 400,
            color: "#ef4444",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#fef2f2"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
        >
          <LogOut size={16} />
          Çıkıs Yap
        </button>
      </div>
    </aside>
  );
}
