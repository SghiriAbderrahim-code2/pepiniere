export function ErrorUI({
  title = "تعذر تحميل البيانات",
  description = "حدث خطأ أثناء الاتصال بقاعدة البيانات. يرجى المحاولة مرة أخرى لاحقًا.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 rounded-xl border border-destructive/40 bg-destructive/5 px-6 py-16 text-center"
    >
      <h3 className="font-heading text-lg font-semibold text-foreground">
        {title}
      </h3>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
