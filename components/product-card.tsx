import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductImage } from "./product-image";
import { formatPrice } from "@/lib/format";
import { CARD_WIDTHS, PRODUCT_CARD_SIZES } from "@/lib/cloudinary-image";
import type { Product } from "@/types/database.types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group relative">
      <Link
        href={`/plants/${product.slug}`}
        className="block rounded-[1.75rem] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <div className="relative overflow-hidden rounded-[1.75rem] bg-secondary/40">
          <div className="aspect-[4/5] w-full">
            <ProductImage
              src={product.main_image}
              alt={product.name}
              className="transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              sizes={PRODUCT_CARD_SIZES}
              widths={CARD_WIDTHS}
            />
          </div>
          <span className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-center gap-1 bg-gradient-to-t from-black/40 to-transparent p-4 text-sm font-medium text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            استكشف النبات
            <ArrowLeft className="size-4" />
          </span>
        </div>
        <div className="mt-3 px-1">
          <h3 className="font-heading text-lg font-semibold text-foreground">
            {product.name}
          </h3>
          <p className="mt-1 text-base font-semibold text-primary">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    </article>
  );
}
