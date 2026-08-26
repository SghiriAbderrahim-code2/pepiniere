"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AdminNav } from "@/components/admin-nav";
import { Reveal } from "@/components/reveal";

export function MobileAdminMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-3 md:hidden">
      <Link href="/admin" className="flex items-center gap-2 font-heading font-bold">
        <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Leaf className="size-4" />
        </span>
        لوحة التحكم
      </Link>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon-sm" aria-label="القائمة" />
          }
        >
          <Menu className="size-5" />
        </SheetTrigger>
        <SheetContent side="right" className="w-72 p-0">
          <SheetHeader className="border-b border-border">
            <SheetTitle>القائمة</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            <Reveal>
              <AdminNav onNavigate={() => setOpen(false)} />
            </Reveal>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
