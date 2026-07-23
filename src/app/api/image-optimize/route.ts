/**
 * Image Optimization API
 *
 * Sharp ile görselleri optimize eder.
 * src/param, width, height, quality parametreleri desteklenir.
 */

import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";
export const revalidate = 86400; // 1 gün cache

const MAX_WIDTH = 2048;
const MAX_HEIgHT = 2048;
const DEFAULT_QUALITY = 80;

export async function gET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const src = searchParams.get("src");
  const width = Math.min(MAX_WIDTH, Math.max(1, parseInt(searchParams.get("width") || "800", 10)));
  const height = searchParams.get("height") ? Math.min(MAX_HEIgHT, Math.max(1, parseInt(searchParams.get("height")!, 10))) : undefined;
  const quality = Math.min(100, Math.max(1, parseInt(searchParams.get("quality") || String(DEFAULT_QUALITY), 10)));
  const format = searchParams.get("format") || "webp";

  if (!src) {
    return NextResponse.json({ error: "src parametresi gerekli" }, { status: 400 });
  }

  // src'nin güvenli oldugundan emin ol (SSRF koruması)
  if (src.startsWith("http://") || src.startsWith("https://")) {
    // Harici URL'lere izin verme
    return NextResponse.json({ error: "Harici URL'ler desteklenmiyor" }, { status: 400 });
  }

  try {
    // Public klasöründen görseli oku
    const fs = await import("fs/promises");
    const path = await import("path");

    const imagePath = path.join(process.cwd(), "public", src);

    // Path traversal koruması
    const normalizedPath = path.normalize(imagePath);
    if (!normalizedPath.startsWith(path.join(process.cwd(), "public"))) {
      return NextResponse.json({ error: "geçersiz yol" }, { status: 400 });
    }

    const imageBuffer = await fs.readFile(imagePath);

    let pipeline = sharp(imageBuffer)
      .resize(width, height, {
        fit: height ? "cover" : "inside",
        withoutEnlargement: true,
      });

    // Format seçimi
    switch (format) {
      case "jpeg":
      case "jpg":
        pipeline = pipeline.jpeg({ quality, progressive: true });
        break;
      case "png":
        pipeline = pipeline.png({ quality, compressionLevel: 9 });
        break;
      case "webp":
        pipeline = pipeline.webp({ quality });
        break;
      case "avif":
        pipeline = pipeline.avif({ quality });
        break;
      default:
        pipeline = pipeline.webp({ quality });
    }

    const optimized = await pipeline.toBuffer();

    const contentType = {
      jpeg: "image/jpeg",
      jpg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      avif: "image/avif",
    }[format] || "image/webp";

    return new NextResponse(new Uint8Array(optimized), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": String(optimized.length),
      },
    });
  } catch (err: any) {
    if (err.code === "ENOENT") {
      return NextResponse.json({ error: "görsel bulunamadı" }, { status: 404 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
