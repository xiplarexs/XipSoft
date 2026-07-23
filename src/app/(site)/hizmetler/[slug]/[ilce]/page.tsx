import { notFound } from "next/navigation";
import { Metadata } from "next";
import { SERVICE_SLUgS_WITH_DISTRICTS, getServiceBySlug, sanitizeServiceData } from "@/data/services";
import { DISTRICT_SLUgS, getDistrictBySlug } from "@/data/locations";
import ServiceDistrictPageClient from "./ServiceDistrictPageClient";

export async function generateStaticParams() {
  const params: { slug: string; ilce: string }[] = [];
  for (const slug of SERVICE_SLUgS_WITH_DISTRICTS) {
    for (const district of DISTRICT_SLUgS) {
      params.push({ slug, ilce: district });
    }
  }
  return params;
}

interface Props {
  params: Promise<{ slug: string; ilce: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, ilce } = await params;
  const service = getServiceBySlug(slug);
  const district = getDistrictBySlug(ilce);
  if (!service || !district) return {};

  // Canonical → ana hizmet sayfasına işaret eder (ilçe sayfaları thin content riski)
  const canonical = `https://xipsoft.com/hizmetler/${slug}`;

  return {
    title: `${service.title} ${district.name} | XipSoft`,
    description: `${district.name}'de ${service.title.toLowerCase()} hizmetleri. ${district.description}`,
    keywords: [...service.metadata.keywords, `${district.name} ${service.metadata.keywords[0]}`],
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export default async function ServiceDistrictPage({ params }: Props) {
  const { slug, ilce } = await params;
  const service = getServiceBySlug(slug);
  const district = getDistrictBySlug(ilce);
  if (!service || !district) notFound();
  return <ServiceDistrictPageClient service={sanitizeServiceData(service)} district={district} />;
}
