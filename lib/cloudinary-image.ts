// Client-safe Cloudinary delivery URL helpers.
// IMPORTANT: this module must never import the Cloudinary SDK or any API
// credentials. It only builds public delivery URLs from already-public URLs,
// so it is safe to use in Client Components and Server Components alike.

const CLOUDINARY_HOST = "res.cloudinary.com";

// Master set of widths used to build responsive srcsets.
export const RESPONSIVE_WIDTHS = [
  320, 400, 480, 640, 768, 960, 1200, 1440, 1600, 1920,
] as const;

// Smaller sets tuned to the real displayed size of each surface.
export const THUMBNAIL_WIDTHS = [120, 160, 200, 240] as const;
export const CARD_WIDTHS = [320, 400, 480, 640, 768, 960, 1280] as const;
export const MAIN_WIDTHS = [
  320, 480, 640, 768, 960, 1200, 1440, 1600, 1920,
] as const;

// `sizes` tuned to the actual rendered width of each surface (see grid
// breakpoints in product-grid.tsx and the layout in page.tsx).
export const PRODUCT_CARD_SIZES = [
  "(max-width: 429px) calc((100vw - 2rem - 1rem) / 2)",
  "(min-width: 430px) and (max-width: 639px) calc((100vw - 2rem - 2rem) / 3)",
  "(min-width: 640px) and (max-width: 767px) calc((100vw - 3rem - 2.5rem) / 3)",
  "(min-width: 768px) and (max-width: 1023px) calc((100vw - 3rem - 3.75rem) / 4)",
  "(min-width: 1024px) and (max-width: 1279px) calc((100vw - 4rem - 5rem) / 5)",
  "(min-width: 1280px) and (max-width: 1535px) calc((80rem - 4rem - 5rem) / 5)",
  "(min-width: 1536px) calc((80rem - 4rem - 6.25rem) / 6)",
].join(", ");

export const PRODUCT_MAIN_SIZES = [
  "(max-width: 639px) calc(100vw - 2rem)",
  "(max-width: 1023px) calc(100vw - 3rem)",
  "(max-width: 1279px) calc((100vw - 6rem) / 2)",
  "(min-width: 1280px) calc((80rem - 6rem) / 2)",
].join(", ");

export const HERO_SIZES = [
  "(max-width: 1023px) calc(100vw - 2rem)",
  "(min-width: 1024px) min(100vw - 4rem, 64rem)",
].join(", ");

export function isCloudinaryUrl(url?: string | null): boolean {
  if (!url) return false;
  return (
    url.includes(`/${CLOUDINARY_HOST}/`) && url.includes("/image/upload/")
  );
}

function cloudNameFromUrl(url: string): string | null {
  const parts = url.split("/");
  const idx = parts.indexOf(CLOUDINARY_HOST);
  if (idx === -1) return null;
  return parts[idx + 1] ?? null;
}

function publicIdFromUrl(url: string): string | null {
  const marker = "/image/upload/";
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  let rest = url.slice(idx + marker.length);
  // Drop a leading version segment (v123/).
  rest = rest.replace(/^v\d+\//, "");
  // Drop a leading transformation segment (f_auto,q_auto or c_limit,w_400...).
  const firstSeg = rest.split("/")[0];
  if (firstSeg && (firstSeg.includes(",") || /^[a-z]+_[a-zA-Z0-9]+(,[a-z]+_[a-zA-Z0-9]+)*$/.test(firstSeg))) {
    rest = rest.slice(firstSeg.length + 1);
  }
  // Drop the file extension (delivery infers format via f_auto).
  rest = rest.replace(/\.[a-zA-Z0-9]+$/, "");
  return rest || null;
}

// Build a width-based, auto format/quality Cloudinary delivery URL.
// Uses c_limit so Cloudinary never upscales beyond the source image.
// Non-Cloudinary URLs are returned unchanged.
export function getCloudinaryUrl(
  url: string,
  opts: { width: number; quality?: "auto" | number; format?: "auto" | string } = {
    width: 0,
  },
): string {
  if (!isCloudinaryUrl(url) || opts.width <= 0) return url;
  const cloud = cloudNameFromUrl(url);
  const publicId = publicIdFromUrl(url);
  if (!cloud || !publicId) return url;
  const q = opts.quality ?? "auto";
  const f = opts.format ?? "auto";
  return `https://${CLOUDINARY_HOST}/${cloud}/image/upload/f_${f},q_${q},c_limit,w_${opts.width}/${publicId}`;
}

// Build a responsive srcset string for a Cloudinary URL.
// Returns null for non-Cloudinary URLs so callers can skip srcset entirely.
export function getCloudinarySrcSet(
  url: string,
  widths: readonly number[] = RESPONSIVE_WIDTHS,
): string | null {
  if (!isCloudinaryUrl(url)) return null;
  return widths
    .map((w) => `${getCloudinaryUrl(url, { width: w })} ${w}w`)
    .join(", ");
}
