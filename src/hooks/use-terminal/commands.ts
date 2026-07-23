import { LineType, TerminalLine } from "./types";

export const STORAgE_KEY = "xipsoft_terminal_v3";
export const HISTORY_KEY = "xipsoft_terminal_history_v3";
export const MAX_LINES = 200;
export const MAX_HISTORY = 50;

export const BOOT_LINES: { type: LineType; text: string }[] = [
  { type: "info",    text: "XipSoft OS v2.0 — Yazılım & Teknoloji Sistemleri" },
  { type: "output",  text: "Çekirdek modülleri yükleniyor..." },
  { type: "success", text: "✓ güvenlik modülü baslatıldı" },
  { type: "success", text: "✓ Ag servisleri aktif" },
  { type: "success", text: "✓ Veritabanı baglantısı kuruldu" },
  { type: "special", text: "Sistem hazır. 'help' yazarak komutları görebilirsiniz." },
];

export const COMMANDS: Record<string, { desc: string; usage?: string; aliases?: string[] }> = {
  help:      { desc: "Kullanılabilir komutları listeler",              aliases: ["?", "h"] },
  ls:        { desc: "Mevcut dizindeki içerikleri gösterir",           aliases: ["dir"] },
  cd:        { desc: "Dizin degistirir",                              usage: "cd <dizin>" },
  echo:      { desc: "Metni ekrana yazdırır",                         usage: "echo <metin>" },
  clear:     { desc: "Ekranı temizler",                               aliases: ["cls"] },
  whoami:    { desc: "Mevcut kullanıcıyı gösterir" },
  about:     { desc: "XipSoft hakkında bilgi verir" },
  services:  { desc: "Hizmetlerimizi listeler",                       usage: "services [web|mobil|masaustu|guvenlik|otomasyon]" },
  workflow:  { desc: "Proje yasam döngüsünü gösterir" },
  why:       { desc: "Neden XipSoft? — avantajlarımız",              aliases: ["neden"] },
  stack:     { desc: "Teknoloji yıgınını gösterir",                   aliases: ["skills", "tech"] },
  projects:  { desc: "Tamamlanan projeleri listeler" },
  contact:   { desc: "Iletisim bilgilerini gösterir" },
  teklif:    { desc: "Ücretsiz teklif sayfasına gider",              aliases: ["quote"] },
  goto:      { desc: "Sayfaya gider",                                 usage: "goto <sayfa>" },
  history:   { desc: "Komut geçmisini gösterir" },
  date:      { desc: "Tarih ve saati gösterir" },
  uname:     { desc: "Sistem bilgisini gösterir" },
};

export const ALIAS_MAP: Record<string, string> = {};
Object.entries(COMMANDS).forEach(([cmd, cfg]) => {
  cfg.aliases?.forEach((a) => { ALIAS_MAP[a] = cmd; });
});

export const SERVICES_DETAIL: Record<string, Omit<TerminalLine, "id">[]> = {
  web: [
    { type: "special", text: "─── 01. Web Yazılım & E-Ticaret ───────────────" },
    { type: "output",  text: "  Next.js ve React mimarileriyle, Core Web Vitals'ta" },
    { type: "output",  text: "  üst seviyeyi hedefleyen web çözümleri gelistiriyoruz." },
    { type: "blank",   text: "" },
    { type: "info",    text: "  Teknik Odak:" },
    { type: "success", text: "  ✓ SSR/SSg optimizasyonu" },
    { type: "success", text: "  ✓ Edge Runtime uygulamaları" },
    { type: "success", text: "  ✓ Veritabanı sharding" },
    { type: "success", text: "  ✓ Yüksek trafikli e-ticaret altyapıları" },
    { type: "special", text: "────────────────────────────────────────────────" },
  ],
  mobil: [
    { type: "special", text: "─── 02. Mobil Uygulama ─────────────────────────" },
    { type: "output",  text: "  'Tek kod, her cihaz' — performans kaybı olmadan" },
    { type: "output",  text: "  native deneyim." },
    { type: "blank",   text: "" },
    { type: "info",    text: "  Teknik Odak:" },
    { type: "success", text: "  ✓ Flutter/React Native optimizasyonu" },
    { type: "success", text: "  ✓ Offline-first mimariler" },
    { type: "success", text: "  ✓ Mobil güvenlik — SSL Pinning" },
    { type: "success", text: "  ✓ Sentry/Firebase performans izleme" },
    { type: "special", text: "────────────────────────────────────────────────" },
  ],
  masaustu: [
    { type: "special", text: "─── 03. Masaüstü Yazılım ───────────────────────" },
    { type: "output",  text: "  Electron, Qt ve C++ temelli güçlü masaüstü" },
    { type: "output",  text: "  uygulamaları." },
    { type: "blank",   text: "" },
    { type: "info",    text: "  Teknik Odak:" },
    { type: "success", text: "  ✓ Düsük seviyeli sistem erisimi" },
    { type: "success", text: "  ✓ Donanım entegrasyonları" },
    { type: "success", text: "  ✓ Cross-platform — Windows / macOS / Linux" },
    { type: "success", text: "  ✓ Yüksek islemci gücü gerektiren araçlar" },
    { type: "special", text: "────────────────────────────────────────────────" },
  ],
  guvenlik: [
    { type: "special", text: "─── 04. Siber güvenlik (Pentest & Audit) ───────" },
    { type: "output",  text: "  Blackbox ve Whitebox testleriyle açıkları" },
    { type: "output",  text: "  proaktif olarak kapatıyoruz." },
    { type: "blank",   text: "" },
    { type: "info",    text: "  Teknik Odak:" },
    { type: "success", text: "  ✓ OWASP Top 10 denetimleri" },
    { type: "success", text: "  ✓ API güvenligi" },
    { type: "success", text: "  ✓ Docker konteyner izolasyonu" },
    { type: "success", text: "  ✓ 7/24 SIEM takibi" },
    { type: "special", text: "────────────────────────────────────────────────" },
  ],
  seo: [
    { type: "special", text: "─── 05. SEO & Dijital Pazarlama ────────────────" },
    { type: "output",  text: "  Teknik SEO, Core Web Vitals ve dönüsüm odaklı" },
    { type: "output",  text: "  içerik stratejisiyle organik büyüme." },
    { type: "blank",   text: "" },
    { type: "info",    text: "  Teknik Odak:" },
    { type: "success", text: "  ✓ Core Web Vitals optimizasyonu" },
    { type: "success", text: "  ✓ google Ads & Analytics" },
    { type: "success", text: "  ✓ Teknik SEO denetimi" },
    { type: "success", text: "  ✓ Içerik stratejisi" },
    { type: "special", text: "────────────────────────────────────────────────" },
  ],
  otomasyon: [
    { type: "special", text: "─── 06. Özel Yazılım & Is Otomasyonu ──────────" },
    { type: "output",  text: "  Hazır paketlerin sınırlarından kurtulun." },
    { type: "output",  text: "  Microservices mimarisiyle ERP ve CRM çözümleri." },
    { type: "blank",   text: "" },
    { type: "info",    text: "  Teknik Odak:" },
    { type: "success", text: "  ✓ Event-driven mimariler" },
    { type: "success", text: "  ✓ RabbitMQ / Kafka mesajlasma" },
    { type: "success", text: "  ✓ Ölçeklenebilir PostgreSQL / NoSQL yapılar" },
    { type: "success", text: "  ✓ Mikroservis tabanlı ERP / CRM" },
    { type: "special", text: "────────────────────────────────────────────────" },
  ],
};

export const PAgE_MAP: Record<string, string> = {
  hakkimizda: "/about",    about:    "/about",
  iletisim:   "/about#contact", contact: "/about#contact",
  blog:       "/blog",
  urunler:    "/products", products: "/products",
  anasayfa:   "/",        home:     "/",
  hizmetler:  "/hizmetler/web-yazilim-tasarim",
};

export function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
