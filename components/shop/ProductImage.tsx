"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { ImageOff } from "lucide-react";

/**
 * Wraps next/image with a visible fallback when a photo fails to load
 * (broken URL, deleted file, slow/timed-out network request) instead
 * of leaving a blank gap where the product photo should be.
 */
export default function ProductImage(props: ImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#1a1a1a] text-[#555]">
        <ImageOff size={28} strokeWidth={1.5} />
      </div>
    );
  }

  return <Image {...props} onError={() => setFailed(true)} />;
}
