"use client";

import { useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initial = searchParams.get("search") ?? "";
  const [value, setValue] = useState(initial);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function pushSearch(raw: string) {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const trimmed = raw.trim();
      if (trimmed) params.set("search", trimmed);
      else params.delete("search");
      router.replace(`${pathname}?${params.toString()}`);
    }, 300);
  }

  return (
    <div className="relative">
      <Search
        className="pointer-events-none absolute top-1/2 start-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        type="search"
        value={value}
        onChange={(e) => {
          const next = e.target.value;
          setValue(next);
          pushSearch(next);
        }}
        placeholder="ابحث عن نبتة..."
        aria-label="بحث عن نبتة"
        className="ps-9"
      />
    </div>
  );
}
