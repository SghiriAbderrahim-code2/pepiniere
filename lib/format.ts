export function formatPrice(price: number | null | undefined): string {
  if (price == null) return "على الطلب";
  return `${price} د.م`;
}
