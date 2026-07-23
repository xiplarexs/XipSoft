import type { Metadata } from "next";
import AdminSecurityClient from "./AdminSecurityClient";

export const metadata: Metadata = {
  title: "güvenlik Yönetimi | Admin XipSoft",
  robots: { index: false, follow: false },
};

export default function AdminSecurityPage() {
  return <AdminSecurityClient />;
}
