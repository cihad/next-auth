"use client";

import { createContext, useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@fakestore/shadcn/components/input";
import { Label } from "@fakestore/shadcn/components/label";
import { Checkbox } from "@fakestore/shadcn/components/checkbox";
import { Button } from "@fakestore/shadcn/components/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@fakestore/shadcn/components/collapsible";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";
import { ButtonGroup } from "@fakestore/shadcn/components/button-group";
import { ProductSort } from "./product-sort";

interface MobileFiltersProps {
  categories: string[];
  selectedCategories: string[];
  sortBy: string;
}

const MobileFiltersContext = createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
} | null>(null);

export function MobileFiltersProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <MobileFiltersContext.Provider value={{ isOpen, setIsOpen }}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        {children}
      </Collapsible>
    </MobileFiltersContext.Provider>
  );
}

export function MobileFiltersTrigger() {
  const t = useTranslations("productsPage");

  return (
    <CollapsibleTrigger asChild>
      <Button variant="outline" size="sm" className="gap-2">
        <Filter className="h-4 w-4" strokeWidth={1} />
        {t("filters")}
      </Button>
    </CollapsibleTrigger>
  );
}

export function MobileFiltersContent({
  categories,
  selectedCategories,
  sortBy,
}: MobileFiltersProps) {
  const t = useTranslations("productsPage");
  const router = useRouter();
  const searchParams = useSearchParams();

  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  };

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentCategories = params.get("categories")?.split(",") || [];

    let newCategories: string[];
    if (currentCategories.includes(category)) {
      newCategories = currentCategories.filter((c) => c !== category);
    } else {
      newCategories = [...currentCategories, category];
    }

    if (newCategories.length > 0) {
      params.set("categories", newCategories.join(","));
    } else {
      params.delete("categories");
    }

    router.push(`/products?${params.toString()}`);
  };

  return (
    <CollapsibleContent className="space-y-4 border rounded-lg p-4 mt-4">
      {/* Categories Section */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">{t("categories")}</Label>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`mobile-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => handleCategoryChange(category)}
              />
              <Label
                htmlFor={`mobile-${category}`}
                className="text-sm font-normal cursor-pointer capitalize"
              >
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range Section */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">{t("priceRange")}</Label>
        <ButtonGroup>
          <Input
            id="mobile-minPrice"
            type="number"
            min="0"
            placeholder={t("minPrice")}
            value={minPrice}
            onChange={(e) => updateFilters("minPrice", e.target.value)}
          />
          <Input
            id="mobile-maxPrice"
            type="number"
            min="0"
            placeholder={t("maxPrice")}
            value={maxPrice}
            onChange={(e) => updateFilters("maxPrice", e.target.value)}
          />
        </ButtonGroup>
      </div>

      {/* Sort By Section */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">{t("sortBy")}</Label>
        <ProductSort value={sortBy} />
      </div>
    </CollapsibleContent>
  );
}
