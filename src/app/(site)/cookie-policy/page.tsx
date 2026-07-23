import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Container from "@/components/Common/Container/Container";
import Link from "next/link";
import { SITE_URL } from "@/config/config";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("cookies");
  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: `${SITE_URL}/cookie-policy` },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

export default async function CookiePolicyPage() {
  const t = await getTranslations("cookies");

  return (
    <Container withPadding className="py-16 max-w-4xl mx-auto">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold bg-prism-gradient bg-clip-text text-transparent mb-4">
            {t("title")}
          </h1>
          <p className="text-zinc-400 text-sm">{t("lastUpdated")}</p>
        </div>

        <div className="prose prose-inverse max-w-none space-y-6">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-zinc-100">{t("sections.what.title")}</h2>
            <p className="text-zinc-300 leading-relaxed">
              {t("sections.what.content")}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-zinc-100">{t("sections.types.title")}</h2>
            <p className="text-zinc-300 leading-relaxed">{t("sections.types.intro")}</p>
            
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/50">
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">{t("sections.types.essential.title")}</h3>
                <p className="text-zinc-300 text-sm">{t("sections.types.essential.content")}</p>
              </div>
              
              <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/50">
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">{t("sections.types.analytics.title")}</h3>
                <p className="text-zinc-300 text-sm">{t("sections.types.analytics.content")}</p>
              </div>
              
              <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/50">
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">{t("sections.types.advertising.title")}</h3>
                <p className="text-zinc-300 text-sm">{t("sections.types.advertising.content")}</p>
              </div>
              
              <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/50">
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">{t("sections.types.functional.title")}</h3>
                <p className="text-zinc-300 text-sm">{t("sections.types.functional.content")}</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-zinc-100">{t("sections.adsense.title")}</h2>
            <p className="text-zinc-300 leading-relaxed">
              {t("sections.adsense.content")}
            </p>
            <p className="text-zinc-300 leading-relaxed">
              {t("sections.adsense.details")}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-zinc-100">{t("sections.thirdParty.title")}</h2>
            <p className="text-zinc-300 leading-relaxed">{t("sections.thirdParty.intro")}</p>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>{t("sections.thirdParty.items.google")}</li>
              <li>{t("sections.thirdParty.items.analytics")}</li>
              <li>{t("sections.thirdParty.items.social")}</li>
              <li>{t("sections.thirdParty.items.advertising")}</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-zinc-100">{t("sections.manage.title")}</h2>
            <p className="text-zinc-300 leading-relaxed">
              {t("sections.manage.content")}
            </p>
            <p className="text-zinc-300 leading-relaxed mt-2">
              {t("sections.manage.browser")}
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-300 mt-2">
              <li>{t("sections.manage.browsers.chrome")}</li>
              <li>{t("sections.manage.browsers.firefox")}</li>
              <li>{t("sections.manage.browsers.safari")}</li>
              <li>{t("sections.manage.browsers.edge")}</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-zinc-100">{t("sections.consent.title")}</h2>
            <p className="text-zinc-300 leading-relaxed">
              {t("sections.consent.content")}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-zinc-100">{t("sections.updates.title")}</h2>
            <p className="text-zinc-300 leading-relaxed">
              {t("sections.updates.content")}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-zinc-100">{t("sections.contact.title")}</h2>
            <p className="text-zinc-300 leading-relaxed">{t("sections.contact.intro")}</p>
            <ul className="space-y-2 text-zinc-300">
              <li><strong>{t("sections.contact.email.label")}</strong> {t("sections.contact.email.value")}</li>
              <li><strong>{t("sections.contact.address.label")}</strong> {t("sections.contact.address.value")}</li>
            </ul>
          </section>
        </div>

        <div className="pt-8 border-t border-zinc-800">
          <Link 
            href="/" 
            className="text-prism-cyan hover:text-prism-violet transition-colors duration-300 inline-flex items-center gap-2"
          >
            ← {t("backToHome")}
          </Link>
        </div>
      </div>
    </Container>
  );
}
