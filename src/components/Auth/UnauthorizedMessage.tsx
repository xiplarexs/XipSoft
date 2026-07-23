"use client";

import { motion } from "motion/react";
import { ShieldX } from "lucide-react";
import MseLink from "@/components/Ui/MseLink/MseLink";

export default function UnauthorizedMessage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-sm"
      >
        <div className="mx-auto mb-6 w-16 h-16 rounded-2xl flex items-center justify-center bg-prism-rose/10 border border-prism-rose/20">
          <ShieldX className="w-7 h-7 text-prism-rose" />
        </div>
        <h2 className="-display text-2xl font-bold text-white mb-2">
          Access denied
        </h2>
        <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
          You don&apos;t have permission to view this page.
        </p>
        <MseLink
          href="/blog"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-white/[0.06] border border-white/[0.08] text-zinc-300 hover:text-white hover:bg-white/[0.1] transition-all duration-300"
        >
          Back to Blog
        </MseLink>
      </motion.div>
    </div>
  );
}
