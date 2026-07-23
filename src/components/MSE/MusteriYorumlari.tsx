"use client";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Star, Quote } from "lucide-react";
import { BRAND_COLORS } from "@/config/brand.config";
import { GlassCard } from "@/components/Ui/Card";

const reviews = [
  {
    name: "Aykut S.",
    color: BRAND_COLORS.secondary,
    glow: "rgba(34,211,238,0.10)",
    text: "Çalısan ekip sorumlusundan tutunda telefona bakan arkadasa her biri profesyonel, olaya sonuna kadar hakim, musteri memnuniyeti için çalısan bir firma.",
    rating: 5,
  },
  {
    name: "Çigdem P.",
    color: BRAND_COLORS.primary,
    glow: "rgba(167,139,250,0.10)",
    text: "Basından sonuna her sey mi guzel olur derseniz evet olur. Sektörunde tek diyebilecegim firmalardan. Basarılarınız daimi olsun.",
    rating: 5,
  },
  {
    name: "Oguz T.",
    color: "#34d399",
    glow: "rgba(52,211,153,0.10)",
    text: "Sektörde bir çok firma ile çalısıp en iyi özveri ve profesyonelligi buldugum firma. Her sey için tesekkurler.",
    rating: 5,
  },
  {
    name: "Meltem M.",
    color: BRAND_COLORS.accent,
    glow: "rgba(251,113,133,0.10)",
    text: "Herhangi bir konuda sorun yasamadıgım, çok ilgili bir ekibe sahip ve istediginiz sekilde hizmet veren yazılım firması.",
    rating: 5,
  },
];

export default function MusteriYorumlari() {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.1, once: true });

  return (
    <section ref={ref} className="py-16 lg:py-24">
      {/* Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title-glow -display -black text-3xl sm:text-4xl lg:text-5xl mb-3">
          Musteri Yorumları
        </h2>
        <p className="text-zinc-500 text-base max-w-xl mx-auto">
          Interaktif ve çagdas bir ajans olarak musterilerimizin çevrimiçi ortamdaki basarı merdiveni olmaktan gurur duyuyoruz.
        </p>
      </motion.div>

      {/* Reviews grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {reviews.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.6, delay: 0.05 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="group relative"
            whileHover={{
              y: -4,
              boxShadow: `0 8px 40px rgba(0,0,0,0.35), 0 0 0 1px ${r.color}30, inset 0 1px 0 rgba(255,255,255,0.12)`,
            }}
          >
            <GlassCard
              className="group relative flex flex-col gap-5 p-8 overflow-hidden transition-all duration-500"
              style={{
                boxShadow: "0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)",
                willChange: "transform, opacity",
              }}
            >
              {/* Arka plan orb */}
              <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full opacity-15 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle, ${r.color} 0%, transparent 70%)`, filter: "blur(24px)" }} />

              <div className="absolute top-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg, transparent, ${r.color}, transparent)` }} />

              <Quote className="w-7 h-7 opacity-25" style={{ color: r.color }} />

              <p className="text-zinc-300 text-base leading-relaxed flex-1">
                {r.text}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-zinc-950"
                    style={{ background: `linear-gradient(135deg, ${r.color}, ${r.color}99)` }}>
                    {r.name[0]}
                  </div>
                  <span className="text-sm font-semibold text-white">{r.name}</span>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
