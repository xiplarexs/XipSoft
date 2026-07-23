import { NextRequest, NextResponse } from "next/server";
import { extractAuthContext } from "@/lib/api-guard";

export const runtime = "nodejs";

/**
 * gET /api/admin/media — Medya dosyalarını listeler (public/images/ klasöründen)
 */
export async function gET(req: NextRequest) {
  const ctx = await extractAuthContext(req);
  if (!ctx.isAuthenticated || ctx.userRole !== "admin") {
    return NextResponse.json({ ok: false, error: "Yetkisiz erisim" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const folder = searchParams.get("folder") || "images";
  const allowedFolders = ["images", "media", "uploads"];

  if (!allowedFolders.includes(folder)) {
    return NextResponse.json({ ok: false, error: "geçersiz klasör" }, { status: 400 });
  }

  try {
    const fs = await import("fs/promises");
    const path = await import("path");

    const dirPath = path.join(process.cwd(), "public", folder);

    // Klasör yoksa olustur
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
      return NextResponse.json({ ok: true, files: [], folder });
    }

    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
      if (entry.isFile()) {
        const filePath = path.join(dirPath, entry.name);
        const stat = await fs.stat(filePath);
        const ext = path.extname(entry.name).toLowerCase();

        files.push({
          name: entry.name,
          path: `/${folder}/${entry.name}`,
          size: stat.size,
          sizeFormatted: formatFileSize(stat.size),
          type: getFileType(ext),
          ext,
          modifiedAt: stat.mtime.toISOString(),
          isImage: [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".avif"].includes(ext),
        });
      }
    }

    // Tarihe göre sırala (yeniden eskiye)
    files.sort((a, b) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime());

    return NextResponse.json({ ok: true, files, folder });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

/**
 * POST /api/admin/media — Dosya yükle
 */
export async function POST(req: NextRequest) {
  const ctx = await extractAuthContext(req);
  if (!ctx.isAuthenticated || ctx.userRole !== "admin") {
    return NextResponse.json({ ok: false, error: "Yetkisiz erisim" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "uploads";

    if (!file) {
      return NextResponse.json({ ok: false, error: "Dosya seçilmedi" }, { status: 400 });
    }

    // Boyut kontrolü (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ ok: false, error: "Dosya boyutu 10MB'dan büyük olamaz" }, { status: 400 });
    }

    // Izin verilen tipler
    const allowedExts = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".pdf", ".json", ".txt", ".md"];
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!allowedExts.includes(ext)) {
      return NextResponse.json({ ok: false, error: `Izin verilmeyen dosya türü: ${ext}` }, { status: 400 });
    }

    // güvenli dosya adı
    const safeName = file.name
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .replace(/_{2,}/g, "_")
      .toLowerCase();

    const fs = await import("fs/promises");
    const path = await import("path");

    const dirPath = path.join(process.cwd(), "public", folder);
    await fs.mkdir(dirPath, { recursive: true });

    const filePath = path.join(dirPath, safeName);
    const buffer = Buffer.from(await file.arrayBuffer());

    await fs.writeFile(filePath, buffer);

    return NextResponse.json({
      ok: true,
      file: {
        name: safeName,
        path: `/${folder}/${safeName}`,
        size: file.size,
        sizeFormatted: formatFileSize(file.size),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/media?path=/uploads/file.jpg — Dosya sil
 */
export async function DELETE(req: NextRequest) {
  const ctx = await extractAuthContext(req);
  if (!ctx.isAuthenticated || ctx.userRole !== "admin") {
    return NextResponse.json({ ok: false, error: "Yetkisiz erisim" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const filePath = searchParams.get("path");

  if (!filePath || !filePath.startsWith("/")) {
    return NextResponse.json({ ok: false, error: "geçersiz dosya yolu" }, { status: 400 });
  }

  // Path traversal koruması
  if (filePath.includes("..")) {
    return NextResponse.json({ ok: false, error: "geçersiz dosya yolu" }, { status: 400 });
  }

  try {
    const fs = await import("fs/promises");
    const path = await import("path");

    const fullPath = path.join(process.cwd(), "public", filePath);
    const normalizedPath = path.normalize(fullPath);

    if (!normalizedPath.startsWith(path.join(process.cwd(), "public"))) {
      return NextResponse.json({ ok: false, error: "geçersiz dosya yolu" }, { status: 400 });
    }

    await fs.unlink(fullPath);
    return NextResponse.json({ ok: true, message: "Dosya silindi" });
  } catch (err: any) {
    if (err.code === "ENOENT") {
      return NextResponse.json({ ok: false, error: "Dosya bulunamadı" }, { status: 404 });
    }
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileType(ext: string): string {
  const types: Record<string, string> = {
    ".jpg": "image", ".jpeg": "image", ".png": "image", ".gif": "image",
    ".webp": "image", ".svg": "image", ".avif": "image",
    ".pdf": "document", ".txt": "text", ".md": "text",
    ".json": "data",
  };
  return types[ext] || "other";
}
