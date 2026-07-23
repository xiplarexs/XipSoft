"use client";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useState, useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
import { teklifModal } from "@/components/Common/TeklifModal/TeklifModal";
import { cn } from "@/utils";
import Container from "@/components/Common/Container/Container";
import { ChevronDown, Zap } from "lucide-react";
import { linkKeys } from "./constants";
import { LogoWithSpin } from "./LogoWithSpin";
import { DesktopNav } from "./DesktopNav";
import { MenuIcon } from "./MenuIcon";
import { MobileNavLink } from "./MobileNavLink";
import { MobileServiceItems } from "./MobileServiceItems";
import { MobileProductItems } from "./MobileProductItems";
import { navLabel } from "@/utils/latinize";

const Navbar = () => {
  const path = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const t = useTranslations("nav");
  const mm = "";
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const [site, setSite] = useState('space-grotesk');


  //  preference'i yükle
  useEffect(() => {
    const saved = localStorage.getItem('site-') || 'space-grotesk';
    setSite(saved);
  }, []);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 20);
      if (currentY > 80 && currentY > lastScrollY.current) setHidden(true);
      else setHidden(false);
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: hidden && !mobileOpen ? -80 : 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed left-0 right-0 z-40 w-full transition-[background,box-shadow] duration-500",
          scrolled ? "bg-obsidian/70 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]" : "bg-obsidian/30 backdrop-blur-xl"
        )}
        style={{ top: 'calc(3rem + env(safe-area-inset-top))' }}
      >
        {/* Navbar altı — ince sabit çizgi */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/[0.07]" />
        <Container className="flex flex-row items-center justify-between h-24 px-2 lg:px-4 xl:px-6">

          {/* Logo - En solda, menü ile aynı hizada */}
          <div className="flex items-center h-full">
            <LogoWithSpin />
          </div>

          {/* Desktop nav */}
          <div className="flex items-center h-full">
            <DesktopNav path={path} t={t} mm={mm} />
          </div>

          {/* Mobile hamburger — min 44x44px touch target (WCAg AA) */}
          <motion.button className="lg:hidden relative p-3 z-50 min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu"
            whileTap={{ scale: 0.9 }}>
            <MenuIcon isOpen={mobileOpen} />
          </motion.button>
        </Container>
      </motion.nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-30 lg:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="absolute inset-0"
              style={{ background: "radial-gradient(ellipse at top right,rgba(167,139,250,0.08),transparent 50%),radial-gradient(ellipse at bottom left,rgba(34,211,238,0.05),transparent 50%),#09090bf5" }} />
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-6 sm:left-8 w-[1px] h-full bg-white/[0.03]" />
              <div className="absolute top-0 right-6 sm:right-8 w-[1px] h-full bg-white/[0.03]" />
            </div>

            <div className="relative h-full flex flex-col px-6 sm:px-12 pt-20 pb-8 overflow-y-auto" style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}>
              <div className="mb-4 sm:mb-8">
                <span className={cn("-mono text-[10px] uppercase tracking-[0.3em] text-zinc-600", mm)}>
                  {t("navigation")}
                </span>
              </div>

              <nav className="flex flex-col gap-1">
                {linkKeys.map((link, i) => (
                  <MobileNavLink key={link.key} href={link.href} label={t(link.key)}
                    isActive={path === link.href} index={i} onClick={closeMobile} mm={mm} />
                ))}

                {/* Mobile urunler accordion */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: 0.05 + linkKeys.length * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                  <button className="group relative w-full py-1.5 sm:py-3 flex items-center gap-4"
                    onClick={() => setMobileProductsOpen((v) => !v)}>
                    <span className="-mono text-xs text-zinc-600 tabular-nums">{String(linkKeys.length + 1).padStart(2, "0")}</span>
                    <span className={cn("-navbar text-[14px] xs:text-xl sm:text-3xl font-bold tracking-tight text-zinc-400 group-hover:text-white transition-colors", mm)}>
                      {navLabel("Ürünler")}
                    </span>
                    <motion.span animate={{ rotate: mobileProductsOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown className="w-4 h-4 text-zinc-600" />
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {mobileProductsOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                        className="overflow-hidden pl-10 flex flex-col gap-2 pb-2">
                        <MobileProductItems onClose={closeMobile} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="absolute bottom-0 left-8 right-0 h-[1px] bg-white/5" />
                </motion.div>

                {/* Mobile Hizmetler accordion */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: 0.05 + linkKeys.length * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                  <button className="group relative w-full py-1.5 sm:py-3 flex items-center gap-4"
                    onClick={() => setMobileServicesOpen((v) => !v)}>
                    <span className="-mono text-xs text-zinc-600 tabular-nums">{String(linkKeys.length + 2).padStart(2, "0")}</span>
                    <span className={cn("-navbar text-[14px] xs:text-xl sm:text-3xl font-bold tracking-tight text-zinc-400 group-hover:text-white transition-colors", mm)}>
                      {navLabel(t("services"))}
                    </span>
                    <motion.span animate={{ rotate: mobileServicesOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown className="w-4 h-4 text-zinc-600" />
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {mobileServicesOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                        className="overflow-hidden pl-10 flex flex-col gap-2 pb-2">
                        <MobileServiceItems onClose={closeMobile} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="absolute bottom-0 left-8 right-0 h-[1px] bg-white/5" />
                </motion.div>
              </nav>

              {/* Bottom */}
              <div className="mt-auto pt-6">
                {/* Teklif Al */}
                <button onClick={() => { closeMobile(); teklifModal.open(); }}
                  className="relative w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-zinc-950 bg-gradient-to-r from-rose-400 via-orange-400 to-yellow-400 shadow-[0_0_20px_rgba(249,115,22,0.4)] mb-4 overflow-hidden">
                  <span className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                  <Zap className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">{navLabel(t("getQuote"))}</span>
                </button>

                <div className="h-[1px] w-full bg-white/5 mb-3" />
                <div className="flex items-center justify-between">
                  <p className={cn("-mono text-[10px] text-zinc-600 tracking-widest uppercase truncate mr-2", mm)}>
                    {t("brandName")}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
export default Navbar;
