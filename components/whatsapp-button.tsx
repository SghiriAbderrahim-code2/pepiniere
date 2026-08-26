import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function WhatsAppButton({
  productName,
  label = "تواصل عبر واتساب",
  floating = false,
  className,
}: {
  productName?: string;
  label?: string;
  floating?: boolean;
  className?: string;
}) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!number) return null;

  const text = productName
    ? `السلام عليكم، أريد الاستفسار عن نبتة ${productName}.`
    : "السلام عليكم، أريد الاستفسار عن نباتاتكم.";
  const href = `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={floating ? "تواصل معنا عبر واتساب" : undefined}
      aria-label={floating ? "تواصل معنا عبر واتساب" : undefined}
      className={cn(
        buttonVariants({ variant: "default" }),
        "gap-2",
        floating && "fixed bottom-4 start-4 z-40 rounded-full p-3 shadow-lg",
        className,
      )}
    >
      <WhatsAppIcon className={floating ? "size-6" : "size-5"} />
      {!floating && label}
    </a>
  );
}
