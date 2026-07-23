"use client";

import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { LineType, TerminalLine } from "./types";
import { COMMANDS, ALIAS_MAP, SERVICES_DETAIL, PAgE_MAP } from "./commands";

type AddLineFn = (type: LineType, text: string, opts?: { indent?: boolean; prompt?: string }) => void;
type AddLinesFn = (lines: Omit<TerminalLine, "id">[]) => void;

export interface CommandContext {
  addLine: AddLineFn;
  addLines: AddLinesFn;
  cwd: string;
  setLines: React.Dispatch<React.SetStateAction<TerminalLine[]>>;
  setCwd: React.Dispatch<React.SetStateAction<string>>;
  cmdHistoryRef: React.MutableRefObject<string[]>;
  historyIdxRef: React.MutableRefObject<number>;
  inputDraftRef: React.MutableRefObject<string>;
  router: AppRouterInstance;
}

export function createCommandHandler(ctx: CommandContext) {
  const { addLine, addLines, cwd, setLines, setCwd, cmdHistoryRef, historyIdxRef, inputDraftRef, router } = ctx;

  return (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    cmdHistoryRef.current = [trimmed, ...cmdHistoryRef.current.filter(h => h !== trimmed)].slice(0, 50);
    historyIdxRef.current = -1;
    inputDraftRef.current = "";
    try { localStorage.setItem("xipsoft_terminal_history_v3", JSON.stringify(cmdHistoryRef.current)); } catch {}

    addLine("cmd", trimmed, { prompt: cwd });

    const parts  = trimmed.split(/\s+/);
    const rawCmd = (parts[0] ?? "").toLowerCase();
    const cmd    = ALIAS_MAP[rawCmd] ?? rawCmd;
    const args   = parts.slice(1);

    switch (cmd) {

      // ── clear ──────────────────────────────────────────────────
      case "clear":
        setLines([]);
        return;

      // ── help ───────────────────────────────────────────────────
      case "help":
        addLines([
          { type: "info",  text: "─── Kullanılabilir Komutlar ───────────────────────" },
          { type: "blank", text: "" },
          ...Object.entries(COMMANDS).map(([c, cfg]) => ({
            type: "output" as LineType,
            text: `  ${c.padEnd(12)} — ${cfg.desc}`,
          })),
          { type: "blank",  text: "" },
          { type: "output", text: "  ↑↓ ok tusları  — komut geçmisi" },
          { type: "output", text: "  Tab             — otomatik tamamlama" },
          { type: "special", text: "────────────────────────────────────────────────" },
        ]);
        break;

      // ── ls ─────────────────────────────────────────────────────
      case "ls":
        addLines(cwd === "~" ? [
          { type: "output", text: "  📁 XipSoft/" },
          { type: "output", text: "  📁 Projeler/" },
          { type: "output", text: "  📁 Hizmetler/" },
        ] : [
          { type: "output", text: "  📄 hakkimizda.md" },
          { type: "output", text: "  📄 hizmetler.md" },
          { type: "output", text: "  📄 iletisim.md" },
          { type: "output", text: "  📁 projeler/" },
          { type: "output", text: "  📁 teknolojiler/" },
        ]);
        break;

      // ── cd ─────────────────────────────────────────────────────
      case "cd": {
        const target = args[0];
        if (!target || target === "~") {
          setCwd("~"); addLine("success", "Dizin: ~");
        } else if (target === "..") {
          setCwd("~"); addLine("success", "Dizin: ~");
        } else {
          const next = target === "XipSoft" ? "~/XipSoft" : `~/XipSoft/${target}`;
          setCwd(next); addLine("success", `Dizine girildi: ${next}`);
        }
        break;
      }

      // ── echo ───────────────────────────────────────────────────
      case "echo":
        addLine("output", args.join(" ").replace(/^["']|["']$/g, "") || "");
        break;

      // ── whoami ─────────────────────────────────────────────────
      case "whoami":
        addLines([
          { type: "special", text: "xipsoft-user" },
          { type: "output",  text: "Rol: Ziyaretçi  |  Platform: XipSoft Web Terminal" },
        ]);
        break;

      // ── about ──────────────────────────────────────────────────
      case "about":
        addLines([
          { type: "special", text: "─── XipSoft: Yazılım ve Teknoloji Merkeziniz ───" },
          { type: "blank",   text: "" },
          { type: "output",  text: "  XipSoft, sadece kod yazan bir ajans degil;" },
          { type: "output",  text: "  projenizi en basından ölçeklenebilir ve" },
          { type: "output",  text: "  sürdürülebilir bir mimari üzerine insa eden" },
          { type: "output",  text: "  stratejik bir teknoloji ortagıdır." },
          { type: "blank",   text: "" },
          { type: "info",    text: "  Kurulus  : 2009" },
          { type: "info",    text: "  Deneyim  : 15+ yıl" },
          { type: "info",    text: "  Konum    : Istanbul, Türkiye" },
          { type: "info",    text: "  Web      : https://xipsoft.net" },
          { type: "blank",   text: "" },
          { type: "output",  text: "  Daha fazla: services · workflow · why · stack · projects" },
          { type: "special", text: "────────────────────────────────────────────────" },
        ]);
        break;

      // ── services ───────────────────────────────────────────────
      case "services": {
        const sub = args[0]?.toLowerCase();

        if (sub && SERVICES_DETAIL[sub]) {
          addLines(SERVICES_DETAIL[sub]);
        } else {
          addLines([
            { type: "special", text: "─── Hizmetlerimiz: Uçtan Uca Teknik Uzmanlık ──" },
            { type: "blank",   text: "" },
            { type: "success", text: "  01  Web Yazılım & E-Ticaret" },
            { type: "output",  text: "      Next.js · React · SSR/SSg · Edge Runtime" },
            { type: "success", text: "  02  Mobil Uygulama" },
            { type: "output",  text: "      Flutter · React Native · Offline-first · SSL Pinning" },
            { type: "success", text: "  03  Masaüstü Yazılım" },
            { type: "output",  text: "      Electron · Qt · C++ · Windows/macOS/Linux" },
            { type: "success", text: "  04  Siber güvenlik" },
            { type: "output",  text: "      OWASP Top 10 · API güvenligi · Docker · SIEM" },
            { type: "success", text: "  05  SEO & Dijital Pazarlama" },
            { type: "output",  text: "      Teknik SEO · Core Web Vitals · google Ads" },
            { type: "success", text: "  06  Özel Yazılım & Is Otomasyonu" },
            { type: "output",  text: "      Microservices · ERP/CRM · RabbitMQ · PostgreSQL" },
            { type: "blank",   text: "" },
            { type: "info",    text: "  Detay: services web  |  services guvenlik  |  services otomasyon" },
            { type: "special", text: "────────────────────────────────────────────────" },
          ]);
        }
        break;
      }

      // ── workflow ───────────────────────────────────────────────
      case "workflow":
        addLines([
          { type: "special", text: "─── Teknik Is Akısımız — Proje Yasam Döngüsü ──" },
          { type: "blank",   text: "" },
          { type: "info",    text: "  01  Harita & Planlama" },
          { type: "output",  text: "      gereksinim analizi, teknik borç (tech debt) tahmini" },
          { type: "info",    text: "  02  Tasarım — UI/UX" },
          { type: "output",  text: "      Kullanıcı merkezli tasarımın prototiplere dönüsümü" },
          { type: "info",    text: "  03  Servis Mimarisi" },
          { type: "output",  text: "      Backend, API ve veritabanı kurgusunun olusturulması" },
          { type: "info",    text: "  04  Repo & Versiyonlama" },
          { type: "output",  text: "      CI/CD süreçleri, git-flow, kod gözden geçirmeleri" },
          { type: "info",    text: "  05  Analiz & Test" },
          { type: "output",  text: "      Unit test, yük testleri ve güvenlik denetimleri" },
          { type: "info",    text: "  06  Teslim" },
          { type: "output",  text: "      Kod + dökümantasyon + mimari semalar + bakım kılavuzu" },
          { type: "blank",   text: "" },
          { type: "special", text: "  \"XipSoft Standartları\" ile tam teslimat garantisi." },
          { type: "special", text: "────────────────────────────────────────────────" },
        ]);
        break;

      // ── why ────────────────────────────────────────────────────
      case "why":
        addLines([
          { type: "special", text: "─── Neden XipSoft? ─────────────────────────────" },
          { type: "blank",   text: "" },
          { type: "success", text: "  ★  15+ Yıl Deneyim" },
          { type: "output",  text: "     Siber güvenlikten gömülü sistemlere teknik birikim." },
          { type: "success", text: "  ★  Kalite garantisi" },
          { type: "output",  text: "     Unit test, yük testi ve güvenlik denetimi standarttır." },
          { type: "success", text: "  ★  Dogrudan Iletisim" },
          { type: "output",  text: "     Satıs temsilcisi degil, projeyi insa eden mühendis." },
          { type: "success", text: "  ★  Tam Kaynak Kodu" },
          { type: "output",  text: "     Tüm varlıklar ve konfigürasyonlar %100 size aittir." },
          { type: "success", text: "  ★  Uzun Vadeli Ortaklık" },
          { type: "output",  text: "     Yayın sonrası CI/CD, bakım ve ölçekleme destegi." },
          { type: "blank",   text: "" },
          { type: "special", text: "────────────────────────────────────────────────" },
        ]);
        break;

      // ── stack / skills / tech ──────────────────────────────────
      case "stack":
        addLines([
          { type: "special", text: "─── Teknoloji Yıgınımız ────────────────────────" },
          { type: "blank",   text: "" },
          { type: "info",    text: "  Frontend   : React, Next.js, Vue, Stencil, Tailwind" },
          { type: "info",    text: "  Backend    : Node.js, Python (Django/FastAPI), Laravel" },
          { type: "info",    text: "  Mobil      : Flutter, React Native" },
          { type: "info",    text: "  Masaüstü   : Electron, Qt, C/C++" },
          { type: "info",    text: "  Altyapı    : Docker, AWS, gCP, Vercel, Nginx" },
          { type: "info",    text: "  Veritabanı : PostgreSQL, Redis, MongoDB, NoSQL" },
          { type: "info",    text: "  Araçlar    : git, WebComponents, PWA, CI/CD" },
          { type: "info",    text: "  güvenlik   : Pentest, OWASP, SIEM, WAF, Kali Linux" },
          { type: "blank",   text: "" },
          { type: "special", text: "────────────────────────────────────────────────" },
        ]);
        break;

      // ── projects ───────────────────────────────────────────────
      case "projects":
        addLines([
          { type: "special", text: "─── Tamamlanan Projelerden Örnekler ────────────" },
          { type: "blank",   text: "" },
          { type: "success", text: "  ✓ XipSoft Platform     — Next.js 15, PostgreSQL, Redis" },
          { type: "success", text: "  ✓ E-Ticaret Çözümü     — Flutter + Node.js + AWS" },
          { type: "success", text: "  ✓ Siber güvenlik Audit — Python, Kali Linux, OWASP" },
          { type: "success", text: "  ✓ Masaüstü ERP         — Electron + C++ + PostgreSQL" },
          { type: "success", text: "  ✓ Microservices CRM    — RabbitMQ + Docker + go" },
          { type: "success", text: "  ✓ Mobil B2B Uygulama   — React Native + FastAPI" },
          { type: "blank",   text: "" },
          { type: "output",  text: "  Toplam: 200+ proje basarıyla teslim edildi." },
          { type: "special", text: "────────────────────────────────────────────────" },
        ]);
        break;

      // ── contact ────────────────────────────────────────────────
      case "contact":
        addLines([
          { type: "special", text: "─── Iletisim ──────────────────────────────────" },
          { type: "blank",   text: "" },
          { type: "output",  text: "  Web  : https://xipsoft.net" },
          { type: "output",  text: "  Mail : info@xipsoft.net" },
          { type: "output",  text: "  Konum: Istanbul, Türkiye" },
          { type: "blank",   text: "" },
          { type: "info",    text: "  'goto iletisim' — iletisim sayfasına git" },
          { type: "info",    text: "  'teklif'         — ücretsiz teklif al" },
          { type: "special", text: "────────────────────────────────────────────────" },
        ]);
        break;

      // ── teklif ─────────────────────────────────────────────────
      case "teklif":
        addLines([
          { type: "success", text: "  Teklif sayfasına yönlendiriliyor..." },
          { type: "output",  text: "  Proje gereksinimlerinizi paylasın, ekibimiz dönecek." },
        ]);
        setTimeout(() => router.push("/about#contact"), 600);
        break;

      // ── goto ───────────────────────────────────────────────────
      case "goto": {
        const dest = PAgE_MAP[(args[0] ?? "").toLowerCase()];
        if (dest) {
          addLine("success", `→ Yönlendiriliyor: ${dest}`);
          setTimeout(() => router.push(dest), 500);
        } else {
          addLine("warn", `Bilinmeyen sayfa: '${args[0] ?? ""}'. geçerliler: ${Object.keys(PAgE_MAP).filter((_, i) => i % 2 === 0).join(", ")}`);
        }
        break;
      }

      // ── history ────────────────────────────────────────────────
      case "history":
        if (cmdHistoryRef.current.length === 0) {
          addLine("output", "geçmis bos.");
        } else {
          addLines(
            cmdHistoryRef.current.slice(0, 20).map((h, i) => ({
              type: "output" as LineType,
              text: `  ${String(i + 1).padStart(3, " ")}  ${h}`,
            }))
          );
        }
        break;

      // ── date ───────────────────────────────────────────────────
      case "date":
        addLine("output", new Date().toLocaleString("tr-TR", {
          weekday: "long", year: "numeric", month: "long",
          day: "numeric", hour: "2-digit", minute: "2-digit",
        }));
        break;

      // ── uname ──────────────────────────────────────────────────
      case "uname":
        addLines([
          { type: "output", text: "XipSoft OS 2.0.0 — Next.js / React / TypeScript" },
          { type: "output", text: "Platform: Web Browser  |  Arch: x86_64  |  Mode: Dark" },
        ]);
        break;

      // ── bilinmeyen ─────────────────────────────────────────────
      default:
        addLines([
          { type: "error",  text: `Komut bulunamadı: '${rawCmd}'` },
          { type: "output", text: "  'help' yazarak kullanılabilir komutları görebilirsiniz." },
        ]);
    }

    addLine("blank", "");
  };
}

export function handleKeyDown(
  e: React.KeyboardEvent<HTMLInputElement>,
  ctx: {
    input: string;
    setInput: (val: string) => void;
    addLine: AddLineFn;
    execute: (raw: string) => void;
    cmdHistoryRef: React.MutableRefObject<string[]>;
    historyIdxRef: React.MutableRefObject<number>;
    inputDraftRef: React.MutableRefObject<string>;
  }
) {
  const { input, setInput, addLine, execute, cmdHistoryRef, historyIdxRef, inputDraftRef } = ctx;
  const history = cmdHistoryRef.current;

  if (e.key === "Enter") {
    e.preventDefault();
    const cmd = input.trim();
    setInput("");
    historyIdxRef.current = -1;
    if (cmd) execute(cmd);
    return;
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();
    if (!history.length) return;
    if (historyIdxRef.current === -1) inputDraftRef.current = input;
    const next = Math.min(historyIdxRef.current + 1, history.length - 1);
    historyIdxRef.current = next;
    setInput(history[next] ?? "");
    return;
  }

  if (e.key === "ArrowDown") {
    e.preventDefault();
    if (historyIdxRef.current === -1) return;
    const next = historyIdxRef.current - 1;
    historyIdxRef.current = next;
    setInput(next === -1 ? inputDraftRef.current : (history[next] ?? ""));
    return;
  }

  if (e.key === "Tab") {
    e.preventDefault();
    const partial = input.trim().toLowerCase();
    if (!partial) return;
    const all = [...Object.keys(COMMANDS), ...Object.keys(ALIAS_MAP)];
    const matches = all.filter((c) => c.startsWith(partial));
    if (matches.length === 1) {
      setInput(matches[0] + " ");
    } else if (matches.length > 1) {
      addLine("output", "  " + matches.join("  "));
    }
  }
}
