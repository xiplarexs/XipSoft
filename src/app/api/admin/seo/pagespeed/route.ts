import { NextRequest, NextResponse } from "next/server";
import { extractAuthContext } from "@/lib/api-guard";
import { SITE_URL } from "@/lib/site-url";

export const runtime = "nodejs";

const PAgESPEED_API = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

interface WebVital {
  metric: string;
  value: number;
  unit: string;
  target: number;
  status: "good" | "needs-improvement" | "poor";
}

interface PageSpeedResult {
  url: string;
  strategy: "mobile" | "desktop";
  score: number;
  metrics: WebVital[];
  opportunities: { title: string; description: string; savings: string }[];
  diagnostics: { title: string; description: string }[];
  fetchedAt: string;
}

async function fetchPageSpeed(
  url: string,
  strategy: "mobile" | "desktop"
): Promise<PageSpeedResult | null> {
  const apiKey = process.env.gOOgLE_PAgESPEED_API_KEY;
    const params = new URLSearchParams({
    url,
    strategy,
  });
  params.append("category", "performance");
  params.append("category", "seo");
  params.append("category", "accessibility");
  if (apiKey) params.set("key", apiKey);

  try {
    const res = await fetch(`${PAgESPEED_API}?${params}`, {
      signal: AbortSignal.timeout(30000),
    });
    if (!res.ok) return null;
    const data = await res.json();

    const lighthouse = data.lighthouseResult;
    if (!lighthouse) return null;

    const audits = lighthouse.audits || {};
    const categories = lighthouse.categories || {};

    const metrics: WebVital[] = [
      {
        metric: "LCP",
        value: audits["largest-contentful-paint"]?.numericValue || 0,
        unit: "s",
        target: 2.5,
        status: (audits["largest-contentful-paint"]?.numericValue || 0) <= 2.5 ? "good" :
          (audits["largest-contentful-paint"]?.numericValue || 0) <= 4 ? "needs-improvement" : "poor",
      },
      {
        metric: "FID",
        value: audits["total-blocking-time"]?.numericValue || 0,
        unit: "ms",
        target: 100,
        status: (audits["total-blocking-time"]?.numericValue || 0) <= 200 ? "good" :
          (audits["total-blocking-time"]?.numericValue || 0) <= 600 ? "needs-improvement" : "poor",
      },
      {
        metric: "CLS",
        value: audits["cumulative-layout-shift"]?.numericValue || 0,
        unit: "",
        target: 0.1,
        status: (audits["cumulative-layout-shift"]?.numericValue || 0) <= 0.1 ? "good" :
          (audits["cumulative-layout-shift"]?.numericValue || 0) <= 0.25 ? "needs-improvement" : "poor",
      },
      {
        metric: "FCP",
        value: audits["first-contentful-paint"]?.numericValue || 0,
        unit: "s",
        target: 1.8,
        status: (audits["first-contentful-paint"]?.numericValue || 0) <= 1.8 ? "good" :
          (audits["first-contentful-paint"]?.numericValue || 0) <= 3 ? "needs-improvement" : "poor",
      },
      {
        metric: "TTFB",
        value: audits["server-response-time"]?.numericValue || 0,
        unit: "ms",
        target: 800,
        status: (audits["server-response-time"]?.numericValue || 0) <= 800 ? "good" :
          (audits["server-response-time"]?.numericValue || 0) <= 1800 ? "needs-improvement" : "poor",
      },
      {
        metric: "INP",
        value: audits["interactive"]?.numericValue || 0,
        unit: "ms",
        target: 200,
        status: (audits["interactive"]?.numericValue || 0) <= 200 ? "good" :
          (audits["interactive"]?.numericValue || 0) <= 500 ? "needs-improvement" : "poor",
      },
    ];

    const opportunities = Object.values(audits)
      .filter((a: any) => a.details?.type === "opportunity" && a.details?.overallSavingsMs > 0)
      .slice(0, 5)
      .map((a: any) => ({
        title: a.title,
        description: a.description,
        savings: a.details.overallSavingsMs
          ? `${(a.details.overallSavingsMs / 1000).toFixed(1)}s`
          : "N/A",
      }));

    const diagnostics = Object.values(audits)
      .filter((a: any) => a.details?.type === "table" && a.score !== null && a.score < 1)
      .slice(0, 5)
      .map((a: any) => ({
        title: a.title,
        description: a.description,
      }));

    return {
      url,
      strategy,
      score: Math.round((categories.performance?.score || 0) * 100),
      metrics,
      opportunities,
      diagnostics,
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

/**
 * gET /api/admin/seo/pagespeed?url=https://xipsoft.net&strategy=mobile
 */
export async function gET(req: NextRequest) {
  const ctx = await extractAuthContext(req);
  if (!ctx.isAuthenticated || ctx.userRole !== "admin") {
    return NextResponse.json({ ok: false, error: "Yetkisiz erisim" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url") || SITE_URL;
  const strategy = (searchParams.get("strategy") || "mobile") as "mobile" | "desktop";

  if (!["mobile", "desktop"].includes(strategy)) {
    return NextResponse.json({ ok: false, error: "strategy mobile veya desktop olmalı" }, { status: 400 });
  }

  const result = await fetchPageSpeed(url, strategy);
  if (!result) {
    return NextResponse.json({ ok: false, error: "PageSpeed verisi alınamadı" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, data: result });
}
