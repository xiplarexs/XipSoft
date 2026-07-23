import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Container from "@/components/Common/Container/Container";
import Link from "next/link";
import { SITE_URL } from "@/config/config";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("terms");
  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: `${SITE_URL}/terms-of-service` },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

export default async function TermsOfServicePage() {
  const t = await getTranslations("terms");

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
            <h2 className="text-2xl font-semibold text-zinc-100">{t("sections.acceptance.title")}</h2>
            <p className="text-zinc-300 leading-relaxed">
              {t("sections.acceptance.content")}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-zinc-100">{t("sections.services.title")}</h2>
            <p className="text-zinc-300 leading-relaxed">
              {t("sections.services.content")}
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>{t("sections.services.items.web")}</li>
              <li>{t("sections.services.items.mobile")}</li>
              <li>{t("sections.services.items.desktop")}</li>
              <li>{t("sections.services.items.consulting")}</li>
              <li>{t("sections.services.items.community")}</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-zinc-100">{t("sections.accounts.title")}</h2>
            <p className="text-zinc-300 leading-relaxed">{t("sections.accounts.intro")}</p>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>{t("sections.accounts.items.accurate")}</li>
              <li>{t("sections.accounts.items.secure")}</li>
              <li>{t("sections.accounts.items.responsible")}</li>
              <li>{t("sections.accounts.items.notify")}</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-zinc-100">{t("sections.intellectual.title")}</h2>
            <p className="text-zinc-300 leading-relaxed">
              {t("sections.intellectual.content")}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-zinc-100">{t("sections.userContent.title")}</h2>
            <p className="text-zinc-300 leading-relaxed">{t("sections.userContent.intro")}</p>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>{t("sections.userContent.items.illegal")}</li>
              <li>{t("sections.userContent.items.harmful")}</li>
              <li>{t("sections.userContent.items.infringing")}</li>
              <li>{t("sections.userContent.items.spam")}</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-zinc-100">{t("sections.prohibited.title")}</h2>
            <p className="text-zinc-300 leading-relaxed">{t("sections.prohibited.intro")}</p>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>{t("sections.prohibited.items.violate")}</li>
              <li>{t("sections.prohibited.items.exploit")}</li>
              <li>{t("sections.prohibited.items.interfere")}</li>
              <li>{t("sections.prohibited.items.unauthorized")}</li>
              <li>{t("sections.prohibited.items.scrape")}</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-zinc-100">{t("sections.disclaimer.title")}</h2>
            <p className="text-zinc-300 leading-relaxed">
              {t("sections.disclaimer.content")}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-zinc-100">{t("sections.limitation.title")}</h2>
            <p className="text-zinc-300 leading-relaxed">
              {t("sections.limitation.content")}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-zinc-100">{t("sections.termination.title")}</h2>
            <p className="text-zinc-300 leading-relaxed">
              {t("sections.termination.content")}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-zinc-100">{t("sections.governing.title")}</h2>
            <p className="text-zinc-300 leading-relaxed">
              {t("sections.governing.content")}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-zinc-100">{t("sections.changes.title")}</h2>
            <p className="text-zinc-300 leading-relaxed">
              {t("sections.changes.content")}
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
