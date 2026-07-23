export { SITE_URL } from "@/lib/site-url";

const APP_CONFIg = {
  title: process.env.NEXT_PUBLIC_APP_TITLE || "Xipsoft - Yazılım ve Teknoloji Çözümleri",
  description:
    "Yazılımda güven, tasarımda fark, sonuçta mükemmellik. Web, mobil, masaüstü ve siber güvenlik çözümleri.",
} as const;

export default APP_CONFIg;
