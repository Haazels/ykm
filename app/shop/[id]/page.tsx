import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS } from "@/lib/products";
import { getProductServer } from "@/lib/services/products.server";
import ProductDetail from "@/components/shop/ProductDetail";
import Navbar from "@/components/Navbar";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: String(p.id) }));
}

// Allow IDs not in generateStaticParams (e.g. admin-added products) to be
// server-rendered on demand instead of returning 404/500.
export const dynamicParams = true;

// Force SSR for this route so admin-added product IDs are always
// resolved from Supabase at request time on the server.
export const dynamic = "force-dynamic";

// Looks the product up in the hardcoded seed list first (fast, no
// network call, covers the sample products), then falls back to
// Supabase for anything added or edited through the admin panel.
// Without this fallback, every admin-added product 404s here even
// though it exists and shows up fine in the shop grid.
async function findProduct(id: number) {
  const seedProduct = PRODUCTS.find((p) => p.id === id);
  if (seedProduct) return seedProduct;

  try {
    return await getProductServer(id);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await findProduct(Number(id));
  if (!product) return {};

  return {
    title: product.name,
    description: product.desc,
    openGraph: {
      title: product.name,
      description: product.desc,
      images: [{ url: product.img, width: 1200, height: 1200, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.desc,
      images: [product.img],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  // This is the build-time (or freshly-fetched) seed used for the
  // first paint. Once mounted, ProductDetail swaps in the live
  // version from ProductsContext (which reflects any admin edits/stock).
  const seedProduct = await findProduct(Number(id));

  if (!seedProduct) notFound();

  return (
    <>
      <Navbar />
      <ProductDetail initialProduct={seedProduct} />
    </>
  );
}
