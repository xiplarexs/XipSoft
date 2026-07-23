import { BRAND_ICONS, BRAND_COLORS } from "@/config/brand.config";

const Favicons = () => {
  return (
    <>
      <link rel="icon" href={BRAND_ICONS.favicon} sizes="any" />
      <link rel="apple-touch-icon" sizes="180x180" href={BRAND_ICONS.appleTouchIcon} />
      <meta name="msapplication-TileColor" content={BRAND_COLORS.background} />
      <meta name="theme-color" content={BRAND_COLORS.themeColor} />
    </>
  );
};

export default Favicons;
