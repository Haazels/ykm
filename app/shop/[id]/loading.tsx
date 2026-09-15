import Navbar from "@/components/Navbar";
import { ProductDetailSkeleton } from "@/components/Skeleton";

export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <ProductDetailSkeleton />
    </div>
  );
}
