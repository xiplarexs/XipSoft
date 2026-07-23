import { Metadata } from "next";
import { SITE_URL } from "@/config/config";
import ProfilePageClient from "./ProfilePageClient";
import { profilePageSchema } from "@/seobot/schema-registry";

interface ProfilePageProps {
  params: Promise<{ nick: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { nick } = await params;

  return {
    title: `${nick} | Xipsoft`,
    description: `${nick} kullanıcısının Xipsoft profili.`,
    alternates: { canonical: `${SITE_URL}/x/${nick}` },
    robots: {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    },
    opengraph: {
      type: "profile",
      locale: "tr_TR",
      url: `${SITE_URL}/x/${nick}`,
      siteName: "Xipsoft Software & Technology Systems",
      title: `${nick} | Xipsoft`,
      description: `${nick} kullanıcısının Xipsoft profili.`,
      images: [{ url: `${SITE_URL}/images/xipsoft-seo.png`, width: 1200, height: 630, alt: nick }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${nick} | Xipsoft`,
      description: `${nick} kullanıcısının Xipsoft profili.`,
      images: [`${SITE_URL}/images/xipsoft-seo.png`],
    },
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { nick } = await params;
  const schema = profilePageSchema({ nick, displayName: nick });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ProfilePageClient />
    </>
  );
}
