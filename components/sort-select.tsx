"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OPTIONS = [
  { value: "newest", label: "الأحدث" },
  { value: "name-asc", label: "الاسم: أ → ي" },
  { value: "name-desc", label: "الاسم: ي → أ" },
  { value: "price-asc", label: "السعر: من الأقل إلى الأعلى" },
  { value: "price-desc", label: "السعر: من الأعلى إلى الأقل" },
] as const;

export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") ?? "newest";

  function onChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <Select
      value={current}
      onValueChange={(value) => onChange(value as string)}
    >
      <SelectTrigger className="w-full sm:w-60" aria-label="ترتيب النتائج">
        <ArrowUpDown className="size-4 text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
