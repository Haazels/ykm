import { createClient } from "@supabase/supabase-js";
import type { Product } from "@/types";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://aqllpyipitdeuffmozlk.supabase.co";
const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_mQQKqIIX_laUN2TgDiiVtw_NZCiwvEl";

// Lightweight anonymous client — no cookies() needed for a public product lookup.
// Using this avoids calling cookies() which throws during static generation
// (Next.js SSG), causing 500 errors on deployed /shop/[id] pages for
// admin-added products not in the hardcoded seed list.
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) return null;

  return mapDatabaseProduct(data);
}
