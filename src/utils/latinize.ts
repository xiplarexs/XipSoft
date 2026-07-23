/**
 * turkishToLatin — Türkçe özel karakterleri Latin karsılıklarına çevirir.
 * glass font Türkçe glyph içermediği için navbar/baslık metinlerinde kullanılır.
 */
export function turkishToLatin(text: string): string {
  return text
    .replace(/İ/g, "I")
    .replace(/s/g, "S")
    .replace(/Ğ/g, "g")
    .replace(/Ü/g, "U")
    .replace(/Ö/g, "O")
    .replace(/Ç/g, "C")
    .replace(/ı/g, "i")
    .replace(/s/g, "s")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");
}

/** Hem latinize hem uppercase — navbar etiketleri için */
export function navLabel(text: string): string {
  return turkishToLatin(text).toUpperCase();
}
