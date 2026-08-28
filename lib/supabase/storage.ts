import { createClient } from "@/lib/supabase/client";
import { compressImage } from "@/lib/compressImage";

const supabase = createClient();

const BUCKET = "products";

/**
 * Upload a product image to Supabase Storage.
 * Returns the public URL of the uploaded image.
 */
export async function uploadProductImage(file: File) {
  const compressed = await compressImage(file);

  const extension = compressed.name.split(".").pop();

  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2)}.${extension}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, compressed);

  if (error) {
    throw error;
  }

  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(fileName);

  return data.publicUrl;
}

/**
 * Delete an image from Storage.
 */
export async function deleteProductImage(imageUrl: string) {
  const fileName = imageUrl.split("/").pop();

  if (!fileName) return;

  await supabase.storage
    .from(BUCKET)
    .remove([fileName]);
}