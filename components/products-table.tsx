"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Pencil, Eye, EyeOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { ProductImage } from "@/components/product-image";
import type { Product } from "@/types/database.types";
import {
  deleteProduct,
  setProductVisibility,
} from "@/app/admin/actions/products";

function formatPrice(n: number) {
  return `${n.toFixed(2)} درهم`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("ar-MA");
}

function RowActions({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function toggleVisibility() {
    try {
      await setProductVisibility(product.id, !product.visible);
      toast.success(product.visible ? "تم إخفاء النبات" : "تم إظهار النبات");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "تعذر تحديث الحالة");
    }
  }

  async function onDelete() {
    setBusy(true);
    try {
      await deleteProduct(product.id);
      toast.success("تم حذف النبات");
      setOpen(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "تعذر حذف النبات");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        nativeButton={false}
        render={
          <Link href={`/admin/products/${product.id}/edit`} />
        }
        variant="ghost"
        size="icon-sm"
        aria-label="تعديل"
      >
        <Pencil className="size-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={product.visible ? "إخفاء" : "إظهار"}
        onClick={toggleVisibility}
      >
        {product.visible ? (
          <EyeOff className="size-4" />
        ) : (
          <Eye className="size-4" />
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="حذف"
              className="text-destructive"
            />
          }
        >
          <Trash2 className="size-4" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>حذف النبات</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              إلغاء
            </DialogClose>
            <Button variant="destructive" onClick={onDelete} disabled={busy}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function VisibilityBadge({ visible }: { visible: boolean }) {
  return (
    <span
      className={
        visible
          ? "inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
          : "inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
      }
    >
      {visible ? "ظاهر" : "مخفي"}
    </span>
  );
}

export function ProductsTable({ products }: { products: Product[] }) {
  return (
    <>
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الصورة</TableHead>
              <TableHead>الاسم</TableHead>
              <TableHead>السعر</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>تاريخ الإضافة</TableHead>
              <TableHead className="text-end">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="size-12 overflow-hidden rounded-md">
                    <ProductImage
                      src={product.main_image}
                      alt={product.name}
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{formatPrice(product.price)}</TableCell>
                <TableCell>
                  <VisibilityBadge visible={product.visible} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(product.created_at)}
                </TableCell>
                <TableCell className="text-end">
                  <RowActions product={product} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-3 md:hidden">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
          >
            <div className="size-16 shrink-0 overflow-hidden rounded-md">
              <ProductImage src={product.main_image} alt={product.name} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate font-medium">{product.name}</p>
                <VisibilityBadge visible={product.visible} />
              </div>
              <p className="text-sm text-muted-foreground">
                {formatPrice(product.price)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(product.created_at)}
              </p>
            </div>
            <RowActions product={product} />
          </div>
        ))}
      </div>
    </>
  );
}
