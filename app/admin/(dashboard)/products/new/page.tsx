import { requireAdmin } from "@/lib/auth/admin";
import { createProduct } from "@/app/admin/actions/products";
import { ProductForm } from "@/components/product-form";

export default async function NewProductPage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">إضافة نبات</h1>
        <p className="text-muted-foreground">أدخل بيانات النبتة الجديدة.</p>
      </div>
      <ProductForm
        action={createProduct}
        submitLabel="إضافة النبات"
        mode="create"
      />
    </div>
  );
}
