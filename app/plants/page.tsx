import type { Metadata } from "next";
import { getVisibleProducts } from "@/lib/data/products";
import { ProductGrid } from "@/components/product-grid";
import { SearchBar } from "@/components/search-bar";
import { SortSelect } from "@/components/sort-select";
import { EmptyState } from "@/components/empty-state";
import { ErrorUI } from "@/components/error-ui";
import { Container } from "@/components/container";
import { filterAndSortProducts } from "@/lib/catalog";
import { SearchX } from "lucide-react";

export const metadata: Metadata = {
  title: "النباتات",
  description:
    "تصفّح مجموعتنا من النباتات والزهور. ابحث ورتّب حسب الأحدث أو السعر أو الاسم.",
};

export default async function PlantsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; sort?: string }>;
}) {
  const { search = "", sort = "newest" } = await searchParams;

  let products: Awaited<ReturnType<typeof getVisibleProducts>> = [];
  try {
    products = await getVisibleProducts();
  } catch {
    return (
      <Container className="py-20">
        <ErrorUI />
      </Container>
    );
  }

  const results = filterAndSortProducts(products, search, sort);

  return (
    <Container className="py-16 sm:py-20">
      <header className="mb-10">
        <h1 className="font-heading text-4xl font-bold text-foreground">
          النباتات
        </h1>
        <p className="mt-2 text-muted-foreground">
          تصفّح مجموعتنا المختارة من النباتات والزهور.
        </p>
      </header>

      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <SearchBar />
        </div>
        <SortSelect />
      </div>

      {results.length > 0 ? (
        <ProductGrid products={results} />
      ) : (
        <EmptyState
          icon={SearchX}
          title="لا توجد نتائج"
          description={
            search
              ? `لم نعثر على نباتات تطابق "${search}".`
              : "لا توجد نباتات متاحة للعرض حاليًا."
          }
        />
      )}
    </Container>
  );
}
