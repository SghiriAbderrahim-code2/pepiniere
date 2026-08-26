import type { Metadata } from "next";
import type { ComponentType } from "react";
import { Phone, Mail, MapPin, Map } from "lucide-react";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { Reveal } from "@/components/reveal";
import { Container } from "@/components/container";
import { store, storePhoneDigits } from "@/lib/store";

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
};

function ContactCard({
  icon: Icon,
  title,
  value,
  details,
  href,
}: ContactInfo) {
  const body = (
    <>
      <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="size-5" />
      </span>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="font-medium text-foreground">{value}</p>
        {details ? (
          <p className="text-xs text-muted-foreground">{details}</p>
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
        className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-muted"
      >
        {body}
      </a>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
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
      value: "تواصل معنا عبر واتساب",
      href: `https://wa.me/${store.whatsapp.replace(/\D/g, "")}`,
    });
  if (store.email)
    cards.push({
      icon: Mail,
      title: "البريد الإلكتروني",
      value: store.email,
      href: `mailto:${store.email}`,
    });
  cards.push({
    icon: Map,
    title: "Google Maps",
    value: "عرض الموقع على Google Maps",
    href: store.locationUrl,
  });

  return (
    <Container className="py-12 sm:py-16">
      <Reveal>
        <header className="mb-10 text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            تواصل معنا
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            نحن هنا لمساعدتك في اختيار النباتات المناسبة لمساحتك. تواصل معنا عبر
            الوسائل التالية.
          </p>
        </header>
      </Reveal>

      {cards.length > 0 ? (
        <Reveal>
          <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
            {cards.map((card, i) => (
              <ContactCard key={i} {...card} />
            ))}
          </div>
        </Reveal>
      ) : (
        <p className="text-center text-muted-foreground">
          لا توجد وسائل تواصل مُعرّفة حاليًا.
        </p>
      )}

      <div className="mt-10 flex justify-center">
        <WhatsAppButton label="راسلنا على واتساب" className="hover-scale" />
      </div>
    </Container>
  );
}
