import { ProductCard } from "./product-card";
import type { Product } from "@/types/database.types";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 min-[430px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 lg:gap-6 2xl:gap-7">
      {products.map((product, i) => (
        <div
          key={product.id}
          className="reveal"
          style={{ animationDelay: `${Math.min(i * 0.05, 0.4)}s` }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
