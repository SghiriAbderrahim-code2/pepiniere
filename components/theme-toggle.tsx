"use client";

import { useTheme } from "@/components/theme-provider";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="hover-scale inline-flex">
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="تبديل الوضع الفاتح/الداكن"
        suppressHydrationWarning
        onClick={() => setTheme(isDark ? "light" : "dark")}
      >
        {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
      </Button>
    </div>
  );
}
