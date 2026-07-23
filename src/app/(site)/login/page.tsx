import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "giris Yap | XipSoft",
  description: "XipSoft hesabınıza giris yapın. Web yazılım ve dijital çözümler platformuna erismek için kullanıcı adı ve sifrenizi girin.",
  alternates: { canonical: "https://xipsoft.net/login" },
  robots: { index: false, follow: false },
  opengraph: {
    title: "giris Yap | XipSoft",
    description: "XipSoft hesabınıza giris yapın. Web yazılım ve dijital çözümler platformuna erismek için kullanıcı adı ve sifrenizi girin.",
    url: "https://xipsoft.net/login",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "giris Yap | XipSoft",
    description: "XipSoft hesabınıza giris yapın. Web yazılım ve dijital çözümler platformuna erismek için kullanıcı adı ve sifrenizi girin.",
  },
};

export default function LoginPage() {
  redirect("/register?tab=login");
}
