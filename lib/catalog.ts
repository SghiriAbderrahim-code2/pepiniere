import type { Product, ProductSort } from "@/types/database.types";

const SORT_VALUES: ProductSort[] = [
  "newest",
  "name-asc",
  "name-desc",
  "price-asc",
  "price-desc",
];

export function isProductSort(value: string | undefined): value is ProductSort {
  return value != null && (SORT_VALUES as string[]).includes(value);
}

export function filterAndSortProducts(
  products: Product[],
  search?: string,
  sort?: string,
): Product[] {
  let list = products;

  const query = search?.trim().toLowerCase();
  if (query) {
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        (p.short_description?.toLowerCase().includes(query) ?? false) ||
        p.slug.toLowerCase().includes(query),
    );
  }

  const sortKey = isProductSort(sort) ? sort : "newest";
  const sorted = [...list];

  switch (sortKey) {
    case "name-asc":
      sorted.sort((a, b) => a.name.localeCompare(b.name, "ar"));
      break;
    case "name-desc":
      sorted.sort((a, b) => b.name.localeCompare(a.name, "ar"));
      break;
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "newest":
    default:
      sorted.sort((a, b) => {
        if (a.created_at < b.created_at) return 1;
        if (a.created_at > b.created_at) return -1;
        return 0;
      });
      break;
  }

  return sorted;
}
