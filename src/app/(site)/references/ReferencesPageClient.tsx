"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import dynamic from "next/dynamic";
import {
  Globe2, Smartphone, Monitor, Shield, BarChart2, ShoppingCart,
  Cpu, Building2, Truck, HeartPulse, GraduationCap, Scale,
  Quote, ExternalLink, Trophy,
} from "lucide-react";
import { teklifModal } from "@/components/Common/TeklifModal/TeklifModal";
import { BRAND_COLORS } from "@/config/brand.config";
import ParallaxHero from "@/components/Ui/ParallaxHero/ParallaxHero";
import type { CardItem } from "@/components/Ui/ScrollGrid3D/ScrollGrid3DCards";

const Scrollgrid3DCards = dynamic(
  () => import("@/components/Ui/ScrollGrid3D/ScrollGrid3DCards"),
  { ssr: false }
);

// ─── Veri ──────────────────────────────────────────────────────────────────

const projectCategoryCards: CardItem[] = [
  { icon: globe2,        color: BRAND_COLORS.secondary, title: "Kurumsal Web",         desc: "sirket tanıtım siteleri, landing page, çok dilli web uygulamaları." },
  { icon: ShoppingCart,  color: BRAND_COLORS.accent, title: "E-Ticaret",            desc: "B2C & B2B e-ticaret sistemleri, ödeme entegrasyonları, stok yönetimi." },
  { icon: Smartphone,    color: BRAND_COLORS.primary, title: "Mobil Uygulama",       desc: "iOS & Android native ve cross-platform yüksek performanslı uygulamalar." },
  { icon: Monitor,       color: BRAND_COLORS.gold, title: "Masaüstü ERP/CRM",     desc: "Windows/macOS tabanlı isletme yönetim ve otomasyon yazılımları." },
  { icon: Shield,        color: "#34d399", title: "güvenlik Çözümleri",   desc: "Pentest, güvenlik denetimi, sızdırmazlık testleri ve KVKK danısmanlıgı." },
  { icon: BarChart2,     color: "#c084fc", title: "SEO & Dijital Reklam", desc: "Organik büyüme, google Ads, içerik stratejisi ve dönüsüm optimizasyonu." },
  { icon: Cpu,           color: BRAND_COLORS.secondary, title: "Özel Yazılım",         desc: "ERP, CRM, lojistik, üretim takip ve is akısı otomasyon sistemleri." },
  { icon: Truck,         color: BRAND_COLORS.accent, title: "Lojistik & Takip",     desc: "Kargo takip, araç yönetimi, rota optimizasyonu yazılım sistemleri." },
  { icon: HeartPulse,    color: BRAND_COLORS.primary, title: "Saglık IT",            desc: "Klinik yönetim, hasta takip, randevu ve raporlama sistemleri." },
  { icon: graduationCap, color: BRAND_COLORS.gold, title: "Egitim Platformu",    desc: "LMS, video platform, online sınav ve sertifika yönetim sistemleri." },
  { icon: Building2,     color: "#34d399", title: "Fintech & Muhasebe",   desc: "Finansal raporlama, fatura yönetimi, ödeme sistemi entegrasyonları." },
  { icon: Scale,         color: "#c084fc", title: "Hukuk & Belge",        desc: "Sözlesme yönetimi, e-imza, arsivleme ve yasal süreç takip sistemleri." },
];

const sectorCards: CardItem[] = [
  { icon: globe2,      color: BRAND_COLORS.secondary, title: "Web & E-Ticaret",   desc: "85+ basarılı web projesi" },
  { icon: Smartphone,  color: BRAND_COLORS.primary, title: "Mobil Uygulamalar", desc: "40+ iOS & Android projesi" },
  { icon: Shield,      color: "#34d399", title: "Siber güvenlik",    desc: "30+ güvenlik denetimi" },
  { icon: BarChart2,   color: BRAND_COLORS.accent, title: "SEO & Pazarlama",   desc: "25+ dijital büyüme projesi" },
  { icon: Monitor,     color: BRAND_COLORS.gold, title: "Masaüstü Yazılım",  desc: "20+ ERP/CRM sistemi" },
  { icon: Cpu,         color: "#c084fc", title: "Özel Çözümler",     desc: "15+ kurumsal yazılım" },
];

const testimonials = [
  { name: "Ahmet Y.",  company: "E-Ticaret Firması", text: "XipSoft ekibi projemizi zamanında ve beklentilerimizin üzerinde teslim etti. Teknik bilgileri ve iletisimleri mükemmeldi.", service: "Web & E-Ticaret",  color: BRAND_COLORS.secondary },
  { name: "Mehmet K.", company: "Lojistik sirketi",  text: "Masaüstü yazılım projemizde XipSoft'un uzmanlıgı gerçekten fark yarattı. Kaynak dosyaları da teslim ettiler.",              service: "Masaüstü Yazılım", color: BRAND_COLORS.gold },
  { name: "Ayse D.",   company: "Saglık Klinigi",    text: "Mobil uygulamamız hem iOS hem Android'de sorunsuz çalısıyor. Destek süreçleri de çok hızlı.",                               service: "Mobil Uygulama",   color: BRAND_COLORS.primary },
  { name: "Kemal S.",  company: "Fintech girisimi",  text: "güvenlik denetimi ve pentest sürecinde XipSoft'un titizligi bizi çok etkiledi. Açıkları raporlayıp çözüme kavusturdular.", service: "Siber güvenlik",   color: "#34d399" },
  { name: "Selin A.",  company: "Dijital Ajans",      text: "SEO çalısmaları sonucunda organik trafigimiz 3 ayda %180 arttı. Raporlama ve seffaflıkları çok degerliydi.",               service: "SEO & Dijital",    color: BRAND_COLORS.accent },
  { name: "Burak T.",  company: "Üretim Firması",    text: "ERP entegrasyonumuz sorunsuz tamamlandı. Özellestirme talepleri için her zaman hızlı dönüs yaptılar.",                       service: "Özel Yazılım",     color: "#c084fc" },
];

// ─── Bölüm baslıgı ───────────────────────────────────────────────────────────

const SectionHeader = ({
  title, subtitle, color = BRAND_COLORS.secondary, isInView,
}: {
  title: string; subtitle?: string; color?: string; isInView: boolean;
}) => (
  <motion.div
    className="text-center mb-12"
    initial={{ opacity: 0, y: 24 }}
    animate={isInView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
  >
    <h2
      className="font-black tracking-tight mb-3"
      style={{
        fontSize: "clamp(1.75rem, 4vw, 3rem)",
        background: `linear-gradient(135deg, #fff 10%, ${color} 70%)`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        filter: `drop-shadow(0 0 20px ${color}40)`,
      }}
    >
      {title}
    </h2>
    <div className="flex justify-center mb-3">
      <div className="h-[1.5px] w-16 rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
    </div>
    {subtitle && <p className="text-zinc-500 max-w-lg mx-auto text-sm leading-relaxed">{subtitle}</p>}
  </motion.div>
);

// ─── Ana bilesen ─────────────────────────────────────────────────────────────

export default function ReferencesPageClient() {
  const projectsRef    = useRef(null);
  const sectorsRef     = useRef(null);
  const testimonialRef = useRef(null);
  const ctaRef         = useRef(null);

  const projectsInView    = useInView(projectsRef,    { once: true, amount: 0.05 });
  const sectorsInView     = useInView(sectorsRef,     { once: true, amount: 0.1 });
  const testimonialInView = useInView(testimonialRef, { once: true, amount: 0.1 });
  const ctaInView         = useInView(ctaRef,         { once: true, amount: 0.3 });

  return (
    <div className="min-h-screen">

      {/* ══ PARALLAX HERO ══════════════════════════════════════════════ */}
      <ParallaxHero
        badge="Referanslar & Projeler"
        badgeIcon={<Trophy className="w-3.5 h-3.5" />}
        title="200+ Basarılı Proje"
        subtitle="15 yılda web'den mobil'e, masaüstünden siber güvenlige her sektörde güvenilir çözümler. Her proje müsteriye özel kodlanır, teslim edilir ve desteklenir."
        accentColor={BRAND_COLORS.secondary}
        secondaryColor={BRAND_COLORS.primary}
        ctaPrimary={{ label: "Projenizi Anlatalım", onClick: () => teklifModal.open() }}
        ctaSecondary={{ label: "Hizmetlerimiz", href: "/hizmetler/web-yazilim-tasarim" }}
        stats={[
          { value: "15+",  label: "Yıl Tecrübe" },
          { value: "200+", label: "Proje" },
          { value: "150+", label: "Müsteri" },
          { value: "12",   label: "Sektör" },
        ]}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ══ PROJE KATEgORILERI ════════════════════════════════════════ */}
        <section ref={projectsRef} className="py-20 lg:py-28 border-t border-white/[0.05]">
          <SectionHeader
            title="Neler Yaptık?"
            subtitle="200+ projenin 12 kategoride özeti."
            color={BRAND_COLORS.secondary}
            isInView={projectsInView}
          />
          <Scrollgrid3DCards items={projectCategoryCards} columns={4} animType="type3" uniformColor={BRAND_COLORS.secondary} />
        </section>

        {/* ══ SEKTÖR DAgILIMI ══════════════════════════════════════════ */}
        <section ref={sectorsRef} className="py-20 lg:py-28 border-t border-white/[0.05]">
          <SectionHeader
            title="Sektör Dagılımı"
            subtitle="Hangi alanlarda ne kadar is yaptık."
            color={BRAND_COLORS.gold}
            isInView={sectorsInView}
          />
          <Scrollgrid3DCards items={sectorCards} columns={3} animType="type1" uniformColor={BRAND_COLORS.gold} />
        </section>

        {/* ══ MÜsTERI YORUMLARI ════════════════════════════════════════ */}
        <section ref={testimonialRef} className="py-20 lg:py-28 border-t border-white/[0.05]">
          <SectionHeader
            title="Müsterilerimiz Ne Diyor?"
            subtitle="gerçek müsteri deneyimleri."
            color={BRAND_COLORS.primary}
            isInView={testimonialInView}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                className="group relative flex flex-col gap-4 p-6 rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1"
                style={{
                  background: "var(--color-card-bg)",
                  border: "1px solid var(--color-border)",
                }}
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={testimonialInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.05 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px ${t.color}20` }}
              >
                <div className="absolute -bottom-8 -right-8 w-36 h-36 rounded-full opacity-10 group-hover:opacity-25 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${t.color} 0%, transparent 70%)`, filter: "blur(20px)" }} />
                <div className="absolute top-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{ background: `linear-gradient(90deg, transparent, ${t.color}dd, transparent)` }} />
                <Quote className="w-6 h-6 opacity-20 relative z-10" style={{ color: t.color }} />
                <p className="text-zinc-300 text-sm leading-relaxed relative z-10 flex-1">{t.text}</p>
                <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] relative z-10">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-zinc-950"
                      style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}99)` }}
                    >
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{t.name}</p>
                      <p className="text-zinc-600 text-xs">{t.company}</p>
                    </div>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold"
                    style={{ background: `${t.color}12`, color: t.color, border: `1px solid ${t.color}20` }}
                  >
                    {t.service}
                  </span>
                </div>
              </motion.div>
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
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-15">
              <div className="absolute w-[500px] h-[500px] rounded-full" style={{ left: "50%", top: "50%", transform: "translate(-50%,-50%)", border: "1px solid rgba(34,211,238,0.30)" }} />
              <div className="absolute w-[320px] h-[320px] rounded-full" style={{ left: "50%", top: "50%", transform: "translate(-50%,-50%)", border: "1px solid rgba(34,211,238,0.40)" }} />
            </div>
            <h2
              className="relative z-10 font-black text-3xl md:text-4xl mb-4"
              style={{
                background: "linear-gradient(135deg, #fff 15%, #22d3ee 55%, #a78bfa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Projenizi Konusalım
            </h2>
            <p className="relative z-10 text-zinc-400 mt-4 max-w-xl mx-auto leading-relaxed">
              Siz de 200+ basarılı projemize katılın. Ücretsiz danısmanlık için hemen iletisime geçin.
            </p>
            <div className="mt-8 relative z-10">
              <button
                onClick={() => teklifModal.open()}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-zinc-950 transition-all hover:scale-[1.03] active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #22d3ee, #a78bfa)",
                  boxShadow: "0 0 24px rgba(34,211,238,0.40)",
                }}
              >
                Ücretsiz Teklif Al <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
