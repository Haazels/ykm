"use client";

import { useState } from "react";
import ProductImage from "@/components/shop/ProductImage";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { useProducts } from "@/context/ProductsContext";
import { useToast } from "@/context/ToastContext";
import type { Product } from "@/types";
import AdminProductEditor from "@/components/admin/AdminProductEditor";

export default function AdminProductsPanel() {
  const { products, removeProduct } = useProducts();
  const { showToast } = useToast();

  const [editing, setEditing] =
    useState<Product | null>(null);

  const [creating, setCreating] =
    useState(false);

  const [confirmingDeleteId, setConfirmingDeleteId] =
    useState<number | null>(null);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const handleDelete = async (product: Product) => {
    if (confirmingDeleteId !== product.id) {
      setConfirmingDeleteId(product.id);
      return;
    }

    setIsDeleting(true);

    try {
      await removeProduct(product.id);

      setConfirmingDeleteId(null);

      showToast(
        `${product.name} removed from shop`
      );
    } catch {
      showToast(
        "Failed to remove product. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setCreating(true)}
        className="mb-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#333] py-3.5 text-sm font-semibold text-muted transition-colors hover:border-accent hover:text-accent"
      >
        <Plus size={16} />

        Add New Product
      </button>

      <div className="flex flex-col gap-3">
        {products.map((product) => {
          const outOfStock = product.stock <= 0;

          const confirmingThis =
            confirmingDeleteId === product.id;

          return (
            <div
              key={product.id}
              className="flex items-center gap-3.5 rounded-xl border border-[#222] bg-[#161616] p-3.5"
            >
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-[#111]">
                <ProductImage
                  src={product.thumb}
                  alt={product.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">
                  {product.name}
                </div>

                <div className="mt-0.5 text-[11px] uppercase tracking-[0.04em] text-muted">
                  {product.cat}
                </div>

                <div className="mt-1 flex items-center gap-3 text-xs">
                  <span className="font-bold text-accent">
                    &#8377;
                    {product.price.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                  <span
                    className={
                      outOfStock
                        ? "font-semibold text-[#ff5555]"
                        : "text-muted"
                    }
                  >
                    {outOfStock
                      ? "Out of stock"
                      : `${product.stock} in stock`}
                  </span>
                </div>
              </div>

              <div className="flex flex-shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setEditing(product)
                  }
                  aria-label={`Edit ${product.name}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#333] transition-colors hover:border-accent hover:text-accent"
                >
                  <Pencil size={14} />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(product)
                  }
                  onBlur={() =>
                    setConfirmingDeleteId(null)
                  }
                  disabled={
                    isDeleting &&
                    confirmingThis
                  }
                  aria-label={
                    confirmingThis
                      ? `Confirm remove ${product.name}`
                      : `Remove ${product.name}`
                  }
                  className={`flex h-9 items-center justify-center rounded-full border px-3 text-[11px] font-semibold transition-colors ${
                    confirmingThis
                      ? "border-[#ff5555] bg-[#ff5555]/10 text-[#ff5555]"
                      : "w-9 border-[#333] text-muted hover:border-[#ff5555] hover:text-[#ff5555]"
                  }`}
                >
                  {confirmingThis ? (
                    isDeleting ? (
                      "Removing..."
                    ) : (
                      "Confirm?"
                    )
                  ) : (
                    <Trash2 size={14} />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {editing && (
        <AdminProductEditor
          product={
            products.find(
              (product) =>
                product.id === editing.id
            ) ?? editing
          }
          onClose={() => setEditing(null)}
        />
      )}

      {creating && (
        <AdminProductEditor
          product={null}
          onClose={() => setCreating(false)}
        />
      )}
    </div>
  );
}