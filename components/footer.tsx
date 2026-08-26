import Link from "next/link";
import { Leaf, Phone, MapPin } from "lucide-react";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { Container } from "@/components/container";
import { store, storePhoneDigits } from "@/lib/store";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-border bg-secondary/30">
      <Container className="grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-heading text-lg font-bold text-foreground">
            <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Leaf className="size-4" />
            </span>
            <div className="flex flex-col leading-tight">
              <span>{store.name}</span>
              <span className="text-xs font-medium text-muted-foreground">
                {store.nameAr}
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {store.nameAr} — {store.activity} في {store.location}، يضيف الحياة
            والجمال إلى منزلك ومساحتك.
          </p>
        </div>

        <div>
          <h3 className="mb-3 font-heading text-sm font-semibold">روابط</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="transition-colors hover:text-foreground">
                الرئيسية
              </Link>
            </li>
            <li>
              <Link
                href="/plants"
                className="transition-colors hover:text-foreground"
              >
                النباتات
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="transition-colors hover:text-foreground"
              >
                تواصل معنا
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-heading text-sm font-semibold">تواصل</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {store.phone ? (
              <li>
                <a
                  href={`tel:${storePhoneDigits()}`}
                  className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
                >
                  <Phone className="size-4" />
                  {store.phone}
                </a>
              </li>
            ) : null}
            <li>
              <a
                href={store.locationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
              >
                <MapPin className="size-4" />
                عرض الموقع على Google Maps
              </a>
            </li>
            {store.whatsapp ? (
              <li>
                <a
                  href={`https://wa.me/${store.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
                >
                  <WhatsAppIcon className="size-4 text-[#25D366]" />
                  واتساب
                </a>
              </li>
            ) : null}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-heading text-sm font-semibold">نبذة</h3>
          <p className="text-sm text-muted-foreground">
            نباتات صحية، شحن آمن، ودعم نباتي من فريقنا.
          </p>
        </div>
      </Container>
      <div className="border-t border-border">
        <Container className="py-5 text-center text-sm text-muted-foreground">
          © {year} {store.name}. جميع الحقوق محفوظة.
        </Container>
      </div>
    </footer>
  );
}
