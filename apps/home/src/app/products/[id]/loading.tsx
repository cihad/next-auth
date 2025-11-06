import { Navbar } from "@/components/app/navbar";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeftIcon } from "lucide-react";

export default function ProductDetailLoading() {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back link skeleton */}
        <div className="inline-flex items-center gap-2 mb-8">
          <ArrowLeftIcon className="w-4 h-4 text-muted-foreground" />
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image Skeleton */}
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <Skeleton className="w-full h-full" />
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-6">
            {/* Title and Category */}
            <div>
              <Skeleton className="h-9 w-3/4 mb-2" />
              <Skeleton className="h-4 w-40" />
            </div>

            {/* Rating Skeleton */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>

            {/* Price Section */}
            <div className="border-t border-b py-4 space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-32" />
            </div>

            {/* Description */}
            <div className="space-y-3">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>

            {/* Add to Cart Button */}
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </main>
    </>
  );
}
