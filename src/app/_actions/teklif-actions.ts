"use server";

import { randomUUID } from "crypto";
import { z } from "zod";
import { query } from "@/lib/db-utils";

// ── Runtime dogrulama seması (Zod v4) ────────────────────────────────────────
// TypeScript derleme sonrası tip bilgisi silinir; bu sema çalısma zamanında
// kullanıcı girdisini dogrulayan tek güvenilir katmandır.
// SQL Injection, XSS ve payload flooding'e karsı ilk savunma hattı.

const ALLOWED_SERVICES = [
  "Web Yazılım & Tasarım",
  "Mobil Uygulama",
  "Masaüstü Yazılım",
  "Masaustu Yazılım",   // eski form degeri — geriye dönük uyumluluk
  "Siber güvenlik",
  "Siber guvenlik",     // eski form degeri — geriye dönük uyumluluk
  "SEO & Dijital Pazarlama",
  "Diger",
] as const;

const TeklifFormSchema = z.object({
  name: z
    .string()
    .min(2, "Isim en az 2 karakter olmalıdır.")
    .max(100, "Isim 100 karakterden uzun olamaz.")
    // HTML/script enjeksiyonu ve null byte içeren girdileri reddet
    .refine((v) => !/<[^>]*>/.test(v), "Isim HTML içeremez.")
    .refine((v) => !/\0/.test(v), "geçersiz karakter."),

  email: z
    .string()
    .email("geçerli bir e-posta adresi giriniz.")
    .max(254, "E-posta adresi çok uzun.")
    .toLowerCase(), // normalize: büyük/küçük harf tutarsızlıgını engelle

  phone: z
    .string()
    .max(30, "Telefon numarası 30 karakterden uzun olamaz.")
    // Sadece rakam, bosluk, +, -, (, ) karakterlerine izin ver
    .regex(/^[\d\s+\-().]*$/, "Telefon numarası geçersiz karakter içeriyor.")
    .optional()
    .or(z.literal("")), // bos string de geçerli

  service: z
    .string()
    .refine(
      (v) => (ALLOWED_SERVICES as readonly string[]).includes(v),
      "geçersiz hizmet seçimi."
    ),

  detail: z
    .string()
    .max(2000, "Detay 2000 karakterden uzun olamaz.")
    .refine((v) => !/<script/i.test(v), "Detay alanı geçersiz içerik barındırıyor.")
    .optional()
    .or(z.literal("")),

  contactMethod: z.enum(["whatsapp", "email", "telegram"], {
    error: "geçersiz iletisim yöntemi.",
  }),
});

// semadan TypeScript tipini otomatik türet — tek kaynak of truth
export type TeklifFormData = z.infer<typeof TeklifFormSchema>;

async function notifyTeklifToAdmin(data: {
  token: string;
  name: string;
  email: string;
  phone: string | null;
  service: string;
  detail: string | null;
  contactMethod: string;
}): Promise<{ ok: boolean; error?: string }> {
  const botToken = process.env.TELEgRAM_BOT_TOKEN;
  const chatId = process.env.TELEgRAM_ADMIN_CHAT_ID || process.env.TELEgRAM_CHANNEL_ID;

  if (!botToken || !chatId) {
    return { ok: false, error: "Telegram env degiskenleri eksik" };
  }

  const escape = (s: string | null | undefined) =>
    (s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] ?? c));

  const text = [
    `<b>📋 Yeni Teklif Talebi</b>`,
    ``,
    `<b>Isim:</b> ${escape(data.name)}`,
    `<b>E-posta:</b> ${escape(data.email)}`,
    data.phone ? `<b>Telefon:</b> ${escape(data.phone)}` : null,
    `<b>Hizmet:</b> ${escape(data.service)}`,
    data.detail ? `<b>Detay:</b> ${escape(data.detail)}` : null,
    `<b>Iletisim:</b> ${escape(data.contactMethod)}`,
    `<b>Token:</b> <code>${escape(data.token)}</code>`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    });
    const json = await res.json();
    return json.ok ? { ok: true } : { ok: false, error: json.description };
  } catch (err: unknown) {
    return { ok: false, error: err instanceof Error ? err.message : "Bilinmeyen hata" };
  }
}

export async function submitTeklifAction(
  rawData: unknown
): Promise<{ success: boolean; token?: string; error?: string }> {
  // ── Zod ile runtime dogrulama ─────────────────────────────────────────────
  // `rawData: unknown` — TypeScript'in derleme garantisi çalısma zamanında
  // geçersiz; tarayıcıdan/Postman'dan gelen her veri burada dogrulanır.
  const parsed = TeklifFormSchema.safeParse(rawData);
  if (!parsed.success) {
    // Ilk hatayı kullanıcıya göster, tüm hata detayını loglama (bilgi sızdırma)
    const firstError = parsed.error.issues[0]?.message ?? "geçersiz form verisi.";
    return { success: false, error: firstError };
  }

  // Bu noktadan itibaren `data` tip-güvenli ve dogrulanmıs
  const data = parsed.data;

  try {
    const token = randomUUID();

    // DB'ye kaydet
    try {
      await query(
        `INSERT INTO teklif_requests (token, name, email, phone, service, detail, status)
         VALUES ($1, $2, $3, $4, $5, $6, 'pending')
         ON CONFLICT DO NOTHINg`,
        [
          token,
          data.name.trim(),
          data.email,                      // Zod toLowerCase() uyguladı
          data.phone?.trim() || null,
          data.service,
          data.detail?.trim() || null,
        ]
      );
    } catch (dbErr: any) {
      console.error("[Teklif] DB kayıt hatası:", dbErr?.message);
      // Tablo yoksa olusturmayı dene
      if (dbErr?.message?.includes("does not exist") || dbErr?.code === "42P01") {
        try {
          await query(`
            CREATE TABLE IF NOT EXISTS teklif_requests (
              id SERIAL PRIMARY KEY,
              token UUID NOT NULL UNIQUE,
              name VARCHAR(255) NOT NULL,
              email VARCHAR(255) NOT NULL,
              phone VARCHAR(50),
              service VARCHAR(255) NOT NULL,
              detail TEXT,
              status VARCHAR(50) NOT NULL DEFAULT 'pending',
              price NUMERIC,
              payment_url TEXT,
              payment_method VARCHAR(50),
              created_at TIMESTAMPTZ DEFAULT NOW(),
              updated_at TIMESTAMPTZ DEFAULT NOW()
            )
          `);
          // Tekrar dene
          await query(
            `INSERT INTO teklif_requests (token, name, email, phone, service, detail, status)
             VALUES ($1, $2, $3, $4, $5, $6, 'pending')`,
            [
              token,
              data.name.trim(),
              data.email,
              data.phone?.trim() || null,
              data.service,
              data.detail?.trim() || null,
            ]
          );
        } catch (createErr: any) {
          console.error("[Teklif] Tablo olusturma hatası:", createErr?.message);
        }
      }
    }

    // Telegram bildirimi — admin'e özel mesaj
    const telegramResult = await notifyTeklifToAdmin({
      token,
      name: data.name.trim(),
      email: data.email,
      phone: data.phone?.trim() || null,
      service: data.service,
      detail: data.detail?.trim() || null,
      contactMethod: data.contactMethod,
    });

    if (!telegramResult.ok) {
      console.error("[Teklif] Telegram bildirimi gönderilemedi:", telegramResult.error);
      // Telegram gitmese de basarılı say — DB kaydı yeterli
    }

    return { success: true, token };
  } catch (err: any) {
    console.error("[Teklif] genel hata:", err?.message);
    return { 
      success: false, 
      error: err.message || "Sunucu hatası olustu" 
    };
  }
}
