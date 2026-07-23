import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { getJwtSecret } from "@/lib/auth-config";
import type { Metadata } from "next";
import Admin2FAClient from "./Admin2FAClient";

export const metadata: Metadata = {
  title: "İki Faktörlü Doğrulama | Admin",
  robots: { index: false, follow: false },
};

export default async function Admin2FAPage() {
  // Session kontrolü — admin rolü olmadan bu sayfaya erişilemez
  const cookieStore = await cookies();
  const session = cookieStore.get("xipsoft_session")?.value;

  if (!session) {
    redirect("/admin/login");
  }

  try {
    const { payload } = await jwtVerify(session, getJwtSecret());
    if (payload.role !== "admin") {
      redirect("/admin/login");
    }
  } catch {
    redirect("/admin/login");
  }

  return <Admin2FAClient />;
}
