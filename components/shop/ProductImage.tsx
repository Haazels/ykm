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
 * Wraps next/image with a visible fallback and shimmer skeleton loader
 * while images are loading over the network.
 */
export default function ProductImage({ src, alt, className = "", unoptimized, onLoad, ...props }: ImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(() => getValidSrc(src));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setImgSrc(getValidSrc(src));
    setIsLoading(true);
  }, [src]);

  const isDataUrl = typeof imgSrc === "string" && imgSrc.startsWith("data:");
  const isExternal = typeof imgSrc === "string" && (imgSrc.startsWith("http://") || imgSrc.startsWith("https://"));
  const shouldBeUnoptimized = Boolean(isDataUrl || (isExternal && !isKnownHost(imgSrc)) || unoptimized);

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 z-10 skeleton-shimmer bg-[#141418] transition-opacity duration-500" />
      )}
      <Image
        {...props}
        src={imgSrc}
        alt={alt || "Product"}
        unoptimized={shouldBeUnoptimized}
        className={`${className} transition-opacity duration-500 ${isLoading ? "opacity-0" : "opacity-100"}`}
        onLoad={(e) => {
          setIsLoading(false);
          if (onLoad) onLoad(e);
        }}
        onError={() => {
          setIsLoading(false);
          if (imgSrc !== FALLBACK_IMAGE) {
            setImgSrc(FALLBACK_IMAGE);
          }
        }}
      />
    </>
  );
}
