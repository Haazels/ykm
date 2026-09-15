import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "rectangular" | "circular" | "card";
  width?: string | number;
  height?: string | number;
}

export default function Skeleton({
  className = "",
  variant = "rectangular",
  width,
  height,
}: SkeletonProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case "circular":
        return "rounded-full";
      case "text":
        return "rounded h-4 my-1 w-full";
      case "card":
        return "rounded-xl aspect-[3/4] w-full";
      case "rectangular":
      default:
        return "rounded-lg";
    }
  };

  const style: React.CSSProperties = {};
  if (width !== undefined) style.width = typeof width === "number" ? `${width}px` : width;
  if (height !== undefined) style.height = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={`skeleton-shimmer border border-white/5 bg-[#121215] ${getVariantStyle()} ${className}`}
      style={style}
    />
  );
}

export function ShopCardSkeleton() {
  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-white/10 bg-[#0d0d0f]">
      {/* Corner Tech Brackets */}
      <div className="absolute top-2.5 left-2.5 w-2.5 h-2.5 border-t-2 border-l-2 border-white/20 z-10" />
      <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 border-t-2 border-r-2 border-white/20 z-10" />

      {/* Shimmer Image Area */}
      <div className="absolute inset-0 skeleton-shimmer bg-[#141418]" />

      {/* Glassmorphic Bottom Panel Skeleton */}
      <div className="absolute inset-x-0 bottom-0 z-20 p-4 bg-gradient-to-t from-black via-black/85 to-transparent backdrop-blur-[6px] border-t border-white/10 flex flex-col gap-2.5">
        {/* Top Row: Name & Price Skeleton */}
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-5 w-1/4" />
        </div>

        {/* Bottom Row: Category & Button Skeleton */}
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-3.5 w-1/3" />
          <Skeleton className="w-8 h-8 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Left: Main Image Skeleton */}
        <div className="space-y-4">
          <div className="relative aspect-[4/3] md:aspect-[3/4] w-full rounded-2xl overflow-hidden skeleton-shimmer bg-[#141418] border border-white/10" />
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-lg skeleton-shimmer bg-[#141418] border border-white/10" />
            ))}
          </div>
        </div>

        {/* Right: Info Skeleton */}
        <div className="space-y-6 pt-2">
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 md:h-10 w-3/4" />
            <Skeleton className="h-8 w-32" />
          </div>

          <div className="space-y-2 py-4 border-y border-white/10">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          <div className="space-y-3">
            <Skeleton className="h-4 w-20" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-20 rounded-lg" />
              <Skeleton className="h-10 w-20 rounded-lg" />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Skeleton className="h-12 flex-1 rounded-xl" />
            <Skeleton className="h-12 w-12 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
