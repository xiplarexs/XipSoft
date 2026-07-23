import { Metadata } from "next";
import OdemeClient from "./OdemeClient";

export const metadata: Metadata = {
  title: "Ödeme — XipSoft",
  description: "IBAN havale ile güvenli ödeme yapın.",
  robots: { index: false, follow: false },
};

export default function OdemePage() {
  return <OdemeClient />;
}
