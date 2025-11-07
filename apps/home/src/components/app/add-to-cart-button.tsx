"use client";

import { Button } from "@fakestore/shadcn/components/button";
import { ShoppingCartIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAppDispatch } from "@fakestore/shared/store/hooks";
import { addItem } from "@fakestore/shared/store/cart-slice";
import { toast } from "sonner";
import { Product } from "@fakestore/shared/types/product";

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const t = useTranslations("productDetailPage");
  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    dispatch(addItem(product));
    toast.success(t("addedToCart"));
  };

  return (
    <Button size="lg" className="w-full" onClick={handleAddToCart}>
      <ShoppingCartIcon className="mr-2" />
      {t("addToCart")}
    </Button>
  );
}
