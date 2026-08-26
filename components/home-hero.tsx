import Link from "next/link";
import { ArrowLeft, Leaf } from "lucide-react";
import { Container } from "@/components/container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { store } from "@/lib/store";

const HERO_IMAGE_SRC =
  process.env.NEXT_PUBLIC_HERO_IMAGE_URL ?? "/hero-plants.jpg";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-linear-to-b from-secondary/70 via-background to-background">
      <Leaf
        className="pointer-events-none absolute -top-10 start-[-2.5rem] size-48 text-primary/5"
        aria-hidden
      />
      <Leaf
        className="pointer-events-none absolute -bottom-16 end-[-2.5rem] size-64 text-light-green/10"
        aria-hidden
      />
      <Container className="relative py-20 text-center sm:py-28">
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
          className="reveal mx-auto mt-6 max-w-3xl font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl md:text-6xl"
          style={{ animationDelay: "0.08s" }}
        >
          ازرع الجمال في مساحتك
        </h1>
        <div
          className="reveal mx-auto mt-10 w-full max-w-5xl sm:mt-14"
          style={{ animationDelay: "0.16s" }}
        >
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm">
            <img
              src={HERO_IMAGE_SRC}
              alt="مجموعة من النباتات الخضراء لتزيين المنزل"
              className="aspect-[16/9] w-full object-cover sm:aspect-[21/9]"
            />
          </div>
        </div>
        <p
          className="reveal mx-auto mt-8 max-w-xl text-base text-muted-foreground sm:text-lg"
          style={{ animationDelay: "0.24s" }}
        >
          استكشف مجموعتنا من النباتات
        </p>
        <div className="reveal mt-8 flex justify-center" style={{ animationDelay: "0.32s" }}>
          <Link
            href="/plants"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "hover-scale gap-2",
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
