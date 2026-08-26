import { z } from "zod";

// Permissive slug: Latin, digits, Arabic, hyphen, underscore. Supports
// Arabic product names while staying URL-safe.
const slugRegex = /^[a-zA-Z0-9\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF_-]+$/;

const emptyToNull = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? null : v;

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "الاسم مطلوب")
    .max(150, "الاسم طويل جدًا"),
  slug: z
    .string()
    .trim()
    .min(1, "الرابط مطلوب")
    .max(160, "الرابط طويل جدًا")
    .regex(slugRegex, "الرابط يجب أن يحتوي على أحرف وأرقام وشرطات فقط"),
  price: z.coerce
    .number({ error: "السعر يجب أن يكون رقمًا" })
    .min(0, "السعر لا يمكن أن يكون سالبًا"),
  short_description: z.preprocess(
    emptyToNull,
    z.string().trim().max(200, "الوصف القصير طويل جدًا").nullable().optional(),
  ),
  description: z.preprocess(
    emptyToNull,
    z.string().trim().max(5000, "الوصف طويل جدًا").nullable().optional(),
  ),
  main_image: z.preprocess(
    emptyToNull,
    z
      .string()
      .trim()
      .max(2000, "رابط الصورة طويل جدًا")
      .url("رابط الصورة غير صالح")
      .nullable()
      .optional(),
  ),
  visible: z.coerce.boolean().default(true),
});

export type ProductFormValues = z.infer<typeof productSchema>;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidUuid(id: string | undefined | null): boolean {
  return typeof id === "string" && UUID_RE.test(id);
}
