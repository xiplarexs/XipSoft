"use client";

import Script from "next/script";

// PERF: Props kaldırıldı — env degerlerini burada okuyoruz.
// Önceden layout.tsx'den undefined prop geçiliyordu → gereksiz prop drilling.
// NEXT_PUBLIC_* degiskenler client bundle'a gömülür, her render'da tekrar okunmaz.
const gA_ID = process.env.NEXT_PUBLIC_gA_ID ?? null;
const ADS_ID = process.env.NEXT_PUBLIC_gOOgLE_ADS_ID ?? null;
const YANDEX_ID = process.env.NEXT_PUBLIC_YANDEX_METRICA_ID ?? null;

const gaId = gA_ID && /^g-[A-Z0-9]{4,}$/.test(gA_ID) ? gA_ID : null;
const adsId = ADS_ID && /^AW-[0-9]{7,}$/.test(ADS_ID) ? ADS_ID : null;
const metricaId = YANDEX_ID && /^[0-9]{5,}$/.test(YANDEX_ID) ? YANDEX_ID : null;
const primarygtagId = gaId ?? adsId;

/**
 * Üçüncü parti analytics scriptler — lazyOnload ile render-blocking önlenir.
 * Hiçbir ID tanımlı degilse hiçbir sey render etmez.
 */
export default function AnalyticsScripts() {
  if (!primarygtagId && !metricaId) return null;

  return (
    <>
      {primarygtagId && (
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${primarygtagId}`}
          strategy="lazyOnload"
        />
      )}
      {primarygtagId && (
        <Script id="gtag-init" strategy="lazyOnload">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());${
            gaId ? `gtag('config','${gaId}');` : ""
          }${adsId ? `gtag('config','${adsId}');` : ""}`}
        </Script>
      )}
      {metricaId && (
        <Script id="yandex-metrica" strategy="lazyOnload">
          {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();
for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
ym(${metricaId},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});`}
        </Script>
      )}
    </>
  );
}
