"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { Product, ProductCategory } from "@/types";
import {
  getProducts as getProductsService,
  createProduct as createProductService,
  updateProduct as updateProductService,
  archiveProduct,
} from "@/lib/services/products";

interface ProductsContextValue {
  products: Product[];
  getProduct: (id: number) => Product | undefined;
  updateProduct: (
    id: number,
    patch: Partial<Product>
  ) => Promise<void>;
  decrementStock: (
    id: number,
    qty: number
  ) => Promise<void>;
  addProduct: (
    input: Omit<Product, "id">
  ) => Promise<number | null>;
  removeProduct: (id: number) => Promise<void>;
  isHydrated: boolean;
}

const ProductsContext =
  createContext<ProductsContextValue | null>(null);



/**
 * Convert a Supabase product row into the format
 * expected by the existing frontend.
 */
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

function mapSupabaseProduct(row: any): Product {
  const imgUrl = normalizeImagePath(row.image_url);
  const thumbUrl = row.thumbnail_url
    ? normalizeImagePath(row.thumbnail_url)
    : imgUrl;

  return {
    id: row.id,
    name: row.name,
    cat: row.category as ProductCategory,
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

export function ProductsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  /*
   * Load active products from Supabase.
   */
 const loadProducts = useCallback(async () => {
  setIsHydrated(false);

  try {
    const data = await getProductsService();
    setProducts(data);
  } catch (error) {
    console.error("Failed to load products:", error);
  } finally {
    setIsHydrated(true);
  }
}, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  /*
   * Find one product by ID.
   */
  const getProduct = useCallback(
    (id: number) => {
      return products.find(
        (product) => product.id === id
      );
    },
    [products]
  );

  /*
   * Update product fields in Supabase.
   */
 const updateProduct = useCallback(
  async (
    id: number,
    patch: Partial<Product>
  ): Promise<void> => {
    try {
      const updated = await updateProductService(id, patch);

      setProducts((prev) =>
        prev.map((product) =>
          product.id === id ? updated : product
        )
      );
    } catch (error) {
      console.error("Failed to update product:", error);
      throw error;
    }
  },
  []
);

  /*
   * Decrease stock in Supabase.
   */
 const decrementStock = useCallback(
  async (id: number, qty: number): Promise<void> => {
    console.log("DECREMENT STOCK CALLED:", {
      productId: id,
      quantity: qty,
    });

    const product = products.find(
      (item) => item.id === id
    );

    if (!product) {
      console.error(
        "PRODUCT NOT FOUND IN PRODUCTS CONTEXT:",
        id
      );
      return;
    }

    console.log("CURRENT PRODUCT STOCK:", {
      productId: product.id,
      productName: product.name,
      currentStock: product.stock,
    });

    const newStock = Math.max(
      0,
      product.stock - qty
    );

    console.log("NEW STOCK SHOULD BE:", newStock);

    await updateProduct(id, {
      stock: newStock,
    });

    console.log("STOCK UPDATE COMPLETED:", {
      productId: id,
      newStock,
    });
  },
  [products, updateProduct]
);
  /*
   * Add a new product to Supabase.
   */
  const addProduct = useCallback(
  async (
    input: Omit<Product, "id">
  ): Promise<number | null> => {
    try {
      const product =
        await createProductService(input);

      setProducts((prev) => [
        ...prev,
        product,
      ]);

      return product.id;
    } catch (error) {
      console.error("Failed to add product:", error);
      return null;
    }
  },
  []
);

  /*
   * Soft-delete a product by making it inactive.
   */
 const removeProduct = useCallback(
  async (id: number): Promise<void> => {
    try {
      await archiveProduct(id);

      setProducts((prev) =>
        prev.filter((product) => product.id !== id)
      );
    } catch (error) {
      console.error("Failed to archive product:", error);
      throw error;
    }
  },
  []
);

  return (
    <ProductsContext.Provider
      value={{
        products,
        getProduct,
        updateProduct,
        decrementStock,
        addProduct,
        removeProduct,
        isHydrated,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);

  if (!context) {
    throw new Error(
      "useProducts must be used within ProductsProvider"
    );
  }

  return context;
}