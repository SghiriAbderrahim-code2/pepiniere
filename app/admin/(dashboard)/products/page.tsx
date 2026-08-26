import Link from "next/link";
import { Plus, Search, X } from "lucide-react";
import { requireAdmin } from "@/lib/auth/admin";
import { getAdminProducts } from "@/lib/data/admin-products";
import { ProductsTable } from "@/components/products-table";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  await requireAdmin();
  const { search } = await searchParams;
  const products = await getAdminProducts(search);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">المنتجات</h1>
          <p className="text-muted-foreground">
            إدارة النباتات والمنتجات المعروضة.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/admin/products/new" />}>
          <Plus className="size-4" />
          إضافة نبات
        </Button>
      </div>

      <form
        action="/admin/products"
        method="get"
        className="flex items-center gap-2"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            name="search"
            defaultValue={search ?? ""}
            placeholder="ابحث بالاسم..."
            className="ps-9"
            aria-label="بحث بالاسم"
          />
        </div>
        {search ? (
          <Button
            nativeButton={false}
            render={<Link href="/admin/products" />}
            variant="outline"
            size="icon-sm"
            aria-label="مسح البحث"
          >
            <X className="size-4" />
          </Button>
        ) : null}
        <Button type="submit" variant="secondary" size="sm">
          بحث
        </Button>
      </form>

      {products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
          {search ? (
            <>
              <p className="font-medium">لم يتم العثور على نتائج.</p>
              <Button
                nativeButton={false}
                render={<Link href="/admin/products" />}
                variant="outline"
                size="sm"
                className="mt-3"
              >
                مسح البحث
              </Button>
            </>
          ) : (
            <>
              <p className="font-medium">لا توجد نباتات بعد.</p>
              <Button
                nativeButton={false}
                render={<Link href="/admin/products/new" />}
                variant="outline"
                size="sm"
                className="mt-3"
              >
                إضافة نبات
              </Button>
            </>
          )}
        </div>
      ) : (
        <Reveal>
          <ProductsTable products={products} />
        </Reveal>
      )}
    </div>
  );
}
