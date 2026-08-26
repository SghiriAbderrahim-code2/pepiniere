"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { store } from "@/lib/store";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/plants", label: "النباتات" },
  { href: "/contact", label: "تواصل معنا" },
];

export function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav
        className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="التنقل الرئيسي"
      >
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 font-heading text-base font-bold text-foreground sm:text-lg"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Leaf className="size-5" />
          </span>
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate">{store.name}</span>
            <span className="hidden text-xs font-medium text-muted-foreground sm:block">
              {store.nameAr}
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive(link.href)
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {store.whatsapp ? (
            <a
              href={`https://wa.me/${store.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="تواصل عبر واتساب"
              className="hidden items-center justify-center rounded-full bg-[#25D366]/10 p-2 text-[#25D366] transition-colors hover:bg-[#25D366]/20 md:inline-flex"
            >
              <WhatsAppIcon className="size-5" />
            </a>
          ) : null}
          <ThemeToggle />
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="فتح القائمة"
                  />
                }
              >
                <Menu className="size-5" />
                <span className="sr-only">القائمة</span>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetHeader>
                  <SheetTitle>القائمة</SheetTitle>
                  <SheetDescription className="sr-only">
                    روابط التنقل في الموقع
                  </SheetDescription>
                </SheetHeader>
                  <div className="flex flex-col gap-1 p-4">
                    {LINKS.map((link) => (
                    <SheetClose
                      key={link.href}
                      nativeButton={false}
                      render={
                        <Link
                          href={link.href}
                          className={cn(
                            "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                            isActive(link.href)
                              ? "bg-secondary text-primary"
                              : "text-foreground hover:bg-muted",
                          )}
                        />
                      }
                    >
                      {link.label}
                    </SheetClose>
                  ))}
                    {store.whatsapp ? (
                      <SheetClose
                        nativeButton={false}
                        render={
                          <a
                            href={`https://wa.me/${store.whatsapp.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#25D366] transition-colors hover:bg-muted"
                          />
                        }
                      >
                        <WhatsAppIcon className="size-4" />
                        واتساب
                      </SheetClose>
                    ) : null}
                  </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
