import { getTranslations } from "next-intl/server";
import { Product } from "@fakestore/shared/types/product";
import { InlineFilters } from "@/components/app/inline-filters";
import { ProductSort } from "@/components/app/product-sort";
import { ProductCard } from "@/components/app/product-card";
import { PageTitle } from "@fakestore/shared/components/page-title";
import {
  MobileFiltersProvider,
  MobileFiltersTrigger,
  MobileFiltersContent,
} from "./mobile-filters";

interface ProductListProps {
  products: Product[];
  categories: string[];
  selectedCategories: string[];
  sortBy: string;
}

export async function ProductList({
  products,
  categories,
  selectedCategories,
  sortBy,
}: ProductListProps) {
  const t = await getTranslations("productsPage");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <MobileFiltersProvider>
        {/* Mobile: Title and Filter Button */}
        <div className="flex justify-between items-center mb-4 lg:mb-8">
          <PageTitle className="mb-0">{t("title")}</PageTitle>
          <div className="lg:hidden">
            <MobileFiltersTrigger />
          </div>
        </div>

        {/* Mobile: Collapsible Filter Content */}
        <div className="lg:hidden mb-6">
          <MobileFiltersContent
            categories={categories}
            selectedCategories={selectedCategories}
            sortBy={sortBy}
          />
        </div>
      </MobileFiltersProvider>

      {/* Desktop Filters */}
      <div className="hidden lg:flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <InlineFilters
          categories={categories}
          selectedCategories={selectedCategories}
        />
        <div className="flex items-center gap-4 lg:ml-auto">
          <p className="text-sm text-muted-foreground whitespace-nowrap">
            {t("showingProducts", { count: products.length })}
          </p>
          <ProductSort value={sortBy} />
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">{t("noProducts")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
