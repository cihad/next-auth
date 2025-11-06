"use client";

import Image from "next/image";
import { Product } from "@/types/product";
import { ShoppingCartIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useAppDispatch } from "@/lib/hooks";
import { addItem } from "@/lib/features/cart/cart-slice";
import { toast } from "sonner";
import AppButton from "./app-button";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations("homePage");
  const dispatch = useAppDispatch();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(addItem(product));
    toast.success(t("addedToCart"));
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow block"
    >
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
          <p className="font-medium text-primary">
            {formatPrice(product.price)}
          </p>
          <AppButton
            size="icon"
            variant="outline"
            onClick={handleAddToCart}
            tooltip={t("addToCartTooltip")}
          >
            <ShoppingCartIcon strokeWidth={1} />
          </AppButton>
        </div>
      </div>
    </Link>
  );
}
