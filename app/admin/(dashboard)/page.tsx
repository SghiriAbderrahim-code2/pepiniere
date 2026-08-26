import Link from "next/link";
import { Package, Eye, EyeOff } from "lucide-react";
import { requireAdmin } from "@/lib/auth/admin";
import {
  getAdminStats,
  getRecentProducts,
} from "@/lib/data/admin-products";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductImage } from "@/components/product-image";
import { Reveal } from "@/components/reveal";

export default async function AdminDashboardPage() {
  await requireAdmin();
  const [stats, recent] = await Promise.all([
    getAdminStats(),
    getRecentProducts(5),
  ]);

  const cards = [
    {
      label: "إجمالي النباتات",
      value: stats.total,
      icon: Package,
      tint: "text-primary",
    },
    {
      label: "ظاهرة",
      value: stats.visible,
      icon: Eye,
      tint: "text-emerald-600",
    },
    {
      label: "مخفية",
      value: stats.hidden,
      icon: EyeOff,
      tint: "text-muted-foreground",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold">لوحة التحكم</h1>
        <p className="text-muted-foreground">نظرة عامة على متجر النباتات.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Reveal key={card.label} delay={i * 0.08}>
              <Card>
                <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.label}
                  </CardTitle>
                  <Icon className={`size-5 ${card.tint}`} />
                </CardHeader>
                <CardContent>
                  <p className="font-heading text-3xl font-bold">{card.value}</p>
                </CardContent>
              </Card>
            </Reveal>
          );
        })}
      </div>

      <section className="space-y-3">
        <h2 className="font-heading text-lg font-semibold">
          أحدث النباتات المضافة
        </h2>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">لا توجد نباتات بعد.</p>
        ) : (
          <Reveal delay={0.2}>
            <ul className="divide-y divide-border rounded-xl border border-border bg-card">
              {recent.map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="flex items-center gap-3 p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="size-12 shrink-0 overflow-hidden rounded-md">
                      <ProductImage
                        src={product.main_image}
                        alt={product.name}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.visible ? "ظاهر" : "مخفي"} ·{" "}
                        {new Date(product.created_at).toLocaleDateString("ar-MA")}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </section>
    </div>
  );
}
