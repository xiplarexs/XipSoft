import type { Metadata } from "next";
import AdminBlogClient from "./AdminBlogClient";

export const metadata: Metadata = {
  title: "Blog Yönetimi | Admin XipSoft",
  robots: { index: false, follow: false },
};

export default function AdminBlogPage() {
  return <AdminBlogClient />;
}
