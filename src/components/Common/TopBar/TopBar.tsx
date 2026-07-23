"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Github, Send, Users, Search, LogIn, UserPlus, Globe } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/utils";
import UserAvatar from "@/components/Auth/UserAvatar";
import { BRAND_COLORS } from "@/config/brand.config";

const SOCIAL_LINKS = [
  { icon: Github, href: "https://github.com/xiplarexs",                   label: "gitHub",   color: BRAND_COLORS.secondary },
  { icon: Send,   href: "https://t.me/xipsoft",                            label: "Telegram", color: BRAND_COLORS.primary },
  { icon: Users,  href: "", label: "Facebook", color: BRAND_COLORS.accent },
];

const ROLE_COLORS: Record<string, string> = {
  admin:     BRAND_COLORS.accent,
  moderator: BRAND_COLORS.gold,
  user:      BRAND_COLORS.secondary,
};

/* LangDropdown TopBar'dan kaldırıldı — Homebar'da mevcut */

/* ── Badge ── */
const Badge = ({ count }: { count: number }) =>
  count > 0 ? (
    <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] flex items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white px-0.5">
      {count > 9 ? "9+" : count}
    </span>
  ) : null;

/* ── Bildirim ve Mesaj UI kaldırıldı */

/* ── TopBar ── */
const TopBar = () => {
  const { user, isAuthenticated, loading: authLoading, signOut, setAuthModalOpen } = useAuth();
  const { locale, setLocale } = useLanguage();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  const roleColor = user ? (ROLE_COLORS[user.role] ?? BRAND_COLORS.secondary) : BRAND_COLORS.secondary;


  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-end backdrop-blur-xl border-b border-fire-orange bg-zinc-950/80"
      style={{ paddingTop: 'env(safe-area-inset-top)', minHeight: 'calc(3rem + env(safe-area-inset-top))' }}
    >
      {/* Prism bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] overflow-hidden">
        <motion.div className="h-full w-[200%]"
          style={{ background: "linear-gradient(90deg,transparent,#000000 15%,#f97316 50%,#000000 85%,transparent)" }}
          animate={{ x: ["-50%", "0%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="w-full max-w-screen-2xl mx-auto px-3 sm:px-4 h-12 flex items-center justify-between gap-2 overflow-hidden">

        {/* Sol — Sosyal medya */}
        <div className="hidden sm:flex items-center gap-3">
          {SOCIAL_LINKS.map(({ icon: Icon, href, label, color }) => (
            href ? (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label} - yeni sekmede açılır`}
                className="text-zinc-600 hover:text-zinc-300 transition-colors duration-200">
                <motion.div whileHover={{ scale: 1.2 }} transition={{ duration: 0.15 }}>
                  <Icon className="w-3.5 h-3.5" style={{ color }} aria-hidden="true" />
                </motion.div>
              </a>
            ) : null
          ))}
        </div>

        {/* Orta — Arama */}
        <form onSubmit={handleSearch} className="flex items-center min-w-0 flex-1 sm:flex-none max-w-[180px] sm:max-w-none">
          <motion.div className="relative flex min-w-0 items-center w-full"
            animate={{ width: searchFocused ? 180 : 120 }} transition={{ duration: 0.2 }}
            style={{ minWidth: 80 }}>
            <Search className="absolute left-2 w-3 h-3 pointer-events-none text-zinc-600" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
              placeholder="Ara..."
              className="w-full h-6 pl-7 pr-2.5 rounded-full border border-white/[0.06] bg-white/[0.04] text-zinc-300 placeholder-zinc-600 focus:border-purple-500/40 focus:outline-none transition-all duration-200"
            />
          </motion.div>
        </form>

        {/* Sag — Araçlar */}
        <div className="flex items-center gap-2">

          <button
            onClick={() => setLocale(locale === 'tr' ? 'en' : 'tr')}
            className="hidden sm:flex items-center gap-1 text-zinc-500 hover:text-zinc-200 transition-colors text-[11px] -mono"
            aria-label={locale === 'tr' ? 'Switch to English' : 'Türkçeye geç'}
          >
            <Globe className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="uppercase">{locale === 'tr' ? 'TR' : 'EN'}</span>
          </button>
          <div className="hidden sm:block w-px h-3 bg-white/[0.08]" />

          {!mounted || authLoading ? (
            <div className="w-16 h-4 rounded bg-white/[0.04]" />
          ) : !authLoading && isAuthenticated && user ? (
            <>
              {/* Nick + rol rengi */}
              <Link href={`/x/${user.display_name}`}
                className="hidden sm:flex items-center gap-1.5 -mono text-[12px] hover:opacity-80 transition-opacity"
                style={{ color: roleColor }}>
                <span className="text-zinc-600">[</span>
                <span>{user.display_name || user.email}</span>
                <span className="text-zinc-600">]</span>
              </Link>

              <div className="w-px h-3 bg-white/[0.08]" />

              {/* User Avatar Menu */}
              <UserAvatar />
            </>
          ) : (
            <>
              <Link href="/register"
                aria-label="Giriş Yap"
                className="flex items-center gap-1.5 transition-colors text-[12px] -mono text-zinc-400 hover:text-zinc-200">
                <LogIn className="w-3 h-3" />
                <span className="hidden sm:inline">GİRİŞ</span>
              </Link>
              <div className="w-px h-3 bg-white/[0.08]" />
              <Link href="/register?tab=register"
                aria-label="Kayıt Ol"
                className="flex items-center gap-1.5 transition-colors text-[12px] -mono text-zinc-400 hover:text-orange-400">
                <UserPlus className="w-3 h-3" />
                <span className="hidden sm:inline">KAYIT OL</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
