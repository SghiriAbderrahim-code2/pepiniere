"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/admin";
import { deleteImage, CLOUDINARY_FOLDER } from "@/lib/cloudinary";
import { isValidUuid } from "@/lib/validations/product";
import type { ProductImage } from "@/types/database.types";

const CLOUDINARY_HOST = "https://res.cloudinary.com/";

function isOwnedPublicId(publicId: string | null): boolean {
  return !!publicId && publicId.startsWith(CLOUDINARY_FOLDER);
}

export async function addProductImage(
  productId: string,
  secureUrl: string,
  publicId: string,
): Promise<ProductImage> {
  await requireAdmin();
  if (!isValidUuid(productId)) {
    throw new Error("معرّف المنتج غير صالح.");
  }
  if (!secureUrl?.startsWith(CLOUDINARY_HOST)) {
    throw new Error("رابط الصورة غير صالح.");
  }
  if (!isOwnedPublicId(publicId)) {
    throw new Error("معرّف الصورة غير صالح.");
  }

  const supabase = await createClient();

  const { data: product, error: pErr } = await supabase
    .from("products")
    .select("id")
    .eq("id", productId)
    .maybeSingle();
  if (pErr || !product) {
    throw new Error("المنتج غير موجود.");
  }

  const { data, error } = await supabase
    .from("product_images")
    .insert({
      product_id: productId,
      image_url: secureUrl,
      public_id: publicId,
    })
    .select("id, product_id, image_url, public_id, created_at")
    .single();
  if (error || !data) {
    console.error("addProductImage failed:", error?.message);
    throw new Error("تعذر حفظ الصورة. حاول مرة أخرى.");
  }

  revalidatePath("/admin/products");
  revalidatePath("/plants");
  revalidatePath("/");

  return data as ProductImage;
}

export async function deleteProductImage(imageId: string): Promise<void> {
  await requireAdmin();
  if (!isValidUuid(imageId)) {
    throw new Error("معرّف الصورة غير صالح.");
  }
  const supabase = await createClient();

  const { data: image, error: imgErr } = await supabase
    .from("product_images")
    .select("id, product_id, image_url, public_id")
    .eq("id", imageId)
    .maybeSingle();
  if (imgErr || !image) {
    throw new Error("الصورة غير موجودة.");
  }

  // Decide whether the asset is also referenced as the product's main image.
  // If so, keep the Cloudinary asset so the main image keeps rendering.
  const { data: product } = await supabase
    .from("products")
    .select("main_image")
    .eq("id", image.product_id)
    .maybeSingle();
  const isMain = !!product && product.main_image === image.image_url;

  if (!isMain && image.public_id) {
    const del = await deleteImage(image.public_id);
    if (!del.ok && del.raw !== "not found") {
      throw new Error("تعذر حذف الصورة من التخزين السحابي.");
    }
  }

  const { error: delErr } = await supabase
    .from("product_images")
    .delete()
    .eq("id", image.id);
  if (delErr) {
    console.error("deleteProductImage row failed:", delErr.message);
    throw new Error("تعذر حذف الصورة من قاعدة البيانات.");
  }

  revalidatePath("/admin/products");
  revalidatePath("/plants");
  revalidatePath("/");
}

export async function setProductMainImage(
  productId: string,
  imageId: string,
): Promise<void> {
  await requireAdmin();
  if (!isValidUuid(productId) || !isValidUuid(imageId)) {
    throw new Error("معرّف غير صالح.");
  }
  const supabase = await createClient();

  const { data: image, error: imgErr } = await supabase
    .from("product_images")
    .select("id, product_id, image_url, public_id")
    .eq("id", imageId)
    .eq("product_id", productId)
    .maybeSingle();
  if (imgErr || !image) {
    throw new Error("الصورة غير موجودة لهذا المنتج.");
  }
  if (!isOwnedPublicId(image.public_id)) {
    throw new Error("معرّف الصورة غير صالح.");
  }

  const { error } = await supabase
    .from("products")
    .update({ main_image: image.image_url })
    .eq("id", productId);
  if (error) {
    console.error("setProductMainImage failed:", error.message);
    throw new Error("تعذر تعيين الصورة الرئيسية.");
  }

  revalidatePath("/admin/products");
  revalidatePath("/plants");
  revalidatePath("/plants/[slug]", "page");
  revalidatePath("/");
}
