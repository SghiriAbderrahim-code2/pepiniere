import type { MetadataRoute } from "next";
import { getVisibleProducts } from "@/lib/data/products";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://pepiniere-al-akhawayn.example";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getVisibleProducts();

  const urls: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/plants`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/contact`, changeFrequency: "monthly", priority: 0.5 },
  ];

  for (const p of products) {
    urls.push({
      url: `${BASE_URL}/plants/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : undefined,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  return urls;
}
