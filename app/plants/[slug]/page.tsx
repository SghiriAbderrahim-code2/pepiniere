import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getProductBySlug, getProductImages } from "@/lib/data/products";
import { ProductGallery } from "@/components/product-gallery";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { Reveal } from "@/components/reveal";
import { Container } from "@/components/container";
import { formatPrice } from "@/lib/format";
import { store } from "@/lib/store";
import type { Product, ProductImage } from "@/types/database.types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProductBySlug(slug);
    if (!product) return { title: "النبتة غير موجودة" };
    return {
      title: product.name,
      description:
        product.short_description ?? `تسوّق ${product.name} من ${store.name}.`,
      openGraph: {
        title: product.name,
        description: product.short_description ?? undefined,
        images: product.main_image ? [product.main_image] : undefined,
      },
    };
  } catch {
    return { title: "خطأ في تحميل المنتج" };
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let product: Product | null = null;
  try {
    product = await getProductBySlug(slug);
  } catch {
    notFound();
  }
  if (!product) notFound();

  let images: ProductImage[] = [];
  try {
    images = await getProductImages(product.id);
  } catch {
    images = [];
  }

  return (
    <Container className="py-10 sm:py-16">
      <nav
        aria-label="مسار التنقل"
        className="mb-8 flex items-center gap-1 text-sm text-muted-foreground"
      >
        <Link href="/" className="transition-colors hover:text-foreground">
          الرئيسية
        </Link>
        <ChevronLeft className="size-4" />
        <Link href="/plants" className="transition-colors hover:text-foreground">
          النباتات
        </Link>
        <ChevronLeft className="size-4" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal className="min-w-0">
          <ProductGallery mainImage={product.main_image} images={images} />
        </Reveal>
        <Reveal delay={0.1} className="flex flex-col gap-6">
          <div>
            <h1 className="font-heading text-4xl font-bold leading-tight text-foreground">
              {product.name}
            </h1>
            <p className="mt-3 text-3xl font-semibold text-primary">
              {formatPrice(product.price)}
            </p>
          </div>
          {product.short_description ? (
            <p className="text-lg text-muted-foreground">
              {product.short_description}
            </p>
          ) : null}
          {product.description ? (
            <p className="leading-relaxed text-foreground/90">
              {product.description}
            </p>
          ) : null}
          <div className="pt-2">
            <WhatsAppButton
              productName={product.name}
              className="hover-scale"
            />
          </div>
        </Reveal>
      </div>
    </Container>
  );
}
