/**
 * google AdSense Script Component
 *
 * next/script yerine useEffect + document.createElement kullanılıyor.
 * Sebep: next/script, AdSense'in desteklemedigi "data-nscript" attribute'unu
 * otomatik ekliyor ve bu AdSense konsolunda uyarıya yol açıyor.
 * Düz script tag'i ile bu sorun ortadan kalkar.
 */
'use client';

import { useEffect, useState } from 'react';

const CONSENT_KEY = 'xipsoft_adsense_consent';
const CONSENT_EVENT = 'xipsoft-adsense-consent';

const googleAdSense = () => {
  const clientId = process.env.NEXT_PUBLIC_gOOgLE_ADS_ID;
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    if (!clientId) return;

    const storedConsent = localStorage.getItem(CONSENT_KEY);
    if (storedConsent === 'accepted') {
      setHasConsent(true);
    }

    const handleConsentEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ status: string }>;
      if (customEvent?.detail?.status === 'accepted') {
        setHasConsent(true);
      }
    };

    window.addEventListener(CONSENT_EVENT, handleConsentEvent as EventListener);
    return () => {
      window.removeEventListener(CONSENT_EVENT, handleConsentEvent as EventListener);
    };
  }, [clientId]);

  useEffect(() => {
    if (!clientId || !hasConsent) return;

    if (document.getElementById('google-adsense-script')) return;

    const script = document.createElement('script');
    script.id = 'google-adsense-script';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
  }, [clientId, hasConsent]);

  return null;
};

export default googleAdSense;
