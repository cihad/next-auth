import Image from "next/image";
import { Product } from "@/types/product";
import { ShoppingCartIcon } from "lucide-react";
import AppButton from "./app-button";
import { getTranslations } from "next-intl/server";

interface ProductCardProps {
  product: Product;
}

export async function ProductCard({ product }: ProductCardProps) {
  const t = await getTranslations("homePage");

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="relative w-full h-64 bg-gray-100">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-contain p-4"
        />
      </div>
      <div className="p-4 space-y-3">
        <h3 className="line-clamp-2 font-medium min-h-14">{product.title}</h3>
        <div className="flex items-center justify-between gap-4">
          <p className="font-medium text-primary">${product.price}</p>
          <AppButton
            size="icon"
            variant="outline"
            tooltip={t("addToCartTooltip")}
          >
            <ShoppingCartIcon />
          </AppButton>
        </div>
      </div>
    </div>
  );
}
