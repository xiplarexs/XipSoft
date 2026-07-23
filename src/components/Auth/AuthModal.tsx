"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { X, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen } = useAuth();
  const router = useRouter();

  const handlegoToLogin = () => {
    setAuthModalOpen(false);
    router.push("/register");
  };

  return (
    <AnimatePresence>
      {authModalOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAuthModalOpen(false)}
            className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.3 }}
            className="fixed inset-0 z-[201] flex items-center justify-center px-4"
          >
            <div className="relative w-full max-w-sm rounded-2xl bg-zinc-900 border border-white/[0.08] p-6 shadow-2xl">
              <div
                className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
                style={{ background: "linear-gradient(90deg, #22d3ee, #a78bfa, #fb7185)" }}
              />

              <button
                type="button"
                onClick={() => setAuthModalOpen(false)}
                aria-label="Modalı kapat"
                className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>

              <div className="mb-6">
                <h2 className="text-lg font-bold text-white">giris Yap / Kayıt Ol</h2>
                <p className="text-xs text-zinc-500 mt-1">Devam etmek için giris yapman gerekiyor</p>
              </div>

              <button
                type="button"
                onClick={handlegoToLogin}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white border border-white/20 bg-white/[0.06] hover:bg-white/[0.10] backdrop-blur-sm transition-all"
              >
                <LogIn className="w-4 h-4" />
                giris Yap / Kayıt Ol
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
