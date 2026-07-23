import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Container from "@/components/Common/Container/Container";
import Link from "next/link";
import { SITE_URL } from "@/config/config";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("privacy");
  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: `${SITE_URL}/privacy-policy` },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

export default async function PrivacyPolicyPage() {
  const t = await getTranslations("privacy");

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
            <h2 className="text-2xl font-semibold text-zinc-100">{t("sections.introduction.title")}</h2>
            <p className="text-zinc-300 leading-relaxed">
              {t("sections.introduction.content")}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-zinc-100">{t("sections.information.title")}</h2>
            <p className="text-zinc-300 leading-relaxed">{t("sections.information.intro")}</p>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>{t("sections.information.items.personal")}</li>
              <li>{t("sections.information.items.technical")}</li>
              <li>{t("sections.information.items.usage")}</li>
              <li>{t("sections.information.items.cookies")}</li>
              <li>{t("sections.information.items.advertising")}</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-zinc-100">{t("sections.usage.title")}</h2>
            <p className="text-zinc-300 leading-relaxed">{t("sections.usage.intro")}</p>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>{t("sections.usage.items.provide")}</li>
              <li>{t("sections.usage.items.improve")}</li>
              <li>{t("sections.usage.items.personalize")}</li>
              <li>{t("sections.usage.items.communicate")}</li>
              <li>{t("sections.usage.items.advertising")}</li>
              <li>{t("sections.usage.items.security")}</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-zinc-100">{t("sections.adsense.title")}</h2>
            <p className="text-zinc-300 leading-relaxed">
              {t("sections.adsense.content")}
            </p>
            <p className="text-zinc-300 leading-relaxed">
              {t("sections.adsense.optout")}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-zinc-100">{t("sections.sharing.title")}</h2>
            <p className="text-zinc-300 leading-relaxed">{t("sections.sharing.intro")}</p>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>{t("sections.sharing.items.service")}</li>
              <li>{t("sections.sharing.items.advertising")}</li>
              <li>{t("sections.sharing.items.analytics")}</li>
              <li>{t("sections.sharing.items.legal")}</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-zinc-100">{t("sections.cookies.title")}</h2>
            <p className="text-zinc-300 leading-relaxed">
              {t("sections.cookies.content")}
            </p>
            <p className="text-zinc-300 leading-relaxed">
              {t("sections.cookies.manage")}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-zinc-100">{t("sections.security.title")}</h2>
            <p className="text-zinc-300 leading-relaxed">
              {t("sections.security.content")}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-zinc-100">{t("sections.rights.title")}</h2>
            <p className="text-zinc-300 leading-relaxed">{t("sections.rights.intro")}</p>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>{t("sections.rights.items.access")}</li>
              <li>{t("sections.rights.items.correct")}</li>
              <li>{t("sections.rights.items.delete")}</li>
              <li>{t("sections.rights.items.object")}</li>
              <li>{t("sections.rights.items.portable")}</li>
              <li>{t("sections.rights.items.withdraw")}</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-zinc-100">{t("sections.children.title")}</h2>
            <p className="text-zinc-300 leading-relaxed">
              {t("sections.children.content")}
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
