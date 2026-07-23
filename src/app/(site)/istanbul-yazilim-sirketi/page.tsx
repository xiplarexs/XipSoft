import { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site-url";
import { BRAND_COMPANY, BRAND_COLORS } from "@/config/brand.config";

export const metadata: Metadata = {
  title: "Istanbul Yazılım sirketi | Next.js & PostgreSQL Uzmanı — Xipsoft",
  description:
    "Istanbul merkezli yazılım sirketi Xipsoft: Next.js, React Native, PostgreSQL ile web ve mobil uygulama gelistirme. Kadıköy, sisli, Besiktas, Levent ve Maslak'a hizmet.",
  keywords: [
    "Istanbul yazılım sirketi",
    "Kadıköy yazılım",
    "sisli yazılım",
    "Besiktas yazılım",
    "Next.js Istanbul",
    "PostgreSQL uzmanı",
    "React Native Istanbul",
    "web yazılım Istanbul",
    "mobil uygulama Istanbul",
  ],
  alternates: { canonical: `${SITE_URL}/istanbul-yazilim-sirketi` },
  opengraph: {
    type: "website",
    url: `${SITE_URL}/istanbul-yazilim-sirketi`,
    title: "Istanbul Yazılım sirketi | Xipsoft",
    description: "Next.js, PostgreSQL ve Tailwind CSS ile kurumsal web ve mobil uygulama gelistiren Istanbul merkezli yazılım sirketi.",
    locale: "tr_TR",
    images: [{ url: `${SITE_URL}/images/xipsoft-seo.png`, width: 1200, height: 630, alt: "Xipsoft — Istanbul Yazılım sirketi" }],
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "XipSoft Yazılım ve Teknoloji Sistemleri",
    url: SITE_URL,
    telephone: BRAND_COMPANY.phone,
    email: BRAND_COMPANY.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Nurol Tower, Izzet Pasa, Yeni Yol Cd. No:3 Kat:22",
      addressLocality: "sisli",
      addressRegion: "Istanbul",
      postalCode: "34381",
      addressCountry: "TR",
    },
    geo: { "@type": "geoCoordinates", latitude: 41.0682, longitude: 28.9862 },
    openingHours: "Mo-Fr 10:00-17:00",
    description: "Istanbul merkezli yazılım sirketi. Web, mobil, masaüstü ve siber güvenlik çözümleri.",
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Istanbul Yazılım sirketi", item: `${SITE_URL}/istanbul-yazilim-sirketi` },
    ],
  },
];

const STACK_ITEMS = [
  {
    title: "Next.js 16+",
    color: BRAND_COLORS.secondary,
    desc: "SSR, ISR ve Edge Runtime ile yüksek performanslı web uygulamaları. Core Web Vitals odaklı gelistirme ile LCP süresini 2.5 saniyenin altına indiriyoruz.",
  },
  {
    title: "PostgreSQL & NeonDB",
    color: BRAND_COLORS.primary,
    desc: "Serverless veritabanı optimizasyonu. EXPLAIN ANALYZE ile sorgu planı analizi, index stratejisi ve %40'a varan hız kazanımları.",
  },
  {
    title: "Tailwind CSS",
    color: BRAND_COLORS.accent,
    desc: "Responsive ve özellestirilebilir arayüzler. Mobil öncelikli tasarım, dark/light mode destegi ve erisilebilirlik standartları.",
  },
  {
    title: "React Native / Swift / Kotlin",
    color: BRAND_COLORS.gold,
    desc: "iOS ve Android için native performanslı mobil uygulamalar. App Store ve google Play yayın süreçleri dahil.",
  },
  {
    title: "Siber güvenlik",
    color: "#34d399",
    desc: "Penetrasyon testi, güvenlik denetimi, OWASP Top 10 uyumlulugu ve güvenli kod gelistirme danısmanlıgı.",
  },
  {
    title: "SEO & Dijital Pazarlama",
    color: "#c084fc",
    desc: "Teknik SEO, içerik stratejisi, google Search Console optimizasyonu ve Core Web Vitals iyilestirme.",
  },
];

const DISTRICTS = [
  "sisli", "Besiktas", "Kadıköy", "Levent", "Maslak",
  "Atasehir", "Ümraniye", "Maltepe", "Bakırköy", "Sarıyer",
];

const DISTRICT_COLORS = [BRAND_COLORS.secondary, BRAND_COLORS.primary, BRAND_COLORS.accent, BRAND_COLORS.gold, "#34d399", "#c084fc"];

export default function IstanbulYazilimSirketiPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="min-h-screen relative">
        {/* Arka plan efekti */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 70% 50% at 50% 0%, rgba(34,211,238,0.12) 0%, transparent 60%),
              radial-gradient(ellipse 50% 40% at 0% 100%, rgba(167,139,250,0.10) 0%, transparent 55%)
            `,
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34,211,238,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34,211,238,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-10 text-sm text-zinc-600">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-zinc-300 transition-colors">Ana Sayfa</Link>
              </li>
              <li className="text-zinc-700">/</li>
              <li className="text-zinc-400">Istanbul Yazılım sirketi</li>
            </ol>
          </nav>

          {/* Hero */}
          <div className="mb-16">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-5 text-xs font-semibold"
              style={{ background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.25)", color: "#22d3ee" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono uppercase tracking-wider">sisli / Istanbul</span>
            </div>

            <h1
              className="font-black leading-tight mb-6"
              style={{
                fontSize: "clamp(2.2rem, 6vw, 4.5rem)",
                background: "linear-gradient(145deg, #fff 10%, #22d3ee 55%, #a78bfa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 35px rgba(34,211,238,0.35))",
              }}
            >
              Istanbul&apos;un<br />Yazılım sirketi
            </h1>

            <p className="text-zinc-400 max-w-2xl leading-relaxed text-lg">
              Xipsoft olarak Istanbul genelinde{" "}
              <strong className="text-zinc-200">Next.js, PostgreSQL ve Tailwind CSS</strong>{" "}
              teknolojileri ile kurumsal web ve mobil uygulamalar gelistiriyoruz.
              sisli merkezli ofisimizden Istanbul&apos;un tüm ilçelerine hizmet veriyoruz.
            </p>
          </div>

          {/* Teknoloji Stack */}
          <section aria-labelledby="stack-heading" className="mb-20">
            <h2
              id="stack-heading"
              className="font-black mb-8"
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                background: "linear-gradient(135deg, #fff 10%, #a78bfa 70%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Istanbul Firmalarına Özel<br />Teknoloji Stack&apos;imiz
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {STACK_ITEMS.map((item) => (
                <div
                  key={item.title}
                  className="group relative p-6 rounded-2xl overflow-hidden transition-all duration-400 hover:-translate-y-1"
                  style={{
                    background: "var(--color-card-bg)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-[1.5px]"
                    style={{ background: `linear-gradient(90deg, transparent, ${item.color}60, transparent)` }}
                  />
                  <div
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider mb-3"
                    style={{ background: `${item.color}12`, color: item.color, border: `1px solid ${item.color}20` }}
                  >
                    {item.title}
                  </div>
                  <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Neden Xipsoft */}
          <section aria-labelledby="why-heading" className="mb-20">
            <h2
              id="why-heading"
              className="font-black mb-6"
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                background: "linear-gradient(135deg, #fff 10%, #fb7185 70%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Neden Isletmeler<br />Xipsoft&apos;u Tercih Ediyor?
            </h2>

            <div
              className="p-7 rounded-2xl"
              style={{
                background: "var(--color-card-bg)",
                border: "1px solid var(--color-border)",
              }}
            >
              <p className="text-zinc-400 mb-4 leading-relaxed">
                google Core Web Vitals odaklı gelistirme ile web sitenizin{" "}
                <strong className="text-zinc-200">LCP süresini 2.5 saniyenin altına</strong>{" "}
                indiriyoruz. PostgreSQL sorgu optimizasyonu ile veri yogun projelerde{" "}
                <strong className="text-zinc-200">%40&apos;a varan hız kazanımı</strong> saglıyoruz.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                15 yıllık deneyimimizle Istanbul&apos;daki ofisinizden veya remote çalısarak
                projeleri <strong className="text-zinc-200">zamanında ve eksiksiz</strong> teslim
                ediyoruz. Her projede teknik dokümantasyon, test coverage ve deployment
                destegi standart olarak sunulmaktadır.
              </p>
            </div>
          </section>

          {/* Hizmet Verilen Ilçeler */}
          <section aria-labelledby="districts-heading" className="mb-20">
            <h2
              id="districts-heading"
              className="font-black mb-6"
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                background: "linear-gradient(135deg, #fff 10%, #fbbf24 70%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Hizmet Verdigimiz Ilçeler
            </h2>

            <ul className="flex flex-wrap gap-2.5" role="list">
              {DISTRICTS.map((district, i) => {
                const color = DISTRICT_COLORS[i % DISTRICT_COLORS.length]!;
                return (
                  <li
                    key={district}
                    className="px-4 py-2 rounded-full text-sm font-semibold transition-all hover:-translate-y-0.5"
                    style={{
                      background: `${color}0c`,
                      border: `1px solid ${color}30`,
                      color,
                    }}
                  >
                    {district}
                  </li>
                );
              })}
            </ul>
          </section>

          {/* CTA */}
          <section
            aria-labelledby="cta-heading"
            className="relative rounded-3xl p-10 md:p-14 overflow-hidden"
            style={{
              background: "linear-gradient(160deg, rgba(34,211,238,0.07), rgba(167,139,250,0.05), rgba(255,255,255,0.03))",
              border: "1px solid rgba(34,211,238,0.16)",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at center, rgba(34,211,238,0.08) 0%, transparent 70%)" }}
            />
            <h2
              id="cta-heading"
              className="relative z-10 font-black mb-3"
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                background: "linear-gradient(135deg, #fff 15%, #22d3ee 65%, #a78bfa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Istanbul&apos;da Yazılım<br />Ihtiyacınız mı Var?
            </h2>
            <p className="relative z-10 text-zinc-400 mb-7 leading-relaxed max-w-xl">
              Projenizi görüsmek ve ücretsiz teklif almak için iletisime geçin.
              Next.js, React Native veya PostgreSQL tabanlı projelerinizde yanınızdayız.
            </p>
            <div className="relative z-10 flex flex-wrap gap-3">
              <Link
                href="/contact-us"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-zinc-950 transition-all hover:scale-[1.03] active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #22d3ee, #a78bfa)",
                  boxShadow: "0 0 22px rgba(34,211,238,0.40)",
                }}
              >
                Ücretsiz Teklif Al
              </Link>
              <Link
                href="/hizmetler/web-yazilim-tasarim"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02]"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.78)",
                }}
              >
                Hizmetlerimizi Incele
              </Link>
            </div>
          </section>

        </main>
      </div>
    </>
  );
}
