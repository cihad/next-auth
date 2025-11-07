import { Navbar } from "@fakestore/shared/components/navbar";
import { ProductCardSkeleton } from "@/components/app/product-card-skeleton";
import { Skeleton } from "@fakestore/shadcn/components/skeleton";

export default function ProductsLoading() {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mobile: Title and Filter Button */}
        <div className="flex justify-between items-center mb-6 lg:mb-8">
          <Skeleton className="h-8 w-32" />
          <div className="lg:hidden">
            <Skeleton className="h-9 w-24" />
          </div>
        </div>

        {/* Desktop Filters */}
        <div className="hidden lg:flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          {/* Inline Filters Skeleton */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Categories Button Skeleton */}
            <Skeleton className="h-9 w-32" />

            {/* Price Range Skeleton */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>

          {/* Product Count and Sort Skeleton */}
          <div className="flex items-center gap-4 lg:ml-auto">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-9 w-40" />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </main>
    </>
  );
}
