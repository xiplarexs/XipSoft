"use client";

import { cn } from "@/utils";
import Container from "../Container/Container";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { usePathname } from "next/navigation";
import { Github, Heart, ArrowUpRight, Send, Home, Info, BookOpen, Mail, Code, Shield, FileText, Cookie } from "lucide-react";
import { useTranslations } from "next-intl";

const FloatingOrb = ({
  size,
  color,
  x,
  y,
  delay,
  duration,
}: {
  size: number;
  color: string;
  x: string;
  y: string;
  delay: number;
  duration: number;
}) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: size,
      height: size,
      left: x,
      top: y,
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      filter: "blur(60px)",
    }}
    animate={{
      y: [0, -15, 8, -10, 0],
      x: [0, 8, -6, 10, 0],
      scale: [1, 1.1, 0.95, 1.08, 1],
      opacity: [0.15, 0.3, 0.12, 0.25, 0.15],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

const FooterLink = ({
  href,
  children,
  color = "#f97316",
  external = false,
  index,
  isInView,
  icon: Icon,
  isActive = false,
}: {
  href: string;
  children: React.ReactNode;
  color?: string;
  external?: boolean;
  index: number;
  isInView: boolean;
  icon?: React.FC<React.SVgProps<SVgSVgElement>>;
  isActive?: boolean;
}) => {
  const linkProps = external
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  const Component = external ? "a" : Link;

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, x: -12 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
      transition={{
        duration: 0.45,
        delay: 0.3 + index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Component
        href={href}
        {...linkProps}
        className={cn(
          "relative flex items-center gap-2.5 text-sm py-1.5 px-2 rounded-lg transition-all duration-300",
          isActive
            ? "text-white hover:bg-white/[0.04]"
            : "text-zinc-400 group-hover:text-white hover:bg-white/[0.04]"
        )}
      >
        {Icon && (
          <span className={cn("shrink-0 transition-opacity duration-300", isActive ? "opacity-100" : "opacity-50 group-hover:opacity-100")}>
            <Icon className="w-3.5 h-3.5" style={{ color }} />
          </span>
        )}
        <span className={cn(
          "relative z-10 after:absolute after:-bottom-0.5 after:left-0 after:h-px after:bg-violet-400 after:transition-all after:duration-300",
          isActive
            ? "after:w-full"
            : "after:w-0 group-hover:after:w-full"
        )}>
          {children}
        </span>
        <span className={cn(
          "ml-auto transition-all duration-300 -translate-x-1 group-hover:translate-x-0",
          isActive ? "opacity-60" : "opacity-0 group-hover:opacity-100"
        )}>
          <ArrowUpRight className="w-3 h-3" style={{ color }} />
        </span>
      </Component>
    </motion.div>
  );
};

const SocialLink = ({
  href,
  icon: Icon,
  label,
  color,
  index,
  isInView,
}: {
  href: string;
  icon: React.FC<React.SVgProps<SVgSVgElement>>;
  label: string;
  color: string;
  index: number;
  isInView: boolean;
}) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="group relative flex items-center gap-3 py-1.5"
    initial={{ opacity: 0, y: 15 }}
    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
    transition={{
      duration: 0.5,
      delay: 0.5 + index * 0.12,
      ease: [0.22, 1, 0.36, 1],
    }}
  >
    <div className="relative flex items-center justify-center w-7 h-7 transition-all duration-300 group-hover:scale-110">
      <Icon className="w-4 h-4" style={{ color }} />
    </div>

    <span
      className={cn(
        "text-sm transition-colors duration-300 relative after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-violet-400 after:transition-all after:duration-300",
        "text-zinc-500 group-hover:text-zinc-300"
      )}
    >
      {label}
    </span>

    <span className="opacity-0 group-hover:opacity-70 transition-opacity duration-300">
      <ArrowUpRight className="w-3 h-3" style={{ color }} />
    </span>
  </motion.a>
);

const HeartPulse = () => (
  <motion.span
    className="inline-flex"
    animate={{
      scale: [1, 1.25, 1, 1.2, 1],
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      repeatDelay: 2,
      ease: "easeInOut",
    }}
  >
    <Heart className="w-3.5 h-3.5 text-prism-rose fill-prism-rose" />
  </motion.span>
);

const StatusRow = ({
  icon,
  label,
  status,
}: {
  icon: React.ReactNode;
  label: string;
  status: "ok" | "error" | "disabled" | null;
}) => {
  const dot =
    status === "ok"
      ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]"
      : status === "error"
      ? "bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.5)]"
      : status === "disabled"
      ? "bg-zinc-600"
      : "bg-zinc-700 animate-pulse";

  const text =
    status === "ok"
      ? "Aktif"
      : status === "error"
      ? "Hata"
      : status === "disabled"
      ? "Devre Dısı"
      : "...";

  return (
    <div className="flex items-center gap-2 text-[11px] text-zinc-500">
      <span className="text-zinc-600">{icon}</span>
      <span>{label}</span>
      <span className="ml-auto flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
        <span className={status === "ok" ? "text-emerald-500" : status === "error" ? "text-red-400" : "text-zinc-600"}>
          {text}
        </span>
      </span>
    </div>
  );
};

const StatCard = ({ value, label }: { value: number | string; label: string }) => (
  <div className="flex flex-col items-center gap-0.5 bg-white/[0.03] border border-white/[0.06] rounded-xl py-2 px-1">
    <span className="text-sm font-bold text-white">
      {typeof value === "number" ? value.toLocaleString("tr-TR") : value}
    </span>
    <span className="text-[10px] text-zinc-600 uppercase tracking-wider">{label}</span>
  </div>
);

const Footer = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.15, once: true });
  const t = useTranslations("footer");
  const pathname = usePathname();

  return (
    <footer ref={ref} className="relative bg-transparent">
      <Container withPadding className="relative z-10 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 items-start md:divide-x md:divide-white/10">
          {/* Brand column */}
          <div className="md:col-span-1 md:px-6">
            <div className="flex flex-col gap-3">
              <div>
                <h3 className="-mono text-[10px] text-zinc-400 uppercase tracking-[0.25em] mb-2">XipSoft Teknoloji</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Vizyonsuz proje iskeletsiz beden; <span className="text-violet-400">XipSoft kodlar</span>, hayaller canlanır yeniden.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]" />
                Online
              </div>


            </div>
          </div>

          {/* Links column */}
          <div className="md:col-span-1 md:px-6">
            <div className="flex flex-col gap-2">
              <FooterLink href="/" color="#a78bfa" index={0} isInView={isInView} icon={Home} isActive={pathname === "/"}>
                {t("home")}
              </FooterLink>
              <FooterLink href="/about" color="#a78bfa" index={1} isInView={isInView} icon={Info} isActive={pathname === "/about"}>
                Hakkımızda
              </FooterLink>
              <FooterLink href="/blog" color="#a78bfa" index={2} isInView={isInView} icon={BookOpen} isActive={pathname.startsWith("/blog")}>
                {t("blog")}
              </FooterLink>
              <FooterLink href="/contact-us" color="#a78bfa" index={3} isInView={isInView} icon={Mail} isActive={pathname === "/contact-us"}>
                {t("contactUs")}
              </FooterLink>
              <FooterLink href="/how-to-develop-setup" color="#a78bfa" index={4} isInView={isInView} icon={Code} isActive={pathname === "/how-to-develop-setup"}>
                {t("devSetup")}
              </FooterLink>
              <FooterLink href="/privacy-policy" color="#a78bfa" index={5} isInView={isInView} icon={Shield} isActive={pathname === "/privacy-policy"}>
                {t("privacy")}
              </FooterLink>
              <FooterLink href="/terms-of-service" color="#a78bfa" index={6} isInView={isInView} icon={FileText} isActive={pathname === "/terms-of-service"}>
                {t("terms")}
              </FooterLink>
              <FooterLink href="/cookie-policy" color="#a78bfa" index={7} isInView={isInView} icon={Cookie} isActive={pathname === "/cookie-policy"}>
                {t("cookies")}
              </FooterLink>
            </div>
          </div>

          {/* Social column */}
          <div className="md:col-span-1 md:px-6">
            <div className="flex flex-col gap-2">
              <SocialLink
                href="https://github.com/xiplarexs"
                icon={Github}
                label={t("github")}
                color="#a78bfa"
                index={0}
                isInView={isInView}
              />
              {/* Facebook linki henüz aktif degil — bos href erisilebilirlik hatası olusturur */}
              {/* <SocialLink href="" icon={Users} label={t("facebook")} ... /> */}
              <SocialLink
                href="https://t.me/xipsoft"
                icon={Send}
                label="Telegram"
                color="#a78bfa"
                index={1}
                isInView={isInView}
              />
            </div>
          </div>
        </div>

        <motion.div
          className="mt-8 relative"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-white/10">
            {/* Copyright */}
            <div className="flex-1 flex sm:justify-start justify-center w-full">
              <p className="text-xs text-zinc-500 -mono text-center sm:text-left">
                &copy; {new Date().getFullYear()} {t("copyright")}
              </p>
            </div>

            {/* Logo */}
            <div className="flex-1 flex justify-center w-full">
              <Image src="/media/logo.webp" alt="XipSoft" width={120} height={38} className="object-contain h-10 w-auto opacity-50 hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Tagline */}
            <div className="flex-1 flex sm:justify-end justify-center w-full">
              <motion.p
                className="flex items-center gap-1.5 text-xs text-zinc-500 text-center sm:text-right"
                whileHover={{ scale: 1.02 }}
              >
                <span className="-mono">Kopyası yoktur — XipSoft ürünüdür</span>
              </motion.p>
            </div>
          </div>
        </motion.div>
      </Container>
    </footer>
  );
};

export default Footer;
