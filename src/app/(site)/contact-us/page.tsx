import { SITE_URL } from "@/config/config";
import { BRAND_COMPANY } from "@/config/brand.config";
import { Metadata } from "next";
import PageTransitionWrapper from "@/components/Animate/PageTransitionWrapper/PageTransitionWrapper";
import ContactPageClient from "./ContactPageClient";

const faqItems = [
  {
    question: "XipSoft ile nasıl iletisime geçebilirim?",
    answer: "Telefon (+90 544 454 84 44), e-posta (info@xipsoft.net), WhatsApp veya bu sayfadaki iletisim formu aracılıgıyla bize ulasabilirsiniz.",
  },
  {
    question: "Ücretsiz teklif alabilir miyim?",
    answer: "Evet, tüm projeler için ücretsiz ön görüsme ve teklif sunuyoruz. Formu doldurun, 24 saat içinde size dönelim.",
  },
  {
    question: "Ofisiniz nerede?",
    answer: "Merkez ofisimiz Istanbul sisli'de, Nurol Tower'da bulunmaktadır. Adres: Nurol Tower, Izzet Pasa, Yeni Yol Cd. No:3 Kat:22, 34381 sisli/Istanbul.",
  },
  {
    question: "Çalısma saatleriniz nedir?",
    answer: "Hafta içi 10:00 - 17:00, hafta sonu açık hizmet veriyoruz. Acil durumlar için WhatsApp üzerinden ulasabilirsiniz.",
  },
  {
    question: "Istanbul dısındaki müsterilere hizmet veriyor musunuz?",
    answer: "Evet, tüm Türkiye genelinde uzaktan hizmet veriyoruz. Video konferans ve online toplantılarla proje süreçlerini yönetiyoruz.",
  },
];

// ISR - 30 dakikada bir yenilenir, API yükünü azaltır
export const revalidate = 1800;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Iletisim | Xipsoft",
    description: "XipSoft ile iletisime geçin. Telefon, e-posta veya WhatsApp üzerinden bize ulasın. Ücretsiz teklif için formu doldurun.",
    alternates: { canonical: `${SITE_URL}/contact-us` },
    robots: { index: true, follow: true },
    opengraph: {
      type: "website",
      locale: "tr_TR",
      url: `${SITE_URL}/contact-us`,
      siteName: "XipSoft",
      title: "Iletisim | XipSoft",
      description: "XipSoft ile iletisime geçin. Ücretsiz teklif için formu doldurun.",
      images: [{ url: `${SITE_URL}/images/xipsoft-seo.png`, width: 1200, height: 630, alt: "XipSoft Iletisim" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Iletisim | XipSoft",
      images: [`${SITE_URL}/images/xipsoft-seo.png`],
    },
  };
}

const ContactUsPage = () => {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: BRAND_COMPANY.legalName,
    url: `${SITE_URL}/contact-us`,
    telephone: BRAND_COMPANY.phone,
    email: BRAND_COMPANY.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: BRAND_COMPANY.address,
      addressLocality: BRAND_COMPANY.district,
      addressRegion: "Istanbul",
      postalCode: BRAND_COMPANY.postalCode,
      addressCountry: BRAND_COMPANY.countryCode,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "10:00",
        closes: "17:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday"],
        opens: "00:00",
        closes: "23:59",
      },
    ],
    sameAs: [
      `https://github.com/xiplarexs`,
      `https://t.me/xipsoft`,
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <PageTransitionWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: "Iletisim", item: `${SITE_URL}/contact-us` },
            ],
          }),
        }}
      />
      <ContactPageClient />
    </PageTransitionWrapper>
  );
};

export default ContactUsPage;
