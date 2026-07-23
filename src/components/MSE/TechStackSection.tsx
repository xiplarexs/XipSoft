"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Server, Globe, Smartphone, Cloud, Database, Wrench } from "lucide-react";
import { BRAND_COLORS } from "@/config/brand.config";
import { GlassCard } from "@/components/Ui/Card";

const stack = [
  {
    icon: Globe,
    color: BRAND_COLORS.secondary,
    label: "Frontend",
    items: ["React", "Next.js", "Vue", "Stencil", "PWA", "WebComponents"],
  },
  {
    icon: Server,
    color: BRAND_COLORS.primary,
    label: "Backend",
    items: ["Node.js", "Python", "Django", "FastAPI", "Laravel", "REST / graphQL"],
  },
  {
    icon: Smartphone,
    color: BRAND_COLORS.accent,
    label: "Mobil",
    items: ["Flutter", "React Native", "iOS", "Android", "Offline-first", "SSL Pinning"],
  },
  {
    icon: Cloud,
    color: "#34d399",
    label: "Altyapı",
    items: ["Docker", "AWS", "gCP", "Vercel", "Nginx", "CI/CD"],
  },
  {
    icon: Database,
    color: BRAND_COLORS.gold,
    label: "Veritabanı",
    items: ["PostgreSQL", "Redis", "MongoDB", "Kafka", "RabbitMQ", "Sharding"],
  },
  {
    icon: Wrench,
    color: "#c084fc",
    label: "Araçlar",
    items: ["git", "gitHub Actions", "Sentry", "Firebase", "OWASP", "SIEM"],
  },
];

export default function TechStackSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.15, once: true });

  return (
    <section ref={ref} className="py-16 lg:py-20 relative overflow-hidden px-4 sm:px-6 max-w-full">
      {/* Header */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >

        <h2 className="section-title-glow -display -black text-3xl sm:text-4xl lg:text-5xl mb-3">
          Teknoloji Yıgınımız
        </h2>
        <p className="text-zinc-500 text-base max-w-xl mx-auto">
          Endüstri standardı araçlarla, projenize en uygun teknolojiyi seçiyor ve uyguluyoruz.
        </p>
      </motion.div>

      {/* grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stack.map((group, i) => {
          const Icon = group.icon;
          return (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.05 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="group relative"
            >
              <GlassCard
                className="relative rounded-2xl p-6 overflow-hidden transition-all duration-400 hover:-translate-y-1"
                style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                  style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${group.color}10, transparent 70%)` }}
                />
                {/* Top accent */}
                <div
                  className="absolute top-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{ background: `linear-gradient(90deg, transparent, ${group.color}90, transparent)` }}
                />

                {/* Icon + label */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `${group.color}15`,
                      border: `1px solid ${group.color}30`,
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: group.color }} strokeWidth={1.5} />
                  </div>
                  <span className="font-bold text-sm text-zinc-300 tracking-wide uppercase">
                    {group.label}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 min-w-0 overflow-hidden">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium text-zinc-400 transition-colors duration-200 group-hover:text-zinc-300 min-w-0 break-words"
                      style={{
                        background: "var(--color-tag-bg)",
                        border: "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* CTA */}
      <motion.p
        className="text-center mt-10 text-zinc-500 text-sm"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.6 }}
      >
        Sonsuza dek sürecek bir mimari için{" "}
        <button
          onClick={() => import("@/components/Common/TeklifModal/TeklifModal").then(m => m.teklifModal.open())}
          className="text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-colors cursor-pointer"
        >
          ücretsiz teklif alın
        </button>
        .
      </motion.p>

      {/* Bg glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-violet-600/6 blur-[80px] rounded-full pointer-events-none" />
    </section>
  );
}
