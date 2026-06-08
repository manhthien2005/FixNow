"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { publicImageUrl } from "@/lib/images";

interface ImageUploadProps {
  folder: "parts" | "services";
  value: string | null;
  onChange: (path: string | null) => void;
  /** Repo fallback preview shown when no upload exists yet. */
  fallbackSrc?: string;
}

/**
 * Admin image picker: uploads to /api/admin/upload (Supabase Storage) and
 * returns the stored object path. Shows a live preview; supports clearing.
 */
export function ImageUpload({
  folder,
  value,
  onChange,
  fallbackSrc,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const preview = publicImageUrl(value) ?? fallbackSrc ?? null;

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", folder);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = (await res.json()) as { path?: string; message?: string };
      if (!res.ok || !data.path) {
        setError(data.message ?? "Tải ảnh thất bại.");
        return;
      }
      onChange(data.path);
    } catch {
      setError("Lỗi mạng khi tải ảnh.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/15 bg-surface-container/40",
          uploading && "opacity-60",
        )}
      >
        {preview ? (
          <Image
            src={preview}
            alt="Xem trước ảnh"
            fill
            sizes="(min-width: 768px) 24rem, 90vw"
            className="object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-on-surface-variant">
            <ImagePlus className="size-8" aria-hidden="true" />
            <span className="text-sm">Chưa có ảnh</span>
          </div>
        )}

        {uploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-container-lowest/60">
            <Loader2 className="size-7 animate-spin text-secondary" />
          </div>
        ) : null}

        {value ? (
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="Xóa ảnh"
            className="absolute right-2 top-2 z-10 flex size-8 items-center justify-center rounded-full bg-surface-container-lowest/80 text-on-surface backdrop-blur transition-colors hover:text-destructive"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-surface-container/50 px-4 py-2 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-high disabled:opacity-50"
        >
          <ImagePlus className="size-4" />
          {value ? "Đổi ảnh" : "Tải ảnh lên"}
        </button>
        <span className="text-xs text-on-surface-variant">
          JPG / PNG / WEBP, tối đa 4MB
        </span>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
