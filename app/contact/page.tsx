import type { Metadata } from "next";
import type { ComponentType } from "react";
import { Phone, MapPin, Map } from "lucide-react";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { Reveal } from "@/components/reveal";
import { Container } from "@/components/container";
import { store, storePhoneDigits } from "@/lib/store";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "تواصل معنا",
  description: `تواصل مع فريق ${store.name} (${store.nameAr}) عبر واتساب أو الهاتف أو البريد الإلكتروني.`,
};

type ContactInfo = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  value: string;
  details?: string;
  href?: string;
  iconClassName?: string;
};

function ContactCard({
  icon: Icon,
  title,
  value,
  details,
  href,
  iconClassName,
}: ContactInfo) {
  const body = (
    <>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className={cn("size-5", iconClassName)} />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="font-medium text-foreground">{value}</p>
        {details ? (
          <p className="truncate text-xs text-muted-foreground">{details}</p>
        ) : null}
      </div>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card/60 p-4 transition-colors hover:border-primary/40"
      >
        {body}
      </a>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card/60 p-4">
      {body}
    </div>
  );
}

export default function ContactPage() {
  const cards: ContactInfo[] = [];
  if (store.location)
    cards.push({
      icon: MapPin,
      title: "الموقع",
      value: store.location,
      details: store.locationDetails,
      href: store.locationUrl,
    });
  if (store.phone)
    cards.push({
      icon: Phone,
      title: "الهاتف",
      value: store.phone,
      href: `tel:${storePhoneDigits()}`,
    });
  if (store.whatsapp)
    cards.push({
      icon: WhatsAppIcon,
      title: "واتساب",
      value: "تواصل عبر واتساب",
      href: `https://wa.me/${store.whatsapp.replace(/\D/g, "")}`,
      iconClassName: "text-[#25D366]",
    });
  cards.push({
    icon: Map,
    title: "Google Maps",
    value: "عرض الموقع على Google Maps",
    href: store.locationUrl,
  });

  return (
    <Container className="py-16 sm:py-24">
      <Reveal>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-heading text-4xl font-bold text-foreground sm:text-5xl">
            {store.name}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">{store.nameAr}</p>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            نحن هنا لمساعدتك في اختيار النباتات المناسبة لمساحتك. تواصل معنا عبر
            الوسائل التالية.
          </p>
          {store.email ? (
            <p className="mt-2 text-sm text-muted-foreground">
              أو راسلنا على البريد الإلكتروني: {store.email}
            </p>
          ) : null}
        </div>
      </Reveal>

      {cards.length > 0 ? (
        <Reveal className="mt-12">
          <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
            {cards.map((card, i) => (
              <ContactCard key={i} {...card} />
            ))}
          </div>
        </Reveal>
      ) : (
        <p className="mt-12 text-center text-muted-foreground">
          لا توجد وسائل تواصل مُعرّفة حاليًا.
        </p>
      )}

      <div className="mt-10 flex justify-center">
        <WhatsAppButton label="راسلنا على واتساب" className="hover-scale" />
      </div>
    </Container>
  );
}
