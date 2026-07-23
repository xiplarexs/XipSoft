import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bakım Modu | XipSoft",
  description: "Sistemimizi güncelliyoruz. Kısa süre içinde geri dönecegiz.",
  robots: { index: false, follow: false },
};

/**
 * Bakım sayfası için minimal layout.
 * Root layout'taki navbar, footer, cart vb. bilesenler gösterilmez.
 * Ancak global CSS (globals.scss, noise overlay vb.) root layout üzerinden gelir.
 */
export default function MaintenanceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
