import { displayFont, bodyFont, monoFont, navbarFont } from "@/fonts/fonts";
import { cn } from "@/utils";
import type { Metadata } from "next";
import APP_CONFIg, { SITE_URL } from "@/config/config";
import { BRAND } from "@/config/brand.config";
import { defaultFont } from "@/config/fonts.config";
import Favicons from "@/components/Favicons/Favicons";
import "@/styles/globals.scss";
import "@/styles/home-lcp.css";
import "@/styles/colors-glass.css";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

const Og_IMAgE = {
  url: `${SITE_URL}/images/xipsoft-seo.png`,
  width: 1200,
  height: 630,
  alt: BRAND.name,
  type: "image/png",
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: APP_CONFIg.title, template: `%s | Xipsoft` },
    description: APP_CONFIg.description,
    keywords: [
      "web yazılım", "mobil uygulama gelistirme", "siber güvenlik",
      "seo hizmetleri", "masaüstü yazılım", "dijital pazarlama",
      "xipsoft", "yazılım teknoloji sistemleri",
    ],
    authors: [{ name: BRAND.name, url: SITE_URL }],
    creator: BRAND.name,
    publisher: BRAND.name,
    robots: {
      index: true, follow: true,
      googleBot: {
        index: true, follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    opengraph: {
      type: "website", url: SITE_URL,
      title: APP_CONFIg.title, description: APP_CONFIg.description,
      siteName: BRAND.name, locale: "tr_TR",
      alternateLocale: ["en_US"],
      images: [Og_IMAgE],
    },
    twitter: {
      card: "summary_large_image",
      title: APP_CONFIg.title, description: APP_CONFIg.description,
      images: [Og_IMAgE],
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [locale, messages] = await Promise.all([
    getLocale(),
    getMessages(),
  ]);

  const cls = cn(
    displayFont.variable,
    bodyFont.variable,
    monoFont.variable,
    navbarFont.variable,
    "min-h-screen scroll-smooth overflow-x-hidden",
  );

  return (
    <html
      lang={locale}
      data-theme="obsidian"
      data-site-font={defaultFont}
      className="dark overflow-x-hidden"
      suppressHydrationWarning
    >
      <head suppressHydrationWarning>
        <Favicons />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className={cls} suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <LanguageProvider>
            <AuthProvider>
              <CartProvider>
                {children}
              </CartProvider>
            </AuthProvider>
          </LanguageProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
