import { Skeleton } from "@fakestore/shadcn/components/skeleton";
import { Card, CardContent } from "@fakestore/shadcn/components/card";
import { Separator } from "@fakestore/shadcn/components/separator";
import { PageTitle } from "@/components/app/page-title";

export default function CartLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageTitle>
        <Skeleton className="h-10 w-48" />
      </PageTitle>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items Skeleton */}
        <div className="lg:col-span-2 space-y-4">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="relative flex gap-4 border rounded-lg p-6"
            >
              {/* Product Image Skeleton */}
              <Skeleton className="size-14 sm:size-28 rounded" />

              {/* Product Info Skeleton */}
              <div className="flex-1 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-8 w-26 rounded-full" />
              </div>

              {/* Price Skeleton */}
              <Skeleton className="h-7 w-20" />

              {/* Remove Button Skeleton */}
              <Skeleton className="absolute -right-px -bottom-px h-9 w-9 rounded-tr-none rounded-bl-none" />
            </div>
          ))}
        </div>

        {/* Order Summary Skeleton */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardContent className="space-y-4">
              <Skeleton className="h-7 w-40" />
              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-8" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>

              <Separator />

              <div className="flex justify-between">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>

              <Skeleton className="h-11 w-full rounded-md" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
