"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import ProductImage from "@/components/shop/ProductImage";

export default function ShopCard({ product, index }: { product: Product; index: number }) {
  const { addToCart } = useCart();
  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= 5;

  return (
    <motion.div
      className="shop-card group relative overflow-hidden rounded-xl border border-white/10 bg-[#0d0d0f] transition-all duration-300 hover:border-accent/60 hover:shadow-[0_12px_35px_rgba(255,215,0,0.12)]"
      initial={{ opacity: 0, scale: 0.94, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -30px 0px" }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        delay: (index % 3) * 0.08,
      }}
      whileHover={{ y: -6 }}
    >
      <Link
        href={`/shop/${product.id}`}
        aria-label={`View details for ${product.name}`}
        className="block relative aspect-[3/4] w-full overflow-hidden"
      >
        {/* Corner Tech Brackets (matching image 2 styling) */}
        <div className="absolute top-2.5 left-2.5 w-2.5 h-2.5 border-t-2 border-l-2 border-white/30 z-20 pointer-events-none group-hover:border-accent transition-colors" />
        <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 border-t-2 border-r-2 border-white/30 z-20 pointer-events-none group-hover:border-accent transition-colors" />

        {/* Tech Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] z-10 pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity" />

        {/* Product Image */}
        <ProductImage
          src={product.thumb}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover transition-transform duration-700 ease-out group-hover:scale-108 ${
            outOfStock ? "opacity-30 grayscale" : ""
          }`}
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5">
          {product.badge && !outOfStock && (
            <span className="rounded bg-accent px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-black shadow-md">
              {product.badge}
            </span>
          )}
          {outOfStock && (
            <span className="rounded bg-red-900/80 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white border border-red-500/30">
              OUT OF STOCK
            </span>
          )}
          {lowStock && (
            <span className="rounded bg-amber-500/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-black">
              ONLY {product.stock} LEFT
            </span>
          )}
        </div>

        {/* Dark Glassmorphism Bottom Panel Overlay */}
        <div className="absolute inset-x-0 bottom-0 z-20 p-4 bg-gradient-to-t from-black via-black/85 to-transparent backdrop-blur-[6px] border-t border-white/10 flex flex-col gap-2">
          {/* Top Row: Name & Price */}
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-base md:text-lg font-black tracking-tight text-white group-hover:text-accent transition-colors truncate">
              {product.name}
            </h3>
            <div className="flex items-baseline gap-1.5 shrink-0">
              <span className="text-base md:text-lg font-extrabold text-accent">
                &#8377;{product.price.toLocaleString("en-IN")}
              </span>
              {product.old && (
                <span className="text-xs text-white/40 line-through">
                  &#8377;{product.old.toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>

          {/* Bottom Row: Category & Action Button */}
          <div className="flex items-center justify-between pt-0.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
              {product.cat}
            </span>

            {/* Arrow / Quick Add Button */}
            <button
              type="button"
              disabled={outOfStock}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!outOfStock) addToCart(product, 1);
              }}
              title={outOfStock ? "Sold Out" : "Add to Cart"}
              className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-all duration-300 ${
                outOfStock
                  ? "border-white/10 bg-white/5 text-white/30 cursor-not-allowed"
                  : "border-white/20 bg-white/10 text-white group-hover:bg-accent group-hover:border-accent group-hover:text-black group-hover:scale-105"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
