"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Wand2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/admin/image-upload";
import type { Product } from "@/types/database.types";
import type { ProductActionState } from "@/app/admin/actions/products";

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}_-]+/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const textareaClass =
  "min-h-[96px] w-full resize-y rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30";

export function ProductForm({
  action,
  initial,
  submitLabel,
  mode,
}: {
  action: (prev: ProductActionState, formData: FormData) => Promise<ProductActionState>;
  initial?: Product | null;
  submitLabel: string;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, {});
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [price, setPrice] = useState(
    initial?.price != null ? String(initial.price) : "",
  );
  const [mainImage, setMainImage] = useState<string | null>(
    initial?.main_image ?? null,
  );

  useEffect(() => {
    if (state.success) {
      toast.success(
        mode === "create"
          ? "تمت إضافة النبات بنجاح"
          : "تم تحديث النبات بنجاح",
      );
      router.push("/admin/products");
      router.refresh();
    }
  }, [state.success, mode, router]);

  const fe = state.fieldErrors;
  const err = (key: string) => fe?.[key]?.[0];

  return (
    <form action={formAction} className="space-y-8">
      {state.error && (
        <p
          role="alert"
          className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {state.error}
        </p>
      )}

      <section className="space-y-4 rounded-xl border border-border bg-card p-4 sm:p-6">
        <h2 className="font-heading text-lg font-semibold">المعلومات الأساسية</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">الاسم</Label>
            <Input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!err("name")}
              required
            />
            {err("name") && (
              <p className="text-xs text-destructive">{err("name")}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="slug">الرابط (slug)</Label>
            <div className="flex gap-2">
              <Input
                id="slug"
                name="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                aria-invalid={!!err("slug")}
                required
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const nameInput = document.getElementById(
                    "name",
                  ) as HTMLInputElement | null;
                  if (nameInput) setSlug(slugify(nameInput.value));
                }}
                title="توليد من الاسم"
              >
                <Wand2 className="size-4" />
                توليد
              </Button>
            </div>
            {err("slug") && (
              <p className="text-xs text-destructive">{err("slug")}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="price">السعر (درهم)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              aria-invalid={!!err("price")}
              required
            />
            {err("price") && (
              <p className="text-xs text-destructive">{err("price")}</p>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <ImageUpload
              value={mainImage}
              onChange={setMainImage}
              slug={initial?.slug}
            />
            <input type="hidden" name="main_image" value={mainImage ?? ""} />
            {err("main_image") && (
              <p className="text-xs text-destructive">{err("main_image")}</p>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-card p-4 sm:p-6">
        <h2 className="font-heading text-lg font-semibold">الوصف</h2>
        <div className="flex flex-col gap-2">
          <Label htmlFor="short_description">وصف قصير</Label>
          <textarea
            id="short_description"
            name="short_description"
            className={textareaClass}
            defaultValue={initial?.short_description ?? ""}
          />
          {err("short_description") && (
            <p className="text-xs text-destructive">
              {err("short_description")}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="description">وصف تفصيلي</Label>
          <textarea
            id="description"
            name="description"
            className={textareaClass}
            defaultValue={initial?.description ?? ""}
          />
          {err("description") && (
            <p className="text-xs text-destructive">{err("description")}</p>
          )}
        </div>
      </section>

      <section className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 sm:p-6">
        <input
          type="checkbox"
          id="visible"
          name="visible"
          value="on"
          defaultChecked={initial ? initial.visible : true}
          className="size-4 accent-[var(--primary)]"
        />
        <Label htmlFor="visible" className="cursor-pointer">
          ظاهر في المتجر
        </Label>
      </section>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="size-4 animate-spin" />}
          {submitLabel}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
        >
          إلغاء
        </Button>
      </div>
    </form>
  );
}
