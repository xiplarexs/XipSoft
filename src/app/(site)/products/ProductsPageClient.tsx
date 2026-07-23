"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import Link from "next/link";
import {
  Package, CheckCircle, ArrowRight, Zap, Globe, ShoppingCart,
  Code2, BarChart2, Star, Tag, ChevronDown, MessageCircle,
} from "lucide-react";
import { teklifModal } from "@/components/Common/TeklifModal/TeklifModal";
import { BRAND_COLORS } from "@/config/brand.config";
import ParallaxHero from "@/components/Ui/ParallaxHero/ParallaxHero";
import { PRODUCTS } from "@/data/products";

// ─── Kategori renkleri ─────────────────────────────────────────────────────
const CATEgORY_COLORS: Record<string, string> = {
  "Kurumsal": BRAND_COLORS.primary,
  "E-Ticaret": BRAND_COLORS.secondary,
};

function getCategoryColor(cat: string): string {
  return CATEgORY_COLORS[cat] ?? BRAND_COLORS.accent;
}

// ─── Ürün kartı ────────────────────────────────────────────────────────────
const ProductCard = ({
  product, index, isInView,
}: {
  product: typeof PRODUCTS[number]; index: number; isInView: boolean;
}) => {
  const color = getCategoryColor(product.category);
  const discount = product.discount;
  const featured = product.featured;

  return (
    <motion.div
      className="group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-1.5"
      style={{
        background: featured
          ? `linear-gradient(160deg, ${color}12, var(--color-card-bg))`
          : "var(--color-card-bg)",
        border: featured ? `1px solid ${color}40` : "1px solid var(--color-border)",
      }}
      initial={{ opacity: 0, y: 32, scale: 0.96 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.55, delay: 0.05 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ boxShadow: `0 8px 40px rgba(0,0,0,0.3), 0 0 0 1px ${color}25` }}
    >
      {/* Üst renkli çizgi */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />

      {/* Featured badge */}
      {featured && (
        <div
          className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
          style={{ background: `${color}20`, color, border: `1px solid ${color}30` }}
        >
          <Star className="w-3 h-3 inline mr-1" />
          Öne Çıkan
        </div>
      )}

      {/* Indirim badge */}
      {discount > 0 && (
        <div className="absolute top-4 left-4 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          %{discount} Indirim
        </div>
      )}

      <div className="p-7 flex flex-col flex-1">
        {/* Kategori */}
        <div className="flex items-center gap-2 mb-4">
          <span
            className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full"
            style={{ background: `${color}12`, color, border: `1px solid ${color}20` }}
          >
            {product.category}
          </span>
          <span className="text-[10px] font-mono text-zinc-600">{product.version}</span>
        </div>

        {/* Isim */}
        <h3 className="font-black text-lg text-white mb-2 leading-tight group-hover:text-white transition-colors">
          {product.name}
        </h3>
        <p className="text-zinc-500 text-sm mb-4 leading-relaxed">{product.description}</p>

        {/* Özellikler */}
        <ul className="flex flex-col gap-2 mb-6 flex-1">
          {product.features.slice(0, 4).map((f) => (
            <li key={f} className="flex items-center gap-2 text-xs text-zinc-300">
              <CheckCircle className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
              {f}
            </li>
          ))}
        </ul>

        {/* Fiyat */}
        <div className="mb-5 pt-4 border-t border-white/[0.06]">
          <div className="flex items-baseline gap-2">
            <span
              className="font-black text-2xl"
              style={{ color, filter: `drop-shadow(0 0 10px ${color}50)` }}
            >
              ₺{product.sale.toLocaleString("tr-TR")}
            </span>
            {product.sale !== product.basePrice && (
              <span className="text-sm text-zinc-600 line-through">
                ₺{product.basePrice.toLocaleString("tr-TR")}
              </span>
            )}
          </div>
          <p className="text-[10px] text-zinc-600 font-mono mt-0.5">Tek seferlik, kaynak kodlu teslim</p>
        </div>

        {/* CTA */}
        <button
          onClick={() => teklifModal.open(product.name)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-95"
          style={{
            background: featured ? `linear-gradient(135deg, ${color}, ${color}bb)` : "rgba(255,255,255,0.06)",
            color: featured ? "#09090b" : "rgba(255,255,255,0.8)",
            border: featured ? "none" : "1px solid rgba(255,255,255,0.10)",
            boxShadow: featured ? `0 0 20px ${color}35` : "none",
          }}
        >
          <Tag className="w-4 h-4" />
          Teklif Al
        </button>
      </div>
    </motion.div>
  );
};

// ─── SSS ─────────────────────────────────────────────────────────────────────
const FAQS = [
  { q: "Hazır ürün olarak mı satılıyor?", a: "Hayır. Her proje müsteriye özel kodlanır. 'Hazır' dedigimiz sey, temel altyapının hazır olmasıdır. Tasarım, içerik ve özellikler tamamen size uyarlanır." },
  { q: "Kaynak kodunu teslim ediyor musunuz?", a: "Evet. Tüm projelerimizde kaynak kod müsteriye teslim edilir. Kod sizin mülkiyetinizdir." },
  { q: "Fiyata ne dahil?", a: "Proje gelistirme, test, yayına alma ve temel kullanım egitimi fiyata dahildir. Hosting ve domain ayrıdır." },
  { q: "Proje ne kadar sürede teslim edilir?", a: "Paket büyüklügüne göre 2-8 hafta arası degisir. Süreç basında kesin tarih belirlenir." },
  { q: "Satıs sonrası destek var mı?", a: "Evet, tüm paketlerde belirtilen süre kadar teknik destek dahildir. Süre sonrası aylık bakım paketi seçenegi sunulur." },
];

const FaqItem = ({ q, a, index, open, onToggle }: {
  q: string; a: string; index: number; open: boolean; onToggle: () => void;
}) => (
  <motion.div
    className="rounded-xl overflow-hidden"
    style={{
      border: open ? "1px solid rgba(34,211,238,0.25)" : "1px solid rgba(255,255,255,0.07)",
      background: open ? "rgba(34,211,238,0.05)" : "var(--color-card-bg)",
    }}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.06 }}
  >
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-5 text-left text-sm font-semibold text-zinc-200 hover:text-white transition-colors"
    >
      {q}
      <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
        <ChevronDown className="w-4 h-4 ml-3 text-cyan-400 shrink-0" />
      </motion.span>
    </button>
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="overflow-hidden"
        >
          <p className="px-5 pb-5 text-sm text-zinc-400 leading-relaxed">{a}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

// ─── Ana bilesen ──────────────────────────────────────────────────────────────
export default function ProductsPageClient() {
  const productsRef = useRef(null);
  const processRef  = useRef(null);
  const faqRef      = useRef(null);
  const ctaRef      = useRef(null);

  const productsInView = useInView(productsRef, { once: true, amount: 0.05 });
  const processInView  = useInView(processRef,  { once: true, amount: 0.1 });
  const faqInView      = useInView(faqRef,      { once: true, amount: 0.1 });
  const ctaInView      = useInView(ctaRef,      { once: true, amount: 0.3 });

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Kategoriye göre grupla
  const categories = Array.from(new Set(PRODUCTS.map((p) => p.category)));

  return (
    <div className="min-h-screen">

      {/* ══ PARALLAX HERO ══════════════════════════════════════════════ */}
      <ParallaxHero
        badge="Ürünler & Yazılım Paketleri"
        badgeIcon={<Package className="w-3.5 h-3.5" />}
        title="Size Özel Dijital Çözümler"
        subtitle="Hazır sablon yok. Her proje sıfırdan kodlanır, tamamen size aittir. E-ticaret'ten kurumsal yazılıma, kaynak kod teslimi garantili."
        accentColor="#22d3ee"
        secondaryColor="#a78bfa"
        ctaPrimary={{ label: "Fiyat Teklifi Al", onClick: () => teklifModal.open() }}
        ctaSecondary={{ label: "Hizmetlerimiz", href: "/hizmetler/web-yazilim-tasarim" }}
        stats={[
          { value: "8+",   label: "Yazılım Paketi" },
          { value: "100%", label: "Kaynak Kod Teslimi" },
          { value: "15+",  label: "Yıl Deneyim" },
          { value: "7/7",  label: "Destek" },
        ]}
        className="min-h-[60vh]"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ══ ÜRÜNLER ═══════════════════════════════════════════════════ */}
        <section ref={productsRef} className="py-20 lg:py-28 border-t border-white/[0.05]">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 24 }}
            animate={productsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="font-black mb-3"
              style={{
                fontSize: "clamp(1.75rem, 4vw, 3rem)",
                background: "linear-gradient(135deg, #fff 10%, #22d3ee 70%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 20px rgba(34,211,238,0.40))",
              }}
            >
              Yazılım Paketleri
            </h2>
            <div className="flex justify-center mb-3">
              <div className="h-[1.5px] w-16 rounded-full" style={{ background: "linear-gradient(90deg, transparent, #22d3ee, transparent)" }} />
            </div>
            <p className="text-zinc-500 max-w-lg mx-auto text-sm leading-relaxed">
              Her paket müsteriye özel uyarlanır. Asagıdaki fiyatlar baz fiyat olup gerçek teklif ihtiyaca göre belirlenir.
            </p>
          </motion.div>

          {/* Kategoriler */}
          {categories.map((cat) => {
            const catProducts = PRODUCTS.filter((p) => p.category === cat);
            const catColor = getCategoryColor(cat);
            return (
              <div key={cat} className="mb-16 last:mb-0">
                <motion.div
                  className="flex items-center gap-3 mb-6"
                  initial={{ opacity: 0, x: -16 }}
                  animate={productsInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <div className="h-[1px] flex-1" style={{ background: `linear-gradient(90deg, ${catColor}40, transparent)` }} />
                  <span
                    className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full font-mono"
                    style={{ color: catColor, background: `${catColor}12`, border: `1px solid ${catColor}25` }}
                  >
                    {cat}
                  </span>
                  <div className="h-[1px] flex-1" style={{ background: `linear-gradient(90deg, transparent, ${catColor}40)` }} />
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {catProducts.map((product, i) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={i}
                      isInView={productsInView}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* ══ ÇALIsMA SÜRECI ════════════════════════════════════════════ */}
        <section ref={processRef} className="py-20 lg:py-28 border-t border-white/[0.05]">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 24 }}
            animate={processInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="font-black mb-3"
              style={{
                fontSize: "clamp(1.75rem, 4vw, 3rem)",
                background: "linear-gradient(135deg, #fff 10%, #a78bfa 70%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Nasıl Çalısıyoruz?
            </h2>
            <div className="flex justify-center mb-3">
              <div className="h-[1.5px] w-16 rounded-full" style={{ background: "linear-gradient(90deg, transparent, #a78bfa, transparent)" }} />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { step: "01", icon: MessageCircle, color: BRAND_COLORS.secondary,  title: "Ihtiyaç Analizi",    desc: "Is modelinizi, hedef kitlenizi ve teknik beklentilerinizi dinleriz." },
              { step: "02", icon: Code2,         color: BRAND_COLORS.primary,   title: "Yol Haritası",       desc: "Teknoloji seçimi, mimari yapı ve zamanlama planını netlestiririz." },
              { step: "03", icon: Globe,         color: BRAND_COLORS.accent,    title: "Tasarım & Onay",     desc: "Önce tasarım, sonra kod. Onaylamadıgınız seyi kodlamayız." },
              { step: "04", icon: Zap,           color: BRAND_COLORS.gold,      title: "gelistirme",         desc: "Modern teknolojilerle sıfırdan kodlama, düzenli demo gösterimi." },
              { step: "05", icon: CheckCircle,   color: "#34d399",              title: "Test & Yayın",       desc: "Kapsamlı test, performans optimizasyonu ve canlıya alma." },
              { step: "06", icon: BarChart2,     color: "#c084fc",              title: "Destek & Büyüme",   desc: "Teslim sonrası destek, egitim ve sürekli gelisim." },
            ].map((step, i) => {
              const StepIcon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  className="group relative p-6 rounded-2xl overflow-hidden transition-all duration-400 hover:-translate-y-1"
                  style={{
                    background: "var(--color-card-bg)",
                    border: "1px solid var(--color-border)",
                  }}
                  initial={{ opacity: 0, y: 24 }}
                  animate={processInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.05 + i * 0.08 }}
                  whileHover={{ boxShadow: `0 4px 24px rgba(0,0,0,0.25), 0 0 0 1px ${step.color}20` }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{ background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${step.color}08, transparent)` }} />
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono text-[11px] font-black" style={{ color: step.color }}>{step.step}</span>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${step.color}15` }}>
                      <StepIcon className="w-4 h-4" style={{ color: step.color }} strokeWidth={1.5} />
                    </div>
                  </div>
                  <h4 className="font-bold text-sm text-white mb-2">{step.title}</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ══ SSS ═══════════════════════════════════════════════════════ */}
        <section ref={faqRef} className="py-20 lg:py-28 border-t border-white/[0.05]">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 24 }}
            animate={faqInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="font-black mb-3"
              style={{
                fontSize: "clamp(1.75rem, 4vw, 3rem)",
                background: "linear-gradient(135deg, #fff 10%, #fbbf24 70%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Sıkça Sorulan Sorular
            </h2>
          </motion.div>
          <div className="max-w-3xl mx-auto flex flex-col gap-2.5">
            {FAQS.map((faq, i) => (
              <FaqItem
                key={i}
                q={faq.q}
                a={faq.a}
                index={i}
                open={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </section>

        {/* ══ CTA ═══════════════════════════════════════════════════════ */}
        <motion.section
          ref={ctaRef}
          className="py-20 mb-12 border-t border-white/[0.05]"
          initial={{ opacity: 0, y: 24 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div
            className="relative rounded-3xl p-10 md:p-16 text-center overflow-hidden"
            style={{
              background: "linear-gradient(160deg, rgba(34,211,238,0.07), rgba(255,255,255,0.03))",
              border: "1px solid rgba(34,211,238,0.15)",
            }}
          >
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at center, rgba(34,211,238,0.10) 0%, transparent 70%)" }} />
            <h2
              className="relative z-10 font-black text-3xl md:text-4xl mb-4"
              style={{
                background: "linear-gradient(135deg, #fff 10%, #22d3ee 55%, #a78bfa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Baslayalım mı?
            </h2>
            <p className="relative z-10 text-zinc-400 max-w-xl mx-auto mb-8 leading-relaxed">
              Hayalinizdeki dijital çözümü birlikte insa edelim. Ücretsiz danısmanlık ve fiyat teklifi için hemen iletisime geçin.
            </p>
            <div className="relative z-10 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => teklifModal.open()}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-zinc-950 transition-all hover:scale-[1.03] active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #22d3ee, #a78bfa)",
                  boxShadow: "0 0 24px rgba(34,211,238,0.40)",
                }}
              >
                Ücretsiz Teklif Al <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                href="/contact-us"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02]"
                style={{
              background: "var(--color-card-bg)",
              border: "1px solid var(--color-border)",
              color: "rgba(255,255,255,0.80)",
                }}
              >
                Iletisime geç
              </Link>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
