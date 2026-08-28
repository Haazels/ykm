import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types";

function mapDatabaseProduct(row: any): Product {
  return {
    id: Number(row.id),
    name: row.name,
    cat: row.category,
    badge: row.badge ?? undefined,
    price: Number(row.price),
    old:
      row.old_price !== null && row.old_price !== undefined
        ? Number(row.old_price)
        : undefined,
    img: row.image_url,
    thumb: row.thumbnail_url,
    desc: row.description,
    specs: Array.isArray(row.specs) ? row.specs : [],
    stock: Number(row.stock),
  };
}

/**
 * Server Component-safe product lookup (used by app/shop/[id]/page.tsx
 * for products added through the admin panel that aren't part of the
 * hardcoded seed list in lib/products.ts).
 */
export async function getProductServer(id: number): Promise<Product | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) return null;

  return mapDatabaseProduct(data);
}
