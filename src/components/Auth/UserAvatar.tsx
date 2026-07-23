"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/utils";
import { motion, AnimatePresence } from "motion/react";
import { LogOut, FileText, User } from "lucide-react";
import MseLink from "@/components/Ui/MseLink/MseLink";
import { useTranslations } from "next-intl";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  useClick,
  useDismiss,
  useInteractions,
  FloatingPortal,
} from "@floating-ui/react";

export default function UserAvatar() {
  const { user, signOut, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const t = useTranslations("auth");
  const tBlog = useTranslations("blog");

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: "top-end",
    middleware: [
      offset(12),
      flip({ fallbackPlacements: ["bottom-end", "bottom-start", "top-start"] }),
      shift({ padding: 8 }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  if (!user) return null;

  return (
    <div className="relative">
      {/* Avatar button with prismatic ring */}
      <motion.button
        ref={refs.setReference}
        {...getReferenceProps()}
        type="button"
        className="relative w-9 h-9 rounded-full p-[2px]"
        style={{
          background: open
            ? "linear-gradient(135deg, #22d3ee, #a78bfa, #fb7185)"
            : "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        animate={open ? {
          boxShadow: "0 0 16px rgba(167,139,250,0.35), 0 0 32px rgba(34,211,238,0.15)",
        } : {
          boxShadow: "0 0 0px transparent",
        }}
        transition={{ duration: 0.3 }}
      >
        <span className="block w-full h-full rounded-full overflow-hidden bg-obsidian">
          {user.photo_url ? (
            <img
              src={user.photo_url}
              alt={user.display_name ?? "User"}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="w-full h-full flex items-center justify-center bg-prism-violet/15">
              <User className="w-4 h-4 text-prism-violet" />
            </span>
          )}
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="z-[9999]"
          >
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "w-60",
              "rounded-2xl overflow-hidden",
              "bg-surface/95 backdrop-blur-2xl",
              "border border-white/[0.06]",
              "shadow-[0_16px_48px_rgba(0,0,0,0.5),0_0_1px_rgba(255,255,255,0.05)]",
            )}
          >
            {/* Prismatic top accent line */}
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-prism-cyan/40 to-transparent" />

            {/* User info */}
            <div className="px-4 pt-4 pb-3">
              <div className="flex items-center gap-3">
                {/* Mini avatar */}
                <div className="w-10 h-10 rounded-full p-[1.5px] flex-shrink-0" style={{ background: "linear-gradient(135deg, #22d3ee, #a78bfa, #fb7185)" }}>
                  <span className="block w-full h-full rounded-full overflow-hidden bg-obsidian">
                    {user.photo_url ? (
                      <img src={user.photo_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                    ) : (
                      <span className="w-full h-full flex items-center justify-center bg-prism-violet/15">
                        <User className="w-4 h-4 text-prism-violet" />
                      </span>
                    )}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {user.display_name}
                  </p>
                  <p className="text-[11px] text-zinc-500 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              {isAdmin && (
                <span
                  className="inline-flex items-center mt-2.5 px-2 py-0.5 rounded-full text-[9px] -mono uppercase tracking-widest text-prism-cyan"
                  style={{
                    background: "linear-gradient(135deg, rgba(34,211,238,0.1), rgba(167,139,250,0.1))",
                    border: "1px solid rgba(34,211,238,0.15)",
                  }}
                >
                  Admin
                </span>
              )}
            </div>

            <div className="mx-3 h-[1px] bg-white/[0.05]" />

            {/* Menu items */}
            <div className="py-1.5 px-1.5">
              <MseLink
                href="/blog/my-posts"
                className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-all duration-200"
              >
                <span className="flex items-center justify-center w-7 h-7 rounded-md bg-white/[0.04] group-hover:bg-prism-violet/10 transition-colors duration-200">
                  <FileText className="w-3.5 h-3.5 group-hover:text-prism-violet transition-colors duration-200" />
                </span>
                <span onClick={() => setOpen(false)}>{tBlog("myBlogs")}</span>
              </MseLink>
            </div>

            <div className="mx-3 h-[1px] bg-white/[0.05]" />

            {/* Sign out */}
            <div className="py-1.5 px-1.5">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  signOut();
                }}
                className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-500 hover:text-prism-rose hover:bg-prism-rose/[0.04] transition-all duration-200 w-full"
              >
                <span className="flex items-center justify-center w-7 h-7 rounded-md bg-white/[0.04] group-hover:bg-prism-rose/10 transition-colors duration-200">
                  <LogOut className="w-3.5 h-3.5" />
                </span>
                <span>{t("signOut")}</span>
              </button>
            </div>
          </motion.div>
          </div>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </div>
  );
}
