/**
 * /blog/post?slug=xxx → /blog/xxx (301 kalıcı yönlendirme)
 *
 * Eski URL yapısı google'da düsük öncelikli indexleniyordu.
 * Yeni path-based URL: /blog/[slug]
 *
 * Bu dosya geriye dönük uyumluluk için korunur.
 */

import { permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { SITE_URL } from "@/config/config";

type Props = {
  searchParams: Promise<{ slug?: string }>;
};

export default async function BlogPostRedirectPage({ searchParams }: Props) {
  const { slug } = await searchParams;

  if (slug) {
    permanentRedirect(`/blog/${slug}`);
  }

  permanentRedirect("/blog");
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { slug } = await searchParams;

  if (!slug) {
    return {
      title: "Blog | XipSoft",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: "Blog Yazısı | XipSoft",
    robots: { index: false, follow: false },
    alternates: { canonical: `${SITE_URL}/blog/${slug}` },
  };
}
