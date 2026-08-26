"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin route error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <p className="text-lg font-medium">حدث خطأ ما.</p>
      <p className="max-w-md text-sm text-muted-foreground">
        {error.message || "تعذر تحميل هذه الصفحة."}
      </p>
      <Button onClick={reset}>إعادة المحاولة</Button>
    </div>
  );
}
