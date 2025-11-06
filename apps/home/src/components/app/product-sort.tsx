"use client";

import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductSortProps {
  value: string;
}

export function ProductSort({ value }: ProductSortProps) {
  const t = useTranslations("productsPage");
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (newValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newValue === "default") {
      params.delete("sort");
    } else {
      params.set("sort", newValue);
    }
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium">{t("sortBy")}:</label>
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Default</SelectItem>
          <SelectItem value="price-asc">{t("priceAsc")}</SelectItem>
          <SelectItem value="price-desc">{t("priceDesc")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
