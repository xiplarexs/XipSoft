import type { Metadata } from "next";
import AdminAnalyticsClient from "./AdminAnalyticsClient";

export const metadata: Metadata = {
  title: "Analytics | Admin XipSoft",
  robots: { index: false, follow: false },
};

export default async function AdminAnalyticsPage() {
  return <AdminAnalyticsClient />;
}
