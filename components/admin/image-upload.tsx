"use client";

import { useRef, useState, type DragEvent } from "react";
import { ImageUp, Loader2, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadToCloudinary } from "@/lib/client/upload";
import { cn } from "@/lib/utils";

export function ImageUpload({
  value,
  onChange,
  slug,
  label = "الصورة الرئيسية",
  hint = "اختر صورة أو أفلتها هنا (JPG / PNG / WebP، حتى 5 ميجابايت)",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  slug?: string;
  label?: string;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  async function handleFile(file: File) {
    setError(null);
    if (file.size > 5 * 1024 * 1024) {
      setError("حجم الصورة كبير جدًا (الحد الأقصى 5 ميجابايت).");
      return;
    }
    setUploading(true);
    try {
      const result = await uploadToCloudinary(file, slug);
      onChange(result.secure_url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذر رفع الصورة، حاول مرة أخرى.");
    } finally {
      setUploading(false);
    }
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">{label}</span>

      <div
        role="button"
        tabIndex={0}
        onClick={() => !uploading && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !uploading) {
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 text-center transition-colors",
          dragging ? "border-primary bg-primary/5" : "border-border",
          uploading && "cursor-wait opacity-80",
          !uploading && "cursor-pointer hover:border-primary/60",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
            e.target.value = "";
          }}
        />

        {value ? (
          <div className="relative w-full">
            <img
              src={value}
              alt="معاينة الصورة الرئيسية"
              className="mx-auto max-h-56 w-auto rounded-lg object-contain"
            />
            {!uploading && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(null);
                }}
                className="absolute end-2 top-2 inline-flex size-8 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow hover:bg-destructive/90"
                aria-label="إزالة الصورة"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 text-muted-foreground">
            <ImageUp className="size-8" aria-hidden />
            <span className="text-sm">{hint}</span>
          </div>
        )}

        {uploading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            جارٍ رفع الصورة...
          </div>
        )}
      </div>

      {!value && !uploading && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
        >
          <ImageIcon className="size-4" />
          اختر الصور
        </Button>
      )}

      {value && !uploading && (
        <p className="text-xs text-emerald-600">تم رفع الصورة</p>
      )}

      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
