export type IPBlockEntry = {
  id: number;
  ip_address: string;
  reason: string;
  is_permanent: boolean;
  expires_at: string | null;
  created_at: string;
};

export type CountryBlockEntry = {
  id: number;
  country_code: string;
  reason: string;
  created_at: string;
};

export const COUNTRIES = [
  { code: "RU", name: "Rusya (RU)" },
  { code: "CN", name: "Çin (CN)" },
  { code: "US", name: "Amerika Birlesik Devletleri (US)" },
  { code: "DE", name: "Almanya (DE)" },
  { code: "gB", name: "Ingiltere (gB)" },
  { code: "FR", name: "Fransa (FR)" },
  { code: "IR", name: "Iran (IR)" },
  { code: "UA", name: "Ukrayna (UA)" },
  { code: "NL", name: "Hollanda (NL)" },
  { code: "AZ", name: "Azerbaycan (AZ)" },
  { code: "KP", name: "Kuzey Kore (KP)" },
  { code: "BR", name: "Brezilya (BR)" },
  { code: "IN", name: "Hindistan (IN)" },
  { code: "PL", name: "Polonya (PL)" },
];
