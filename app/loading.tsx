import Skeleton, { ShopCardSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero Skeleton */}
      <div className="w-full flex flex-col items-center justify-center py-16 px-4 space-y-4">
        <Skeleton className="h-16 md:h-28 w-4/5 max-w-[900px] rounded-2xl" />
        <Skeleton className="h-4 w-2/3 max-w-[400px]" />
      </div>

      {/* Sticky Navbar Skeleton */}
      <div className="w-full py-4 border-y border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-9 w-20 rounded-full" />
            ))}
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-24 rounded-full" />
          </div>
        </div>
      </div>

      {/* Content Section Skeleton */}
      <div className="max-w-[1200px] mx-auto px-4 py-12 space-y-12">
        <div className="space-y-3 text-center flex flex-col items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>

        {/* Product Cards Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <ShopCardSkeleton key={n} />
          ))}
        </div>
      </div>
    </div>
  );
}
