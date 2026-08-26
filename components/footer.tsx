import Link from "next/link";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { Container } from "@/components/container";
import { store } from "@/lib/store";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border bg-secondary/20">
      <Container className="py-14">
        <div className="flex flex-col items-center gap-8 text-center">
          <div>
            <p className="font-heading text-xl font-bold text-foreground">
              {store.name}
            </p>
            <p className="text-sm text-muted-foreground">{store.nameAr}</p>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            نباتات وزهور تضيف الحياة إلى مساحتك.
          </p>
          <nav
            aria-label="روابط التذييل"
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm"
          >
            <Link
              href="/"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              الرئيسية
            </Link>
            <Link
              href="/plants"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              النباتات
            </Link>
            <Link
              href="/contact"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              تواصل معنا
            </Link>
            {store.whatsapp ? (
              <a
                href={`https://wa.me/${store.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-[#25D366]"
              >
                <WhatsAppIcon className="size-4" />
                واتساب
              </a>
            ) : null}
            <a
              href={store.locationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Google Maps
            </a>
          </nav>
        </div>
        <p className="mt-10 text-center text-xs text-muted-foreground">
          © {year} {store.name}. جميع الحقوق محفوظة.
        </p>
      </Container>
    </footer>
  );
}
