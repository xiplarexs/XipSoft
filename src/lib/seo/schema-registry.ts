/**
 * SEO Schema Registry
 * JSON-LD structured data helpers for various page types.
 */

import { SITE_URL } from "@/lib/site-url";

// ── ProfilePage ───────────────────────────────────────────────────────────────
interface ProfilePageSchemaOptions {
  nick: string;
  displayName: string;
}

export function profilePageSchema({ nick, displayName }: ProfilePageSchemaOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "name": displayName,
    "url": `${SITE_URL}/x/${nick}`,
    "mainEntity": {
      "@type": "Person",
      "name": displayName,
      "identifier": nick,
    },
  };
}

// ── BreadcrumbList ────────────────────────────────────────────────────────────
export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

// ── Blog (from DB) ────────────────────────────────────────────────────────────
interface BlogSchemaFromDbOptions {
  url: string;
  title: string;
  description: string;
  image?: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
}

export function blogSchemaFromDb({
  url,
  title,
  description,
  image,
  author,
  datePublished,
  dateModified,
}: BlogSchemaFromDbOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "url": url.startsWith("http") ? url : `${SITE_URL}${url}`,
    ...(image ? { "image": image } : {}),
    ...(author
      ? { "author": { "@type": "Person", "name": author } }
      : { "author": { "@type": "Organization", "name": "XipSoft" } }),
    ...(datePublished ? { "datePublished": datePublished } : {}),
    ...(dateModified ? { "dateModified": dateModified } : {}),
    "publisher": {
      "@type": "Organization",
      "name": "XipSoft",
      "url": SITE_URL,
    },
  };
}
