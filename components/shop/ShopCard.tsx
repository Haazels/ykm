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
      className="shop-card group relative overflow-hidden rounded-2xl border border-transparent bg-card transition-[box-shadow,border-color] duration-300 hover:border-accent hover:shadow-[0_18px_40px_rgba(255,215,0,0.15)]"
      initial={{ opacity: 0, scale: 0.93, y: 18 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -30px 0px" }}
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
        delay: (index % 4) * 0.08,
      }}
      whileHover={{ scale: 1.02, y: -4 }}
    >
      <Link href={`/shop/${product.id}`} aria-label={`View details for ${product.name}`}>
        <div className="relative aspect-square overflow-hidden bg-[#111]">
          <ProductImage
            src={product.thumb}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 300px"
            className={`object-cover transition-transform duration-500 group-hover:scale-[1.07] ${
              outOfStock ? "opacity-40 grayscale" : ""
            }`}
          />
          {product.badge && !outOfStock && (
            <div className="absolute left-2.5 top-2.5 rounded bg-accent px-2 py-0.5 text-[10px] font-bold tracking-[0.04em] text-black">
              {product.badge}
            </div>
          )}
          {outOfStock && (
            <div className="absolute left-2.5 top-2.5 rounded bg-[#333] px-2 py-0.5 text-[10px] font-bold tracking-[0.04em] text-white">
              OUT OF STOCK
            </div>
          )}
          {lowStock && (
            <div className="absolute left-2.5 top-2.5 rounded bg-[#ffb300] px-2 py-0.5 text-[10px] font-bold tracking-[0.04em] text-black">
              ONLY {product.stock} LEFT
            </div>
          )}
        </div>
        <div className="p-3.5 pb-[52px]">
          <div className="mb-2 text-[11px] uppercase tracking-[0.04em] text-muted">
            {product.cat}
          </div>
          <div className="mb-1 text-[13px] font-semibold">{product.name}</div>
          <div>
            <span className="text-[15px] font-bold text-accent">
              &#8377;{product.price.toLocaleString("en-IN")}
            </span>
            {product.old && (
              <span className="ml-1.5 text-[11px] text-[#555] line-through">
                &#8377;{product.old.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>
      </Link>
      <button
        type="button"
        disabled={outOfStock}
        onClick={() => addToCart(product, 1)}
        className={`absolute bottom-3.5 right-3.5 rounded-lg px-3.5 py-[7px] text-[11px] font-bold transition-[opacity,transform] ${
          outOfStock
            ? "cursor-not-allowed bg-[#333] text-[#777]"
            : "bg-accent text-black hover:scale-105 hover:opacity-85"
        }`}
      >
        {outOfStock ? "Sold Out" : "+ Cart"}
      </button>
    </motion.div>
  );
}
