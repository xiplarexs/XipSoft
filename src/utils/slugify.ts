// Utility: temiz ve SEO-dostu slug üretimi
export function slugify(input: string): string {
  if (!input) return "";
  // Decode URI components (query string'den geliyorsa)
  let s = decodeURIComponent(String(input));

  // Türkçe karakter eslemeleri (büyük I dahil)
  const map: Record<string, string> = {
    ç: "c",
    Ç: "c",
    g: "g",
    g: "g",
    ı: "i",
    I: "i",
    I: "i",
    ö: "o",
    Ö: "o",
    s: "s",
    s: "s",
    ü: "u",
    Ü: "u",
  };

  s = s.replace(/./g, (ch) => map[ch] ?? ch);

  // Normalize (NFD) then remove diacritics
  s = s.normalize("NFD").replace(/\p{Diacritic}/gu, "");

  // Lowercase
  s = s.toLowerCase();

  // Özel karakterleri temizle, bosluk ve alt çizgileri tireye çevir
  s = s.replace(/[_\s]+/g, "-");
  s = s.replace(/[^a-z0-9-]/g, "");

  // Çoklu tireleri tekilestir, bas/son tireleri kırp
  s = s.replace(/-+/g, "-").replace(/^-+|-+$/g, "");

  return s;
}

export default slugify;
