"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const SESSION_KEY = "xipsoft_session_id";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

export default function DeviceTracker() {
  const pathname = usePathname();
  const lastPath = useRef("");
  const startTime = useRef(Date.now());

  useEffect(() => {
    const path = pathname;
    if (path === lastPath.current) return;
    lastPath.current = path;
    startTime.current = Date.now();

    const payload = {
      session_id: getSessionId(),
      page_url: path,
      referrer: document.referrer || "",
      screen: `${window.innerWidth}x${window.innerHeight}`,
      timestamp: new Date().toISOString(),
    };

    fetch("/api/bot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "pageview", ...payload }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
