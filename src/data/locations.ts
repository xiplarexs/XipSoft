/**
 * XipSoft Ofis Konumları ve Iletisim Bilgileri
 * google Maps entegrasyonu için merkezi veri kaynagı
 */

export interface OfficeLocation {
  id: string;
  name: string;
  shortName: string;
  address: string;
  city: string;
  district: string;
  postalCode: string;
  country: string;
  countryCode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  phone: string;
  email: string;
  whatsapp: string;
  workingHours: {
    weekdays: string;
    weekend: string;
  };
  mapZoom: number;
  googleMapsUrl: string;
}

export const OFFICE_LOCATIONS: OfficeLocation[] = [
  {
    id: "istanbul-sisli",
    name: "XipSoft Istanbul Merkez Ofis",
    shortName: "Nurol Tower, sisli",
    address: "Nurol Tower, Izzet Pasa, Yeni Yol Cd. No:3 Kat:22",
    city: "Istanbul",
    district: "sisli",
    postalCode: "34381",
    country: "Türkiye",
    countryCode: "TR",
    coordinates: {
      lat: 41.0682,
      lng: 28.9862,
    },
    phone: "+905444548444",
    email: "info@xipsoft.net",
    whatsapp: "905444548444",
    workingHours: {
      weekdays: "10:00 — 17:00",
      weekend: "Açık",
    },
    mapZoom: 15,
    googleMapsUrl:
      "https://maps.google.com/?q=Nurol+Tower+Mecidiyekoy+Sisli+Istanbul&ll=41.0682,28.9862",
  },
  {
    id: "istanbul-sisli-2",
    name: "XipSoft Istanbul sisli",
    shortName: "sisli",
    address: "Nurol Tower, sisli",
    city: "Istanbul",
    district: "sisli",
    postalCode: "34381",
    country: "Türkiye",
    countryCode: "TR",
    coordinates: { lat: 41.0682, lng: 28.9862 },
    phone: "+905444548444",
    email: "info@xipsoft.net",
    whatsapp: "905444548444",
    workingHours: { weekdays: "10:00 — 17:00", weekend: "Açık" },
    mapZoom: 15,
    googleMapsUrl: "https://maps.google.com/?q=Nurol+Tower+Sisli+Istanbul",
  }
];

/** Varsayılan (ana) ofis */
export const PRIMARY_OFFICE = OFFICE_LOCATIONS[0];

/**
 * Istanbul Ilçeleri — Local SEO için hizmet alanı sayfaları
 * Her ilçe için slug, görünen ad ve kısa açıklama içerir.
 */
export interface ServiceDistrict {
  /** URL slug — ASCII, tire ile ayrılmıs */
  slug: string;
  /** Türkçe görünen ad */
  name: string;
  /** Kısa SEO açıklaması */
  description: string;
}

export const ISTANBUL_DISTRICTS: ServiceDistrict[] = [
  { slug: "sisli",       name: "sisli",       description: "sisli, Istanbul'un is merkezi. XipSoft merkez ofisi sisli'de." },
  { slug: "besiktas",    name: "Besiktas",    description: "Besiktas'ta web yazılım ve dijital çözümler." },
  { slug: "kadikoy",     name: "Kadıköy",     description: "Kadıköy'de profesyonel yazılım ve SEO hizmetleri." },
  { slug: "atasehir",    name: "Atasehir",    description: "Atasehir teknoloji bölgesinde web ve mobil uygulama gelistirme." },
  { slug: "maslak",      name: "Maslak",      description: "Maslak is merkezlerinde kurumsal yazılım çözümleri." },
  { slug: "levent",      name: "Levent",      description: "Levent'te kurumsal web yazılım ve dijital dönüsüm." },
  { slug: "umraniye",    name: "Ümraniye",    description: "Ümraniye'de uygun fiyatlı web yazılım hizmetleri." },
  { slug: "maltepe",     name: "Maltepe",     description: "Maltepe'de web tasarım ve yazılım gelistirme." },
  { slug: "pendik",      name: "Pendik",      description: "Pendik'te e-ticaret ve kurumsal web sitesi çözümleri." },
  { slug: "bakirkoy",    name: "Bakırköy",    description: "Bakırköy'de profesyonel web yazılım ve SEO." },
  { slug: "bagcilar",    name: "Bagcılar",    description: "Bagcılar'da uygun fiyatlı web tasarım hizmetleri." },
  { slug: "esenyurt",    name: "Esenyurt",    description: "Esenyurt'ta web yazılım ve dijital pazarlama." },
  { slug: "avcilar",     name: "Avcılar",     description: "Avcılar'da web sitesi kurma ve SEO hizmetleri." },
  { slug: "beylikduzu",  name: "Beylikdüzü",  description: "Beylikdüzü'nde modern web yazılım çözümleri." },
  { slug: "sariyer",     name: "Sarıyer",     description: "Sarıyer'de kurumsal web sitesi ve yazılım gelistirme." },
];

/** Hizmet sayfaları için ilçe slug'larından olusan Set — hızlı lookup */
export const DISTRICT_SLUgS = new Set(ISTANBUL_DISTRICTS.map((d) => d.slug));

/** Slug'a göre ilçe bilgisi döner */
export function getDistrictBySlug(slug: string): ServiceDistrict | undefined {
  return ISTANBUL_DISTRICTS.find((d) => d.slug === slug);
}
