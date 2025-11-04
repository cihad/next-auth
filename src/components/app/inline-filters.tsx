"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Filter } from "lucide-react";
import { ButtonGroup } from "../ui/button-group";

interface InlineFiltersProps {
  categories: string[];
  selectedCategories: string[];
}

export function InlineFilters({
  categories,
  selectedCategories,
}: InlineFiltersProps) {
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
    <div className="flex flex-wrap items-center space-x-4">
      {/* Categories Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" strokeWidth={1} />
            {t("categories")}
            {selectedCategories.length > 0 && (
              <span className="ml-1 rounded-full bg-primary text-primary-foreground w-5 h-5 text-xs flex items-center justify-center">
                {selectedCategories.length}
              </span>
            )}
            <ChevronDown className="h-4 w-4" strokeWidth={1} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64" align="start">
          <div className="space-y-3">
            <h4 className="font-medium text-sm">{t("categories")}</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`inline-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryChange(category)}
                  />
                  <Label
                    htmlFor={`inline-${category}`}
                    className="text-sm font-normal cursor-pointer capitalize"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Price Range Inputs */}
      <div className="flex items-center gap-2">
        <Label htmlFor="inline-minPrice" className="text-sm whitespace-nowrap">
          {t("priceRange")}:
        </Label>

        <ButtonGroup>
          <Input
            id="inline-minPrice"
            type="number"
            min="0"
            placeholder={t("minPrice")}
            value={minPrice}
            onChange={(e) => updateFilters("minPrice", e.target.value)}
            className="w-24"
          />
          <Input
            id="inline-maxPrice"
            type="number"
            min="0"
            placeholder={t("maxPrice")}
            value={maxPrice}
            onChange={(e) => updateFilters("maxPrice", e.target.value)}
            className="w-24"
          />
        </ButtonGroup>
      </div>
    </div>
  );
}
