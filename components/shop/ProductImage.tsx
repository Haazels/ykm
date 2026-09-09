"use client";

import { useEffect, useState } from "react";
import Image, { type ImageProps } from "next/image";

export const FALLBACK_IMAGE = "/images/koala.jpg";

const KNOWN_HOSTS = [
  "framerusercontent.com",
  "img.youtube.com",
  "images.unsplash.com",
  "youknowmeyt.com",
  "www.youknowmeyt.com",
  "res.cloudinary.com",
  "i.imgur.com",
];

function isKnownHost(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    if (host.endsWith(".supabase.co")) return true;
    return KNOWN_HOSTS.includes(host);
  } catch {
    return false;
  }
}

export function getValidSrc(src: unknown): string {
  if (typeof src !== "string" || !src.trim()) return FALLBACK_IMAGE;
  const s = src.trim();
  if (s.startsWith("/image/")) return "/images/" + s.slice(7);
  if (s.includes("1785837303729.jpeg")) return FALLBACK_IMAGE;
  return s;
}

/**
 * Wraps next/image with a visible fallback when a photo fails to load
 * (broken URL, deleted file, missing image) by displaying the default
 * fallback image instead of a blank gap or broken icon.
 */
export default function ProductImage({ src, alt, unoptimized, ...props }: ImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(() => getValidSrc(src));

  useEffect(() => {
    setImgSrc(getValidSrc(src));
  }, [src]);

  const isDataUrl = typeof imgSrc === "string" && imgSrc.startsWith("data:");
  const isExternal = typeof imgSrc === "string" && (imgSrc.startsWith("http://") || imgSrc.startsWith("https://"));
  const shouldBeUnoptimized = Boolean(isDataUrl || (isExternal && !isKnownHost(imgSrc)) || unoptimized);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt || "Product"}
      unoptimized={shouldBeUnoptimized}
      onError={() => {
        if (imgSrc !== FALLBACK_IMAGE) {
          setImgSrc(FALLBACK_IMAGE);
        }
      }}
    />
  );
}
