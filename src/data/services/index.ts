export type { ServicePageData } from "./types";

import { webYazilimTasarimData } from "./web-yazilim-tasarim";
import { mobilUygulamaData } from "./mobil-uygulama";
import { masaustuYazilimData } from "./masaustu-yazilim";
import { siberguvenlikData } from "./siber-guvenlik";
import { seoDijitalPazarlamaData } from "./seo-dijital-pazarlama";
import { yapayZekaOtomasyonData } from "./yapay-zeka-otomasyon";
import { bulutDevopsData } from "./bulut-devops";
import { apiEntegrasyonData } from "./api-entegrasyon";
import { veriAnaliziBiData } from "./veri-analizi-bi";
import type { ServicePageData } from "./types";

export const services: Record<string, ServicePageData> = {
  "web-yazilim-tasarim": webYazilimTasarimData,
  "mobil-uygulama": mobilUygulamaData,
  "masaustu-yazilim": masaustuYazilimData,
  "siber-guvenlik": siberguvenlikData,
  "seo-dijital-pazarlama": seoDijitalPazarlamaData,
  "yapay-zeka-otomasyon": yapayZekaOtomasyonData,
  "bulut-devops": bulutDevopsData,
  "api-entegrasyon": apiEntegrasyonData,
  "veri-analizi-bi": veriAnaliziBiData,
};

export const SERVICE_SLUgS = Object.keys(services);
export const SERVICE_SLUgS_WITH_DISTRICTS = SERVICE_SLUgS.filter((s) => services[s]?.hasDistricts);

export function getServiceBySlug(slug: string): ServicePageData | undefined {
  return services[slug];
}

export function sanitizeServiceData(svc: ServicePageData): ServicePageData {
  const badgeIcon = typeof svc.badgeIcon === "string" ? svc.badgeIcon : (svc.badgeIcon?.displayName || "globe");
  const features = svc.features.map(f => ({
    ...f,
    icon: typeof f.icon === "string" ? f.icon : (f.icon?.displayName || "globe"),
  }));
  const microServices = svc.microServices.map(m => ({
    ...m,
    icon: typeof m.icon === "string" ? m.icon : (m.icon?.displayName || "globe"),
  }));
  return { ...svc, badgeIcon, features, microServices };
}
