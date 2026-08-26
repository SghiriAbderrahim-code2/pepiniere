"use client";

import { Leaf } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  CARD_WIDTHS,
  getCloudinarySrcSet,
  getCloudinaryUrl,
  isCloudinaryUrl,
} from "@/lib/cloudinary-image";

export function ProductImage({
  src,
  alt,
  className,
  priority,
  sizes,
  widths,
}: {
  src: string | null | undefined;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  widths?: readonly number[];
}) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "flex h-full w-full items-center justify-center bg-secondary/60 text-primary/70",
          className,
        )}
      >
        <Leaf className="size-10" aria-hidden />
      </div>
    );
  }

  const cloudinary = isCloudinaryUrl(src);
  const widthsList = widths ?? CARD_WIDTHS;
  const srcSet = cloudinary ? getCloudinarySrcSet(src, widthsList) : null;
  const defaultSrc = cloudinary
    ? getCloudinaryUrl(src, { width: widthsList[Math.floor(widthsList.length / 2)] })
    : src;

  return (
    <img
      src={defaultSrc}
      srcSet={srcSet ?? undefined}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      // High priority for LCP images (hero / product main), auto otherwise.
      fetchPriority={priority ? "high" : "auto"}
      onError={() => setErrored(true)}
      alt={alt}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
