import type { Metadata } from "next";
import Link from "next/link";
import { Leaf } from "lucide-react";
import { requireAdmin } from "@/lib/auth/admin";
import { AdminNav } from "@/components/admin-nav";
import { MobileAdminMenu } from "@/components/admin-mobile-menu";

export const metadata: Metadata = {
  title: "لوحة التحكم",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="flex min-h-svh bg-background text-foreground">
      <aside className="hidden w-64 shrink-0 flex-col border-l border-border bg-muted/30 p-4 md:flex">
        <Link
          href="/admin"
          className="mb-6 flex items-center gap-2 font-heading text-lg font-bold"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Leaf className="size-5" />
          </span>
          لوحة التحكم
        </Link>
        <div className="flex-1">
          <AdminNav />
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          تم الدخول باسم {user.email}
        </p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <MobileAdminMenu />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
