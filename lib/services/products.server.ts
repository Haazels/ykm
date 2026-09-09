import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types";

function normalizeImagePath(url: any): string {
  if (typeof url !== "string" || !url.trim()) return "/images/koala.jpg";
  const trimmed = url.trim();
  if (trimmed.startsWith("/image/")) {
    return "/images/" + trimmed.slice(7);
  }
  if (trimmed.includes("1785837303729.jpeg")) {
    return "/images/koala.jpg";
  }
  return trimmed;
}

function mapDatabaseProduct(row: any): Product {
  const imgUrl = normalizeImagePath(row.image_url);
  const thumbUrl = row.thumbnail_url
    ? normalizeImagePath(row.thumbnail_url)
    : imgUrl;

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
    img: imgUrl,
    thumb: thumbUrl,
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
