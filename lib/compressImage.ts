/**
 * Shrinks an image in the browser before it's uploaded, so product
 * photos straight off a phone camera (often 4-8MB) don't get stored
 * — and re-downloaded by every visitor — at full size.
 *
 * Resizes to a max dimension of 1600px and re-encodes as WebP, which
 * is enough for full-bleed product shots while cutting file size
 * dramatically (typically 80-95% smaller).
 */
export async function compressImage(
  file: File,
  maxDimension = 1600,
  quality = 0.82
): Promise<File> {
  // Skip compression for already-small files or non-image files —
  // nothing to gain, and avoids touching e.g. SVGs.
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
    return file;
  }

  const bitmap = await createImageBitmap(file);

  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return file;

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/webp", quality)
  );

  // If compression somehow failed or produced nothing usable, fall
  // back to the original file rather than blocking the upload.
  if (!blob || blob.size === 0) return file;

  // Never make the file bigger than it started.
  if (blob.size >= file.size) return file;

  const newName = file.name.replace(/\.[^.]+$/, "") + ".webp";
  return new File([blob], newName, { type: "image/webp" });
}
