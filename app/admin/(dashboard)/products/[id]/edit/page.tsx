import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { getAdminProductById } from "@/lib/data/admin-products";
import { getProductImages } from "@/lib/data/products";
import { updateProduct } from "@/app/admin/actions/products";
import { ProductForm } from "@/components/product-form";
import { ProductImagesManager } from "@/components/admin/product-images-manager";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const product = await getAdminProductById(id);

  if (!product) {
    notFound();
  }

  const images = await getProductImages(product.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">تعديل النبات</h1>
        <p className="text-muted-foreground">{product.name}</p>
      </div>
      <ProductForm
        action={updateProduct.bind(null, id)}
        initial={product}
        submitLabel="حفظ التغييرات"
        mode="edit"
      />
      <ProductImagesManager
        productId={product.id}
        initialImages={images}
        initialMain={product.main_image}
        slug={product.slug}
      />
    </div>
  );
}
