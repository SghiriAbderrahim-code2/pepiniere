import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types/database.types";

const ADMIN_PRODUCT_SELECT =
  "id, slug, name, price, short_description, description, main_image, visible, light_requirement, water_requirement, care_instructions, suitable_location, temperature, humidity, created_at, updated_at";

export async function getAdminStats(): Promise<{
  total: number;
  visible: number;
  hidden: number;
}> {
  const supabase = await createClient();
  const { count: total } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });
  const { count: visible } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("visible", true);
  const t = total ?? 0;
  const v = visible ?? 0;
  return { total: t, visible: v, hidden: Math.max(0, t - v) };
}

export async function getAdminProducts(search?: string): Promise<Product[]> {
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select(ADMIN_PRODUCT_SELECT)
    .order("created_at", { ascending: false });
  if (search && search.trim()) {
    query = query.ilike("name", `%${search.trim()}%`);
  }
  const { data, error } = await query;
  if (error) {
    console.error("getAdminProducts failed:", error.message);
    throw new Error("تعذر تحميل المنتجات");
  }
  return (data ?? []) as Product[];
}

export async function getAdminHiddenProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(ADMIN_PRODUCT_SELECT)
    .eq("visible", false)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getAdminHiddenProducts failed:", error.message);
    throw new Error("تعذر تحميل المنتجات المخفية");
  }
  return (data ?? []) as Product[];
}

export async function getAdminProductById(
  id: string,
): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(ADMIN_PRODUCT_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error("getAdminProductById failed:", error.message);
    throw new Error("تعذر تحميل المنتج");
  }
  return (data as Product) ?? null;
}

export async function getRecentProducts(limit = 5): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(ADMIN_PRODUCT_SELECT)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("getRecentProducts failed:", error.message);
    return [];
  }
  return (data ?? []) as Product[];
}
