import Link from "next/link";
import { ArrowLeft, Leaf } from "lucide-react";
import { Container } from "@/components/container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { store } from "@/lib/store";
import {
  getCloudinarySrcSet,
  getCloudinaryUrl,
  isCloudinaryUrl,
  HERO_SIZES,
} from "@/lib/cloudinary-image";

const HERO_IMAGE_SRC =
  process.env.NEXT_PUBLIC_HERO_IMAGE_URL ?? "/hero-plants.jpg";

export function HomeHero() {
  const cloudinary = isCloudinaryUrl(HERO_IMAGE_SRC);
  const srcSet = cloudinary
    ? getCloudinarySrcSet(HERO_IMAGE_SRC, [640, 960, 1280, 1600, 1920])
    : undefined;
  const defaultSrc = cloudinary
    ? getCloudinaryUrl(HERO_IMAGE_SRC, { width: 1600 })
    : HERO_IMAGE_SRC;

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 start-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />
      <Container className="py-20 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <span
            className="reveal inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
            style={{ animationDelay: "0s" }}
          >
            <Leaf className="size-4 shrink-0" />
            <span className="flex flex-col items-start leading-tight text-start">
              <span>{store.name}</span>
              <span className="text-xs">{store.nameAr}</span>
            </span>
          </span>
          <h1
            className="reveal mx-auto mt-6 font-heading text-4xl font-bold leading-[1.1] text-foreground sm:text-6xl lg:text-7xl"
            style={{ animationDelay: "0.08s" }}
          >
            ازرع الجمال في مساحتك
          </h1>
        </div>

        <div
          className="reveal mt-12 lg:mt-16"
          style={{ animationDelay: "0.16s" }}
        >
          <div className="relative mx-auto max-w-6xl">
            <div
              aria-hidden
              className="absolute -inset-3 -z-10 rounded-[3rem] bg-secondary/50 sm:-inset-5"
            />
            <img
              src={defaultSrc}
              srcSet={srcSet ?? undefined}
              sizes={HERO_SIZES}
              alt="مجموعة من النباتات الخضراء في مشتل Pépinière Al Akhawayn"
              className="aspect-[4/3] w-full rounded-[2.5rem] object-cover sm:aspect-[16/10]"
            />
          </div>
        </div>

        <p
          className="reveal mx-auto mt-10 max-w-xl text-center text-base text-muted-foreground sm:text-lg"
          style={{ animationDelay: "0.24s" }}
        >
          استكشف مجموعتنا من النباتات
        </p>
        <div
          className="reveal mt-8 flex justify-center"
          style={{ animationDelay: "0.32s" }}
        >
          <Link
            href="/plants"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "gap-2",
            )}
          >
            استعرض النباتات
            <ArrowLeft className="size-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
