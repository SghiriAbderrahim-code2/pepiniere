import "server-only";

import { createClient } from "@/lib/supabase/server";
import { displayUrl } from "@/lib/cloudinary";
import type { Product, ProductImage } from "@/types/database.types";

const PRODUCT_SELECT =
  "id, slug, name, price, short_description, description, main_image, visible, light_requirement, water_requirement, care_instructions, suitable_location, temperature, humidity, created_at, updated_at";

/** All customer-visible products, newest first. Throws on DB error. */
export async function getVisibleProducts(): Promise<Product[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("visible", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load products: ${error.message}`);
  }

  return (data ?? []).map((p) => ({
    ...p,
    main_image: displayUrl(p.main_image),
  }));
}

/** Single visible product by slug; null when hidden or missing. */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("visible", true)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load product "${slug}": ${error.message}`);
  }

  if (!data) return null;
  return { ...data, main_image: displayUrl(data.main_image) };
}

/** Gallery images for a product. RLS applies via the normal anon server client. */
export async function getProductImages(
  productId: string,
): Promise<ProductImage[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("product_images")
    .select("id, product_id, image_url, public_id, created_at")
    .eq("product_id", productId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to load product images: ${error.message}`);
  }

  return (data ?? []).map((img) => ({
    ...img,
    image_url: displayUrl(img.image_url) ?? img.image_url,
  }));
}
