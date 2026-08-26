"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/admin";
import { deleteImage, publicIdFromUrl } from "@/lib/cloudinary";
import { productSchema, type ProductFormValues, isValidUuid } from "@/lib/validations/product";

export type ProductActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
};

type ProductPayload = Omit<ProductFormValues, "visible"> & {
  visible: boolean;
};

function toPayload(data: ProductFormValues): ProductPayload {
  return {
    name: data.name,
    slug: data.slug,
    price: data.price,
    short_description: data.short_description,
    description: data.description,
    main_image: data.main_image,
    visible: data.visible,
  };
}

async function isSlugTaken(
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  const supabase = await createClient();
  let query = supabase.from("products").select("id").eq("slug", slug);
  if (excludeId) query = query.neq("id", excludeId);
  const { data } = await query.maybeSingle();
  return !!data;
}

function parse(formData: FormData):
  | { ok: true; values: ProductFormValues }
  | { ok: false; error: ProductActionState } {
  const raw = Object.fromEntries(formData.entries());
  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: {
        error: "يرجى تصحيح الأخطاء في النموذج.",
        fieldErrors: parsed.error.flatten().fieldErrors as Record<
          string,
          string[]
        >,
      },
    };
  }
  return { ok: true, values: parsed.data };
}

export async function createProduct(
  _prev: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  await requireAdmin();
  const result = parse(formData);
  if (!result.ok) return result.error;

  if (await isSlugTaken(result.values.slug)) {
    return { error: "هذا الرابط مستخدم بالفعل." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .insert(toPayload(result.values));

  if (error) {
    console.error("createProduct failed:", error.message);
    return { error: "تعذر إضافة النبات. حاول مرة أخرى." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/plants");
  revalidatePath("/");

  return { success: true };
}

export async function updateProduct(
  id: string,
  _prev: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  await requireAdmin();
  const result = parse(formData);
  if (!result.ok) return result.error;

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("products")
    .select("slug, main_image")
    .eq("id", id)
    .maybeSingle();

  if (!existing) {
    return { error: "المنتج غير موجود." };
  }

  if (result.values.slug !== existing.slug && (await isSlugTaken(result.values.slug, id))) {
    return { error: "هذا الرابط مستخدم بالفعل." };
  }

  const { error } = await supabase
    .from("products")
    .update(toPayload(result.values))
    .eq("id", id);

  if (error) {
    console.error("updateProduct failed:", error.message);
    return { error: "تعذر تحديث النبات. حاول مرة أخرى." };
  }

  // Clean up the previous main image asset if it was replaced and is not
  // still referenced by a gallery row.
  if (
    existing.main_image &&
    existing.main_image !== result.values.main_image
  ) {
    const oldPid = publicIdFromUrl(existing.main_image);
    if (oldPid) {
      const { data: stillRef } = await supabase
        .from("product_images")
        .select("id")
        .eq("product_id", id)
        .eq("image_url", existing.main_image)
        .maybeSingle();
      if (!stillRef) {
        try {
          await deleteImage(oldPid);
        } catch (e) {
          console.error("old main image cleanup failed:", e);
        }
      }
    }
  }

  revalidatePath("/admin/products");
  revalidatePath("/plants");
  revalidatePath("/plants/[slug]", "page");
  revalidatePath("/");

  return { success: true };
}

export async function setProductVisibility(
  id: string,
  visible: boolean,
): Promise<void> {
  await requireAdmin();
  if (!isValidUuid(id)) {
    throw new Error("معرّف غير صالح.");
  }
  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({ visible })
    .eq("id", id);

  if (error) {
    console.error("setProductVisibility failed:", error.message);
    throw new Error(
      visible ? "تعذر إظهار النبات." : "تعذر إخفاء النبات.",
    );
  }

  revalidatePath("/admin/products");
  revalidatePath("/admin/products/hidden");
  revalidatePath("/plants");
  revalidatePath("/");
}

export async function deleteProduct(id: string): Promise<void> {
  await requireAdmin();
  if (!isValidUuid(id)) {
    throw new Error("معرّف غير صالح.");
  }
  const supabase = await createClient();

  // Gather Cloudinary assets before deleting the product.
  const { data: rows } = await supabase
    .from("product_images")
    .select("public_id")
    .eq("product_id", id);
  const { data: product } = await supabase
    .from("products")
    .select("main_image")
    .eq("id", id)
    .maybeSingle();

  const publicIds: string[] = [];
  for (const r of rows ?? []) {
    if (r.public_id) publicIds.push(r.public_id);
  }
  const mainPid = publicIdFromUrl(product?.main_image);
  if (mainPid) publicIds.push(mainPid);

  const failed: string[] = [];
  for (const pid of publicIds) {
    try {
      const res = await deleteImage(pid);
      if (!res.ok && res.raw !== "not found") failed.push(pid);
    } catch {
      failed.push(pid);
    }
  }

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    console.error("deleteProduct failed:", error.message);
    throw new Error("تعذر حذف النبات.");
  }

  if (failed.length > 0) {
    throw new Error(
      "تم حذف النبات لكن تعذر حذف بعض صوره من التخزين السحابي.",
    );
  }

  revalidatePath("/admin/products");
  revalidatePath("/admin/products/hidden");
  revalidatePath("/plants");
  revalidatePath("/");
}
