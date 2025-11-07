"use client";

import { ShoppingCart, X } from "lucide-react";
import { Button } from "@fakestore/shadcn/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@fakestore/shadcn/components/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@fakestore/shadcn/components/dialog";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  removeItem,
  selectCartItems,
  selectTotalItems,
  selectTotalPrice,
} from "../store/cart-slice";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "../hooks/use-media-query";

export function CartPopover() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const totalItems = useAppSelector(selectTotalItems);
  const totalPrice = useAppSelector(selectTotalPrice);
  const t = useTranslations("cart");
  const isMobile = useMediaQuery("(max-width: 768px)");

  const renderCartContent = () => (
    <div className="w-full">
      {items.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">
          <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>{t("emptyCart")}</p>
        </div>
      ) : (
        <>
          <div className="max-h-[400px] overflow-y-auto border-t">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-3 items-start py-3"
              >
                <div className="relative w-12 h-12 shrink-0">
                  <Image
                    src={item.product.image}
                    alt={item.product.title}
                    fill
                    className="object-contain rounded"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium line-clamp-2">
                    {item.product.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {item.quantity} × ${item.product.price.toFixed(2)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 h-8 w-8"
                  onClick={() => dispatch(removeItem(item.product.id))}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 space-y-4">
            <div className="flex justify-between items-center font-semibold">
              <span>{t("total")}</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <Button asChild className="w-full">
              <a href="/cart">{t("viewCart")}</a>
            </Button>
          </div>
        </>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center font-semibold">
                {totalItems}
              </span>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
          </DialogHeader>
          {renderCartContent()}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center font-semibold">
              {totalItems}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96" align="end">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">{t("title")}</h3>
          {renderCartContent()}
        </div>
      </PopoverContent>
    </Popover>
  );
}
