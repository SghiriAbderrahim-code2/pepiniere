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

      <Container className="py-20 sm:py-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-3xl font-bold text-foreground">
              اكتشف نباتاتنا
            </h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              اختر من مجموعتنا من النباتات والزهور التي تضيف الحياة والجمال إلى
              مساحتك.
            </p>
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
