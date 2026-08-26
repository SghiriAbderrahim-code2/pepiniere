"use client";

import { useState, type KeyboardEvent } from "react";
import { ProductImage } from "./product-image";
import { cn } from "@/lib/utils";
import type { ProductImage as ProductImageRow } from "@/types/database.types";

export function ProductGallery({
  mainImage,
  images,
}: {
  mainImage: string | null;
  images: ProductImageRow[];
}) {
  const all = [mainImage, ...images.map((i) => i.image_url)].filter(
    (s): s is string => Boolean(s),
  );
  const [active, setActive] = useState(0);
  const current = all[active] ?? null;

  function handleKey(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowLeft") {
      setActive((a) => Math.min(all.length - 1, a + 1));
    } else if (e.key === "ArrowRight") {
      setActive((a) => Math.max(0, a - 1));
    }
  }

  if (all.length === 0) {
    return (
      <div className="aspect-square w-full overflow-hidden rounded-[2rem] bg-secondary/40">
        <ProductImage src={null} alt="" sizes="(max-width:1024px) 100vw, 50vw" />
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label="معرض صور النبتة"
      tabIndex={0}
      onKeyDown={handleKey}
      className="flex w-full min-w-0 max-w-full flex-col gap-3 overflow-hidden outline-none"
    >
      <div className="relative aspect-square w-full min-w-0 overflow-hidden rounded-[2rem] bg-secondary/40">
        <ProductImage
          src={current}
          alt=""
          priority
          sizes="(max-width:1024px) 100vw, 50vw"
        />
      </div>
      {all.length > 1 ? (
        <div className="flex w-full min-w-0 max-w-full gap-2 overflow-x-auto overflow-y-hidden pb-2 [scrollbar-width:thin]">
          {all.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`عرض الصورة ${i + 1}`}
              aria-pressed={i === active}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-xl border-2 transition-colors sm:size-[72px]",
                i === active
                  ? "border-primary"
                  : "border-transparent hover:border-border",
              )}
            >
              <ProductImage src={src} alt="" sizes="72px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
