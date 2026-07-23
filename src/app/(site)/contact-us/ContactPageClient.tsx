"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import dynamic from "next/dynamic";
import {
  Mail, Globe, Phone, Clock, MessageCircle, MapPin,
  Send, CheckCircle, Loader2, Building2, Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { BRAND_COMPANY, BRAND_COLORS } from "@/config/brand.config";
import { teklifModal } from "@/components/Common/TeklifModal/TeklifModal";
import ParallaxHero from "@/components/Ui/ParallaxHero/ParallaxHero";
import { submitTeklifAction } from "@/app/_actions/teklif-actions";

const GoogleMap = dynamic(() => import("@/components/Map/GoogleMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[280px] rounded-2xl flex items-center justify-center bg-zinc-900/50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400" />
    </div>
  ),
});

// ─── Veri ──────────────────────────────────────────────────────────────────

const CONTACT_CHANNELS = [
  { icon: Mail,    label: "E-posta (Önerilen)", value: "info@xipsoft.net",    href: "mailto:info@xipsoft.net",  color: BRAND_COLORS.secondary },
  { icon: Globe,   label: "Web",                value: "www.xipsoft.net",    href: "https://xipsoft.net",       color: BRAND_COLORS.primary },
  { icon: Phone,   label: "Tel / WhatsApp",     value: BRAND_COMPANY.phone,  href: `https://wa.me/${BRAND_COMPANY.phone.replace(/\D/g, "")}`, color: BRAND_COLORS.accent },
  { icon: MapPin,  label: "Adres",              value: BRAND_COMPANY.addressShort, href: BRAND_COMPANY.mapsUrl, color: BRAND_COLORS.gold },
];

const CONTACT_METHODS = [
  { id: "whatsapp" as const, label: "WhatsApp", icon: MessageCircle, desc: "Hızlı yanıt", color: "#34d399" },
  { id: "email"    as const, label: "E-posta",  icon: Mail,          desc: "info@xipsoft.net", color: BRAND_COLORS.secondary },
  { id: "telegram" as const, label: "Telegram", icon: Send,          desc: "@xipsoft",     color: BRAND_COLORS.primary },
];

// ─── Alt bilesenler ─────────────────────────────────────────────────────────

const InfoRow = ({
  icon: Icon, label, value, href, color, delay, isInView,
}: {
  icon: typeof Mail; label: string; value: string;
  href?: string; color: string; delay: number; isInView: boolean;
}) => (
  <motion.div
    className="group flex items-start gap-4"
    initial={{ opacity: 0, x: -20 }}
    animate={isInView ? { opacity: 1, x: 0 } : {}}
    transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    <div
      className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center mt-0.5 transition-all duration-300 group-hover:scale-105"
      style={{ background: `${color}15`, border: `1px solid ${color}25` }}
    >
      <Icon className="w-4 h-4" style={{ color }} />
    </div>
    <div>
      <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 mb-0.5">{label}</p>
      {href ? (
        <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
          className="text-zinc-200 hover:text-white transition-colors text-sm font-medium hover:underline decoration-dotted underline-offset-2">
          {value}
        </a>
      ) : (
        <p className="text-zinc-200 text-sm font-medium">{value}</p>
      )}
    </div>
  </motion.div>
);

// ─── Hızlı iletisim formu ────────────────────────────────────────────────────

type ContactMethod = "whatsapp" | "email" | "telegram";
type FormStep = "form" | "done";

const QuickContactForm = ({ isInView }: { isInView: boolean }) => {
  const [step, setStep] = useState<FormStep>("form");
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<ContactMethod>("whatsapp");
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", detail: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await submitTeklifAction({ ...form, contactMethod: method });
      if (result.success) setStep("done");
      else setError(result.error || "Bir hata olustu.");
    } catch {
      setError("Baglantı hatası, lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-cyan-500/60 transition-colors";

  return (
    <motion.div
      className="relative p-7 rounded-2xl overflow-hidden"
      style={{
        background: "var(--color-card-bg)",
        border: "1px solid var(--color-border)",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      {/* Prism üst çizgi */}
      <div className="absolute top-0 left-0 right-0 h-[2px]">
        <motion.div
          className="h-full w-[200%]"
          style={{ background: "linear-gradient(90deg,transparent,#22d3ee,#a78bfa,#fb7185,#a78bfa,#22d3ee,transparent)" }}
          animate={{ x: ["-50%", "0%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {step === "form" ? (
        <>
          <h3 className="font-bold text-lg text-white mb-1">Hızlı Iletisim</h3>
          <p className="text-zinc-500 text-sm mb-5">Formu doldurun, size ulasalım.</p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Ad Soyad</label>
                <input className={inputCls} placeholder="Adınız" value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Telefon</label>
                <input className={inputCls} placeholder="0555 000 00 00" value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">E-posta</label>
              <input type="email" className={inputCls} placeholder="ornek@firma.com" value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Hizmet</label>
              <select className={`${inputCls} cursor-pointer`} value={form.service}
                onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))} required>
                <option value="">Seçiniz</option>
                <option value="Web Yazılım & Tasarım">Web Yazılım & Tasarım</option>
                <option value="Mobil Uygulama">Mobil Uygulama</option>
                <option value="Masaüstü Yazılım">Masaüstü Yazılım</option>
                <option value="Siber güvenlik">Siber güvenlik</option>
                <option value="SEO & Dijital Pazarlama">SEO & Dijital Pazarlama</option>
                <option value="Diger">Diger</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Mesajınız</label>
              <textarea className={`${inputCls} resize-none h-20`} placeholder="Projenizden kısaca bahsedin..."
                value={form.detail} onChange={(e) => setForm((f) => ({ ...f, detail: e.target.value }))} />
            </div>

            {/* Iletisim yöntemi */}
            <div>
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2">Size nasıl ulasalım?</label>
              <div className="grid grid-cols-3 gap-2">
                {CONTACT_METHODS.map(({ id, label, icon: MIcon, desc, color }) => (
                  <button key={id} type="button" onClick={() => setMethod(id)}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all"
                    style={{
                      border: method === id ? `1px solid ${color}50` : "1px solid rgba(255,255,255,0.08)",
                      background: method === id ? `${color}10` : "var(--color-card-bg)",
                      color: method === id ? color : "#71717a",
                    }}
                  >
                    <MIcon className="w-4 h-4" />
                    <span>{label}</span>
                    <span className="text-[9px] opacity-60">{desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-zinc-950 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #22d3ee, #a78bfa)", boxShadow: "0 0 20px rgba(34,211,238,0.30)" }}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {loading ? "gönderiliyor..." : "gönder"}
            </button>

            {error && (
              <p className="text-sm text-red-400 text-center bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                {error}
              </p>
            )}
          </form>
        </>
      ) : (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, delay: 0.1 }}>
            <CheckCircle className="w-14 h-14 text-emerald-400" />
          </motion.div>
          <h3 className="font-bold text-xl text-white">Mesajınız Alındı!</h3>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
            En kısa sürede <span className="text-white font-medium">{method === "whatsapp" ? "WhatsApp" : method === "email" ? "e-posta" : "Telegram"}</span> üzerinden size ulasacagız.
          </p>
          <button onClick={() => setStep("form")} className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors mt-2">
            Yeni mesaj gönder
          </button>
        </div>
      )}
    </motion.div>
  );
};

// ─── Ana bilesen ─────────────────────────────────────────────────────────────

export default function ContactPageClient() {
  const infoRef = useRef(null);
  const mapRef  = useRef(null);
  const isInfoInView = useInView(infoRef, { once: true, amount: 0.2 });
  const isMapInView  = useInView(mapRef,  { once: true, amount: 0.2 });
  const t = useTranslations("contact");

  return (
    <div className="min-h-screen">

      {/* ══ PARALLAX HERO ══════════════════════════════════════════════ */}
      <ParallaxHero
        badge="Iletisim"
        badgeIcon={<Send className="w-3.5 h-3.5" />}
        title="Bize Ulasın"
        subtitle="Projenizi konusmak, teklif almak veya soru sormak için — her zaman buradayız. Ortalama yanıt süremiz 2 saatin altında."
        accentColor={BRAND_COLORS.secondary}
        secondaryColor={BRAND_COLORS.primary}
        ctaPrimary={{ label: "Teklif Formu Aç", onClick: () => teklifModal.open() }}
        ctaSecondary={{ label: "WhatsApp", href: `https://wa.me/${BRAND_COMPANY.phone.replace(/\D/g, "")}` }}
        stats={[
          { value: "<2h", label: "Yanıt Süresi" },
          { value: "7/7", label: "Ulasılabilirlik" },
          { value: "15+", label: "Yıl Deneyim" },
          { value: "150+", label: "Mutlu Müsteri" },
        ]}
        className="min-h-[60vh]"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ══ ILETIsIM DETAYLARI + FORM ═══════════════════════════════ */}
        <section ref={infoRef} className="py-20 lg:py-28 border-t border-white/[0.05]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            {/* Sol — Iletisim bilgileri */}
            <div className="flex flex-col gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInfoInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
              >
                <h2
                  className="font-black text-2xl md:text-3xl mb-2"
                  style={{
                    background: "linear-gradient(135deg, #fff 15%, #22d3ee 70%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Iletisim Bilgileri
                </h2>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Ulasamadıgınızda cep numaramızdan normal mesaj veya WhatsApp bırakabilirsiniz.
                </p>
              </motion.div>

              <div className="flex flex-col gap-5">
                {CONTACT_CHANNELS.map((ch, i) => (
                  <InfoRow
                    key={ch.label}
                    icon={ch.icon}
                    label={ch.label}
                    value={ch.value}
                    href={ch.href}
                    color={ch.color}
                    delay={0.1 + i * 0.1}
                    isInView={isInfoInView}
                  />
                ))}
              </div>

              {/* Çalısma saatleri */}
              <motion.div
                className="p-5 rounded-2xl"
                style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)" }}
                initial={{ opacity: 0, y: 12 }}
                animate={isInfoInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.55 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest">Çalısma Saatleri</span>
                </div>
                <div className="flex flex-col gap-2.5">
                  {[
                    { day: "Hafta Içi", hours: "10:00 – 17:00", active: true },
                    { day: "Hafta Sonu", hours: "Açık", active: false },
                  ].map((row) => (
                    <div key={row.day} className="flex items-center justify-between">
                      <span className="text-sm text-zinc-400">{row.day}</span>
                      <span className={`text-sm font-medium ${row.active ? "text-emerald-400" : "text-zinc-300"}`}>{row.hours}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Acil Iletisim */}
              <motion.a
                href={`https://wa.me/${BRAND_COMPANY.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                style={{ background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.18)" }}
                initial={{ opacity: 0, y: 12 }}
                animate={isInfoInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.65 }}
                whileHover={{ boxShadow: "0 4px 24px rgba(52,211,153,0.12)" }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(52,211,153,0.15)" }}>
                  <MessageCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-emerald-400">WhatsApp'tan Yazın</p>
                  <p className="text-xs text-zinc-500">genellikle birkaç dakika içinde yanıt</p>
                </div>
                <Zap className="w-4 h-4 text-emerald-400 ml-auto opacity-60 group-hover:opacity-100 transition-opacity" />
              </motion.a>
            </div>

            {/* Sag — Form */}
            <QuickContactForm isInView={isInfoInView} />
          </div>
        </section>

        {/* ══ HARITA ════════════════════════════════════════════════════ */}
        <section ref={mapRef} className="py-20 lg:py-28 border-t border-white/[0.05]">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={isMapInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <h2
              className="font-black text-2xl md:text-3xl mb-2"
              style={{
                background: "linear-gradient(135deg, #fff 15%, #fbbf24 70%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Ofisimiz
            </h2>
            <p className="text-zinc-500 text-sm">{BRAND_COMPANY.address}</p>
          </motion.div>
          <motion.div
            className="relative rounded-2xl overflow-hidden min-h-[380px]"
            style={{ border: "1px solid rgba(255,255,255,0.07)" }}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={isMapInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <GoogleMap center={{ lat: 41.0682, lng: 28.9862 }} zoom={15} className="w-full h-full" />
            <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-950/80 border border-white/10 backdrop-blur-sm pointer-events-none">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs text-zinc-300 font-medium">{BRAND_COMPANY.addressShort} 🇹🇷</span>
            </div>
          </motion.div>
        </section>

      </div>
    </div>
  );
}
