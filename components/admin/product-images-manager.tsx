"use client";

import { useRef, useState, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ImagePlus,
  Loader2,
  Trash2,
  Star,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { uploadToCloudinary } from "@/lib/client/upload";
import {
  addProductImage,
  deleteProductImage,
  setProductMainImage,
} from "@/app/admin/actions/images";
import type { ProductImage } from "@/types/database.types";

export function ProductImagesManager({
  productId,
  initialImages,
  initialMain,
  slug,
}: {
  productId: string;
  initialImages: ProductImage[];
  initialMain: string | null;
  slug?: string;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<ProductImage[]>(initialImages);
  const [mainUrl, setMainUrl] = useState<string | null>(initialMain);
  const [uploading, setUploading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  async function handleFiles(files: FileList | File[]) {
    setError(null);
    const list = Array.from(files);
    if (list.length === 0) return;
    setUploading(true);
    let failures = 0;
    for (const file of list) {
      if (file.size > 5 * 1024 * 1024) {
        failures++;
        toast.error(`الملف "${file.name}" كبير جدًا (الحد الأقصى 5 ميجابايت).`);
        continue;
      }
      try {
        const result = await uploadToCloudinary(file, slug);
        const row = await addProductImage(
          productId,
          result.secure_url,
          result.public_id,
        );
        setImages((prev) => [...prev, row]);
      } catch (e) {
        failures++;
        toast.error(e instanceof Error ? e.message : "تعذر رفع الصورة.");
      }
    }
    setUploading(false);
    if (failures === 0) toast.success("تمت إضافة الصور");
    else router.refresh();
  }

  async function onRemove(img: ProductImage) {
    setBusyId(img.id);
    try {
      await deleteProductImage(img.id);
      setImages((prev) => prev.filter((i) => i.id !== img.id));
      if (mainUrl === img.image_url) setMainUrl(null);
      toast.success("تم حذف الصورة");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "تعذر حذف الصورة.");
    } finally {
      setBusyId(null);
    }
  }

  async function onSetMain(img: ProductImage) {
    setBusyId(img.id);
    try {
      await setProductMainImage(productId, img.id);
      setMainUrl(img.image_url);
      toast.success("تم تعيين الصورة الرئيسية");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "تعذر التعيين.");
    } finally {
      setBusyId(null);
    }
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.length) void handleFiles(e.dataTransfer.files);
  }

  return (
    <section className="space-y-4 rounded-xl border border-border bg-card p-4 sm:p-6">
      <div>
        <h2 className="font-heading text-lg font-semibold">معرض الصور</h2>
        <p className="text-sm text-muted-foreground">
          أضف عدة صور للنبتة، وحدد الصورة الرئيسية.
        </p>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => !uploading && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !uploading)
            inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors",
          dragging ? "border-primary bg-primary/5" : "border-border",
          uploading ? "cursor-wait opacity-80" : "cursor-pointer hover:border-primary/60",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) void handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
        {uploading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            جارٍ رفع الصور...
          </div>
        ) : (
          <>
            <ImagePlus className="size-8 text-muted-foreground" aria-hidden />
            <span className="text-sm text-muted-foreground">
              اختر صورًا أو أفلتها هنا (JPG / PNG / WebP، حتى 5 ميجابايت لكل صورة)
            </span>
            <Button type="button" variant="outline" size="sm">
              اختر الصور
            </Button>
          </>
        )}
      </div>

      {/* Main image */}
      <div>
        <p className="mb-2 text-sm font-medium">الصورة الرئيسية</p>
        {mainUrl ? (
          <div className="relative w-fit overflow-hidden rounded-lg border-2 border-primary">
            <img
              src={mainUrl}
              alt="الصورة الرئيسية"
              className="h-40 w-auto object-contain"
            />
          </div>
        ) : (
          <div className="flex h-40 w-40 items-center justify-center rounded-lg border border-dashed bg-secondary/40 text-muted-foreground">
            <ImageIcon className="size-8" />
          </div>
        )}
      </div>

      {/* Gallery */}
      {images.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium">صور المعرض</p>
          <div className="flex flex-wrap gap-3">
            {images.map((img) => {
              const isMain = mainUrl === img.image_url;
              return (
                <div
                  key={img.id}
                  className={cn(
                    "relative flex flex-col items-center gap-1 rounded-lg border p-1",
                    isMain ? "border-primary" : "border-border",
                  )}
                >
                  <img
                    src={img.image_url}
                    alt="صورة النبتة"
                    className="size-24 rounded object-cover"
                  />
                  <div className="flex items-center gap-1">
                    {!isMain && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label="تعيين كرئيسية"
                        disabled={busyId === img.id}
                        onClick={() => onSetMain(img)}
                      >
                        <Star className="size-4" />
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label="حذف الصورة"
                      className="text-destructive"
                      disabled={busyId === img.id}
                      onClick={() => onRemove(img)}
                    >
                      {busyId === img.id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Trash2 className="size-4" />
                      )}
                    </Button>
                  </div>
                  {isMain && (
                    <span className="text-[10px] font-medium text-primary">
                      رئيسية
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
