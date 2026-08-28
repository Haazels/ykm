"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import type { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { usePurchaseHistory } from "@/context/PurchaseHistoryContext";
import { useProducts } from "@/context/ProductsContext";
import ProductReviews from "@/components/shop/ProductReviews";
import ProductImage from "@/components/shop/ProductImage";

export default function ProductDetail({ initialProduct }: { initialProduct: Product }) {
  const { addToCart, openCart } = useCart();
  const { requireAuth } = useAuth();
  const { recordView } = usePurchaseHistory();
  const { getProduct } = useProducts();

  // Prefer the live copy (reflects admin edits/stock); fall back to the
  // build-time seed until the store hydrates from localStorage.
  const product = getProduct(initialProduct.id) ?? initialProduct;
  const outOfStock = product.stock <= 0;

  const [qty, setQty] = useState(1);

  useEffect(() => {
    recordView(product);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  useEffect(() => {
    setQty((q) => Math.min(q, Math.max(1, product.stock)));
  }, [product.stock]);

  const handleAddToCart = () => {
    addToCart(product, qty);
  };

  const handleBuyNow = () => {
    requireAuth(() => {
      addToCart(product, qty);
      openCart();
    });
  };

  return (
    <main className="mx-auto max-w-[1100px] px-5 pb-24 pt-24 md:px-8 md:pt-32">
      <Link
        href="/#shop"
        className="mb-6 inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-white"
      >
        <ArrowLeft size={14} />
        Back to shop
      </Link>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#111] md:sticky md:top-28"
        >
          <ProductImage
            src={product.img}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={`object-cover ${outOfStock ? "opacity-40 grayscale" : ""}`}
            priority
          />
          {product.badge && !outOfStock && (
            <div className="absolute left-4 top-4 rounded bg-accent px-2.5 py-1 text-[11px] font-bold tracking-[0.05em] text-black">
              {product.badge}
            </div>
          )}
          {outOfStock && (
            <div className="absolute left-4 top-4 rounded bg-[#333] px-2.5 py-1 text-[11px] font-bold tracking-[0.05em] text-white">
              OUT OF STOCK
            </div>
          )}
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          <div className="mb-3 text-xs uppercase tracking-[0.08em] text-muted">
            {product.cat}
          </div>
          <h1 className="mb-4 font-display text-[clamp(34px,6vw,52px)] leading-[1.05] tracking-[0.01em]">
            {product.name}
          </h1>
          <div className="mb-2 flex items-baseline gap-3">
            <span className="text-[30px] font-bold text-accent">
              &#8377;{product.price.toLocaleString("en-IN")}
            </span>
            {product.old && (
              <span className="text-base text-[#555] line-through">
                &#8377;{product.old.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          <div className="mb-6 text-xs">
            {outOfStock ? (
              <span className="font-semibold text-[#ff5555]">Out of stock</span>
            ) : product.stock <= 5 ? (
              <span className="font-semibold text-[#ffb300]">
                Only {product.stock} left in stock
              </span>
            ) : (
              <span className="text-muted">In stock &middot; {product.stock} available</span>
            )}
          </div>
          <p className="mb-8 max-w-[520px] text-[14px] leading-[1.85] text-[#bbb]">
            {product.desc}
          </p>

          {/* Specs */}
          <div className="mb-8">
            <h4 className="mb-3 text-xs uppercase tracking-[0.08em] text-muted">
              Specifications
            </h4>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {product.specs.map((s) => (
                <div key={s.l} className="rounded-lg bg-[#1a1a1a] px-3.5 py-3">
                  <div className="mb-0.5 text-[10px] uppercase tracking-[0.06em] text-muted">
                    {s.l}
                  </div>
                  <div className="text-[13px] font-semibold">{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Qty + actions */}
          <div className="mb-3 flex items-center gap-3.5">
            <label className="text-xs uppercase tracking-[0.06em] text-muted">Qty</label>
            <div className="flex items-center overflow-hidden rounded-lg border border-border">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={outOfStock}
                aria-label="Decrease quantity"
                className="flex h-10 w-10 items-center justify-center bg-[#1a1a1a] transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Minus size={14} />
              </button>
              <span className="flex w-12 items-center justify-center bg-[#111] text-sm font-semibold">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                disabled={outOfStock}
                aria-label="Increase quantity"
                className="flex h-10 w-10 items-center justify-center bg-[#1a1a1a] transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div className="mb-12 flex gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="flex-1 rounded-[10px] border border-border bg-[#1e1e1e] py-4 text-sm font-semibold transition-colors hover:border-[#444] hover:bg-[#2a2a2a] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Add to Cart
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={outOfStock}
              className="flex-[2] rounded-[10px] bg-accent py-4 text-sm font-bold text-black transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
            >
              {outOfStock ? "Out of Stock" : <>Buy Now &#8594;</>}
            </button>
          </div>

          {/* Reviews — this product's own review section, with photo upload + ratings */}
          <ProductReviews productId={product.id} />
        </motion.div>
      </div>
    </main>
  );
}
