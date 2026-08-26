import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";
import { getAdminHiddenProducts } from "@/lib/data/admin-products";
import { ProductsTable } from "@/components/products-table";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";

export default async function HiddenProductsPage() {
  await requireAdmin();
  const products = await getAdminHiddenProducts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">المنتجات المخفية</h1>
        <p className="text-muted-foreground">
          المنتجات غير الظاهرة في المتجر.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
          <p className="font-medium">لا توجد نباتات مخفية.</p>
          <Button
            nativeButton={false}
            render={<Link href="/admin/products" />}
            variant="outline"
            size="sm"
            className="mt-3"
          >
            الانتقال إلى كل النباتات
          </Button>
        </div>
      ) : (
        <Reveal>
          <ProductsTable products={products} />
        </Reveal>
      )}
    </div>
  );
}
