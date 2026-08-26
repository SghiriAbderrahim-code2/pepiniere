"use client";

import { useEffect } from "react";
import { ErrorUI } from "@/components/error-ui";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="py-20">
      <ErrorUI
        title="حدث خطأ غير متوقع"
        description="تعذر تحميل هذه الصفحة. يمكنك المحاولة مرة أخرى."
      />
      <div className="mt-6 flex justify-center">
        <Button onClick={reset}>إعادة المحاولة</Button>
      </div>
    </div>
  );
}
