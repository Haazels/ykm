import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types";

const supabase = createClient();

function mapDatabaseProduct(row: any): Product {
  return {
    id: Number(row.id),
    name: row.name,
    cat: row.category,
    badge: row.badge ?? undefined,
    price: Number(row.price),
    old:
      row.old_price !== null &&
      row.old_price !== undefined
        ? Number(row.old_price)
        : undefined,
    img: row.image_url,
    thumb: row.thumbnail_url,
    desc: row.description,
    specs: Array.isArray(row.specs)
      ? row.specs
      : [],
    stock: Number(row.stock),
  };
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("getProducts failed:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw error;
  }

  return (data ?? []).map(mapDatabaseProduct);
}

export async function getProduct(
  id: number
): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("getProduct failed:", {
      id,
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw error;
  }

  return mapDatabaseProduct(data);
}

export async function createProduct(
  product: Omit<Product, "id">
): Promise<Product> {
  // Check whether an archived product with the
  // same name already exists.
  const { data: existing, error: existingError } =
    await supabase
      .from("products")
      .select("*")
      .ilike("name", product.name)
      .eq("is_active", false)
      .maybeSingle();

  if (existingError) {
    console.error(
      "Checking archived product failed:",
      existingError
    );
    throw existingError;
  }

  // Restore archived product if found.
  if (existing) {
    const { data, error } = await supabase
      .from("products")
      .update({
        category: product.cat,
        badge: product.badge ?? null,
        price: product.price,
        old_price: product.old ?? null,
        image_url: product.img,
        thumbnail_url: product.thumb,
        description: product.desc,
        specs: product.specs,
        stock: product.stock,
        is_active: true,
      })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) {
      console.error(
        "Restoring product failed:",
        {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        }
      );

      throw error;
    }

    return mapDatabaseProduct(data);
  }

  // Create a completely new product.
  const { data, error } = await supabase
    .from("products")
    .insert({
      name: product.name,
      category: product.cat,
      badge: product.badge ?? null,
      price: product.price,
      old_price: product.old ?? null,
      image_url: product.img,
      thumbnail_url: product.thumb,
      description: product.desc,
      specs: product.specs,
      stock: product.stock,
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    console.error(
      "Creating product failed:",
      {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      }
    );

    throw error;
  }

  return mapDatabaseProduct(data);
}

export async function updateProduct(
  id: number,
  patch: Partial<Product>
): Promise<Product> {
  const updateData: Record<string, unknown> = {};

  if (patch.name !== undefined) {
    updateData.name = patch.name;
  }

  if (patch.cat !== undefined) {
    updateData.category = patch.cat;
  }

  if (patch.badge !== undefined) {
    updateData.badge = patch.badge || null;
  }

  if (patch.price !== undefined) {
    updateData.price = patch.price;
  }

  if (patch.old !== undefined) {
    updateData.old_price = patch.old ?? null;
  }

  if (patch.img !== undefined) {
    updateData.image_url = patch.img;
  }

  if (patch.thumb !== undefined) {
    updateData.thumbnail_url = patch.thumb;
  }

  if (patch.desc !== undefined) {
    updateData.description = patch.desc;
  }

  if (patch.specs !== undefined) {
    updateData.specs = patch.specs;
  }

  if (patch.stock !== undefined) {
    updateData.stock = patch.stock;
  }

  if (Object.keys(updateData).length === 0) {
    throw new Error("No product fields were provided for update.");
  }

  const { data, error } = await supabase
    .from("products")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("updateProduct failed:", {
      id,
      updateData,
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw error;
  }

  return mapDatabaseProduct(data);
}

export async function archiveProduct(
  id: number
): Promise<void> {
  const { error } = await supabase
    .from("products")
    .update({
      is_active: false,
    })
    .eq("id", id);

  if (error) {
    console.error("archiveProduct failed:", {
      id,
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw error;
  }
}

export async function restoreProduct(
  id: number
): Promise<void> {
  const { error } = await supabase
    .from("products")
    .update({
      is_active: true,
    })
    .eq("id", id);

  if (error) {
    console.error("restoreProduct failed:", {
      id,
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw error;
  }
}