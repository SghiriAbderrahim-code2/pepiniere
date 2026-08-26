import Link from "next/link";
import { Container } from "@/components/container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="font-heading text-6xl font-bold text-primary">404</p>
      <h1 className="font-heading text-2xl font-semibold text-foreground">
        الصفحة غير موجودة
      </h1>
      <p className="text-muted-foreground">
        ربما حُذفت هذه الصفحة أو تغيّر رابطها.
      </p>
      <Link
        href="/"
        className={cn(buttonVariants({ variant: "default" }), "gap-2")}
      >
        العودة إلى الرئيسية
      </Link>
    </Container>
  );
}
