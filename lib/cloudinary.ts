import "server-only";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const CLOUDINARY_FOLDER = "plant-catalog/products";

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

export type UploadResult = { secure_url: string; public_id: string };

export async function uploadImage(
  file: File,
  folder = CLOUDINARY_FOLDER,
): Promise<UploadResult> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise<UploadResult>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        // Keep originals; optimization happens at delivery time (f_auto,q_auto).
        overwrite: false,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      },
    );
    uploadStream.end(buffer);
  });
}

export type DeleteResult = { ok: boolean; raw: string };

// Deletes a Cloudinary asset by public_id. Resolves with ok=false (instead of
// throwing) when the asset is missing so callers can decide how to handle it.
export async function deleteImage(publicId: string): Promise<DeleteResult> {
  const res = await cloudinary.uploader.destroy(publicId);
  const raw = typeof res?.result === "string" ? res.result : "unknown";
  return { ok: raw === "ok", raw };
}

// Recovers the Cloudinary public_id from a secure delivery URL.
// e.g. https://res.cloudinary.com/<cloud>/image/upload/v123/plant-catalog/products/x.jpg
//   -> plant-catalog/products/x
export function publicIdFromUrl(url?: string | null): string | null {
  if (!url) return null;
  const marker = "/image/upload/";
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  let rest = url.slice(idx + marker.length);
  rest = rest.replace(/^v\d+\//, "");
  rest = rest.replace(/\.[a-zA-Z0-9]+$/, "");
  return rest || null;
}

// Builds a delivery URL with automatic format + quality. Safe to expose.
export function optimizedUrl(publicId?: string | null): string | null {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  if (!publicId || !cloud) return null;
  return `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto/${publicId}`;
}

// Returns an optimized delivery URL for a stored Cloudinary URL, or the
// original value when it is not a Cloudinary URL (e.g. legacy/placeholder).
export function displayUrl(url?: string | null): string | null {
  if (!url) return null;
  const publicId = publicIdFromUrl(url);
  if (publicId) {
    const optimized = optimizedUrl(publicId);
    if (optimized) return optimized;
  }
  return url;
}
