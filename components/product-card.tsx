import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductImage } from "./product-image";
import { formatPrice } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CARD_WIDTHS, PRODUCT_CARD_SIZES } from "@/lib/cloudinary-image";
import type { Product } from "@/types/database.types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-within:ring-2 focus-within:ring-ring">
      <Link
        href={`/plants/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden bg-secondary/40"
      >
        <ProductImage
          src={product.main_image}
          alt={product.name}
          className="transition-transform duration-500 group-hover:scale-105"
          sizes={PRODUCT_CARD_SIZES}
          widths={CARD_WIDTHS}
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-heading text-lg font-semibold text-foreground">
          <Link
            href={`/plants/${product.slug}`}
            className="outline-none after:absolute after:inset-0"
          >
            {product.name}
          </Link>
        </h3>
        {product.short_description ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {product.short_description}
          </p>
        ) : null}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
          <span className="text-base font-semibold text-primary">
            {formatPrice(product.price)}
          </span>
          <span
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "pointer-events-none gap-1.5",
            )}
          >
            عرض التفاصيل
            <ArrowLeft className="size-4" />
          </span>
        </div>
      </div>
    </article>
  );
}
