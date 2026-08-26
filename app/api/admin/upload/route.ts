import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import {
  uploadImage,
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  CLOUDINARY_FOLDER,
} from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // Verify admin. requireAdmin() redirects on failure; we convert that into a
  // clean 401 JSON so API clients get a machine-readable rejection.
  try {
    await requireAdmin();
  } catch {
    return Response.json({ error: "غير مصرح لك برفع الصور." }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return Response.json({ error: "طلب غير صالح." }, { status: 400 });
  }

  const file = formData.get("file");
  const slug = (formData.get("slug") as string | null)?.trim() || "";

  if (!file || !(file instanceof File)) {
    return Response.json({ error: "لم يتم تحديد ملف." }, { status: 400 });
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return Response.json(
      { error: "نوع الملف غير مدعوم. استخدم JPG أو PNG أو WebP." },
      { status: 400 },
    );
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return Response.json(
      { error: "حجم الصورة كبير جدًا (الحد الأقصى 5 ميجابايت)." },
      { status: 400 },
    );
  }

  const folder = slug ? `${CLOUDINARY_FOLDER}/${slug}` : CLOUDINARY_FOLDER;

  try {
    const result = await uploadImage(file, folder);
    return Response.json({
      secure_url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (e) {
    console.error("Cloudinary upload failed:", e);
    return Response.json(
      { error: "تعذر رفع الصورة إلى التخزين السحابي. حاول مرة أخرى." },
      { status: 502 },
    );
  }
}
