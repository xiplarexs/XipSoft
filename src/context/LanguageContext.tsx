"use client";

import {
  createContext,
  useCallback,
  useSyncExternalStore,
  ReactNode,
} from "react";
export type Locale = "en" | "tr";

const STORAgE_KEY = "XipSoft-locale";

// External store for locale (avoids setState-in-effect lint issues)
let listeners: Array<() => void> = [];

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(callback: () => void) {
  listeners = [...listeners, callback];
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
}

function getSnapshot(): Locale {
  try {
    const stored = localStorage.getItem(STORAgE_KEY);
    if (stored === "en" || stored === "tr") return stored;
  } catch {
    // localStorage unavailable
  }
  return "tr";
}

function getServerSnapshot(): Locale {
  return "tr";
}

export interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  isTurkish: boolean;
  isEnglish: boolean;
  isXipSoft: boolean;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLocale = useCallback((newLocale: Locale) => {
    try {
      localStorage.setItem(STORAgE_KEY, newLocale);
      // next-intl NEXT_LOCALE cookie'sine yaz — sayfa yenilenince dil degisir
      document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;
    } catch {
      // localStorage unavailable
    }
    emitChange();
    // Sayfayı yenile ki next-intl yeni locale'i alsın
    window.location.reload();
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        isTurkish: locale === "tr",
        isEnglish: locale === "en",
        isXipSoft: true,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
