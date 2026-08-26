"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Plus,
  EyeOff,
  ExternalLink,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
};

const LINKS: NavItem[] = [
  { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "المنتجات", icon: Package },
  { href: "/admin/products/new", label: "إضافة نبات", icon: Plus },
  { href: "/admin/products/hidden", label: "المنتجات المخفية", icon: EyeOff },
  { href: "/", label: "عرض الموقع", icon: ExternalLink },
];

export function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1" aria-label="تنقل لوحة التحكم">
      {LINKS.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-secondary text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {link.label}
          </Link>
        );
      })}

      <form action={logout} className="mt-4">
        <Button
          type="submit"
          variant="ghost"
          className="w-full justify-start gap-2"
        >
          <LogOut className="size-4" />
          تسجيل الخروج
        </Button>
      </form>
    </nav>
  );
}
