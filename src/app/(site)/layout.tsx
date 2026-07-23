import Navbar from "@/components/Common/Navbar/Navbar";
import TopBar from "@/components/Common/TopBar/TopBar";
import { headers } from "next/headers";
import dynamic from "next/dynamic";
import styles from "@/styles/styles";
import { cn } from "@/utils";
import Footer from "@/components/Common/Footer/Footer";
import AnalyticsScripts from "@/components/Common/AnalyticsScripts";
import AmbientLantern from "@/components/Common/AmbientLantern/AmbientLantern";
import StarField from "@/components/Common/StarField/StarField";

const TeklifModal = dynamic(() => import("@/components/Common/TeklifModal/TeklifModal"));
const ScrollToTop = dynamic(() => import("@/components/Common/ScrollToTop/ScrollToTop"));
const CartSidebar = dynamic(() => import("@/components/Cart/CartSidebar"));
const AuthModal = dynamic(() => import("@/components/Auth/AuthModal"));
const Homebar = dynamic(() => import("@/components/Common/Homebar/Homebar"));
const DeviceTracker = dynamic(() => import("@/components/Common/DeviceTracker/DeviceTracker"));
const Initializer = dynamic(() => import("@/components/Common/FontInitializer"));
const AdSenseConsent = dynamic(() => import("@/components/Common/AdSenseConsent/AdSenseConsent"));
const GoogleAdSense = dynamic(() => import("@/components/Common/googleAdSense/GoogleAdSense"));
const WebVitals = dynamic(() => import("@/components/Common/WebVitals/WebVitals"));

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const normalizedPathname = pathname.replace(/^\/(tr|en)(?=\/|$)/, "");
  const isMaintenance = normalizedPathname === "/maintenance" || normalizedPathname.startsWith("/maintenance/");
  const isHome = normalizedPathname === "/" || normalizedPathname === "";

  return (
    <div className={cn(styles.gradient, "text-zinc-200")}>
      <Initializer />
      <StarField />
      <AmbientLantern />

      {/* Skip Navigation — WCAg 2.4.1 */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:bg-zinc-900 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:border focus:border-white/20 focus:shadow-xl"
      >
        Ana içerige geç
      </a>

      {!isMaintenance && (
        <>
          <TopBar />
          <Navbar />
        </>
      )}

      <main
        id="main-content"
        className={
          isHome
            ? "min-h-[calc(100vh-142px)] pt-28"
            : "min-h-[calc(100vh-142px)] pt-32"
        }
      >
        {children}
      </main>

      {!isMaintenance && <Footer />}
      <AuthModal />
      <TeklifModal />
      {!isMaintenance && <Homebar />}
      <CartSidebar />
      <ScrollToTop />
      <DeviceTracker />
      <AdSenseConsent />
      <GoogleAdSense />
      <WebVitals />
      <AnalyticsScripts />
    </div>
  );
}
