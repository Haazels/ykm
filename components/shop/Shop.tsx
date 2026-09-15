"use client";

import { useMemo, useState } from "react";
import { SHOP_CATEGORIES } from "@/lib/products";
import type { Product } from "@/types";
import SectionHeader from "@/components/SectionHeader";
import ShopCard from "@/components/shop/ShopCard";
import { useProducts } from "@/context/ProductsContext";

type CategoryFilter = "all" | Product["cat"];

export default function Shop() {
  const [activeCat, setActiveCat] = useState<CategoryFilter>("all");
  const { products } = useProducts();

  const items = useMemo(
    () => (activeCat === "all" ? products : products.filter((p) => p.cat === activeCat)),
    [activeCat, products]
  );

  return (
    <section id="shop">
      <SectionHeader
        title="Innovation Shop"
        description="Advanced electronics, futuristic gadgets, and engineering-driven creations — precision engineered for you."
      />

      <div className="flex flex-wrap justify-center gap-2 px-4 pb-8">
        {SHOP_CATEGORIES.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => setActiveCat(c.value)}
            className={`rounded-full border px-5 py-2 text-xs tracking-[0.06em] transition-all ${
              activeCat === c.value
                ? "border-accent bg-accent font-bold text-black"
                : "border-border bg-transparent text-muted hover:border-accent hover:bg-accent hover:font-bold hover:text-black"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mx-auto grid max-w-[1200px] grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 px-4 pb-20">
        {items.map((product, i) => (
          <ShopCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </section>
  );
}
