"use client";

export type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
};

// Uploads a single file to the protected admin upload route.
// Throws an Error with an Arabic message on any failure (auth, validation,
// network, or Cloudinary unavailability). Never exposes secrets.
export async function uploadToCloudinary(
  file: File,
  slug?: string,
): Promise<CloudinaryUploadResult> {
  const body = new FormData();
  body.append("file", file);
  if (slug) body.append("slug", slug);

  let res: Response;
  try {
    res = await fetch("/api/admin/upload", {
      method: "POST",
      body,
    });
  } catch {
    throw new Error("تعذر الاتصال بالخادم. تحقق من اتصالك وحاول مرة أخرى.");
  }

  if (!res.ok) {
    let message = "تعذر رفع الصورة، حاول مرة أخرى.";
    try {
      const data = (await res.json()) as { error?: string };
      if (data?.error) message = data.error;
    } catch {
      // keep default message
    }
    throw new Error(message);
  }

  const data = (await res.json()) as CloudinaryUploadResult;
  if (!data?.secure_url || !data?.public_id) {
    throw new Error("استجابة غير صالحة من الخادم.");
  }
  return data;
}
