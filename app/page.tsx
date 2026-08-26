import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getVisibleProducts } from "@/lib/data/products";
import { ProductGrid } from "@/components/product-grid";
import { HomeHero } from "@/components/home-hero";
import { Container } from "@/components/container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function HomePage() {
  let products: Awaited<ReturnType<typeof getVisibleProducts>> = [];
  try {
    products = await getVisibleProducts();
  } catch {
    products = [];
  }
  const featured = products.slice(0, 8);

  return (
    <>
      <HomeHero />

      <Container className="py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground">
              نباتات مختارة
            </h2>
            <p className="text-muted-foreground">أجمل النباتات لمنزلك ومساحتك.</p>
          </div>
          <Link
            href="/plants"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "gap-2 shrink-0",
            )}
          >
            عرض جميع النباتات
            <ArrowLeft className="size-4" />
          </Link>
        </div>
        {featured.length > 0 ? (
          <ProductGrid products={featured} />
        ) : (
          <p className="text-muted-foreground">لا توجد نباتات لعرضها حاليًا.</p>
        )}
      </Container>
    </>
  );
}
