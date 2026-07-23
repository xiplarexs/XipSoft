"use client";
/**
 * Scrollgrid3DCards
 * motion/react ile kartlar 3D'den gelip grid'e yerlesir.
 * Tıklanabilir, hover efektli, href destekli.
 */
import { useRef } from "react";
import { motion, useInView } from "motion/react";

export interface CardItem {
  icon: React.ElementType;
  color: string;
  title: string;
  desc: string;
  badge?: string;
  href?: string;
}

interface Props {
  items: CardItem[];
  columns?: number;
  /** type3: Z-derinliginden gelir | type1: yandan gelir */
  animType?: "type1" | "type3";
  /** Tüm kartlara tek renk border/glow (kart rengi override) */
  uniformColor?: string;
}

export default function Scrollgrid3DCards({ items, columns = 4, animType = "type3", uniformColor }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <div
      ref={ref}
      style={{
        display: "grid",
        placeItems: "center",
        padding: "clamp(0.75rem, 4vw, 2rem)",
        width: "100%",
        maxWidth: "100vw",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "min(105%, 100vw)",
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap: "clamp(0.75rem, 1.5vw, 1.5rem)",
        }}
      >
        {items.map((item, i) => {
          const Icon = item.icon;
          const cardColor = uniformColor ?? item.color;

          // Her kart için farklı giris yönü
          const getInitial = () => ({ opacity: 0, y: 32, scale: 0.96 });
          const getAnimate = () => ({ opacity: 1, y: 0, scale: 1 });

          const cardInner = (
            <div
              className="group relative w-full h-full flex flex-col gap-3 p-5 rounded-2xl cursor-pointer select-none"
              style={{
                background: "var(--color-card-bg)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid var(--color-border)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
                height: "100%",
              }}
            >
              {/* Ambient glow — hover'da beliriyor */}
              <div
                className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${cardColor} 0%, transparent 70%)`,
                  filter: "blur(20px)",
                }}
              />
              {/* Üst border — hover */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl"
                style={{ background: `linear-gradient(90deg, transparent, ${cardColor}, transparent)` }}
              />

              {/* Badge */}
              {item.badge && (
                <div
                  className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-black z-10"
                  style={{ background: `linear-gradient(135deg, ${cardColor}, var(--prism-rose))` }}
                >
                  {item.badge}+
                </div>
              )}

              {/* Ikon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 relative z-10"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: `1px solid ${cardColor}40`,
                }}
              >
                <Icon className="w-5 h-5" style={{ color: cardColor }} strokeWidth={1.5} />
              </div>

              {/* Metin */}
              <div className="relative z-10 flex flex-col gap-1.5 flex-1">
                <p className="font-bold text-sm text-white leading-snug">{item.title}</p>
                <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3">{item.desc}</p>
              </div>

              {/* Alt çizgi */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[1px] opacity-30 rounded-b-2xl"
                style={{ background: `linear-gradient(90deg, transparent, ${cardColor}60, transparent)` }}
              />
            </div>
          );

          return (
            <motion.div
              key={`${item.title}-${i}`}
              initial={getInitial()}
              animate={getAnimate()}
              transition={{
                duration: 0.7,
                delay: i * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -6, scale: 1.02 }}
              style={{
                aspectRatio: "1.5",
                borderRadius: "12px",
                transformStyle: "preserve-3d",
              }}
            >
              {item.href ? (
                <a href={item.href} className="block w-full h-full">
                  {cardInner}
                </a>
              ) : (
                cardInner
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
