"use client";

import * as React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  removeItem,
  updateQuantity,
  selectCartItems,
  selectTotalItems,
  selectTotalPrice,
} from "@/lib/features/cart/cart-slice";
import { Button } from "@fakestore/shadcn/components/button";
import { Card, CardContent } from "@fakestore/shadcn/components/card";
import { Separator } from "@fakestore/shadcn/components/separator";
import { Input } from "@fakestore/shadcn/components/input";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@fakestore/shadcn/components/empty";
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemGroup,
  ItemActions,
} from "@fakestore/shadcn/components/item";
import Image from "next/image";
import Link from "next/link";
import {
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  Trash2Icon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ButtonGroup } from "@fakestore/shadcn/components/button-group";
import { formatPrice } from "@/lib/utils";
import { format } from "path";
import { PageTitle } from "@/components/app/page-title";
import AppButton from "@/components/app/app-button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@fakestore/shadcn/components/input-group";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const totalPrice = useAppSelector(selectTotalPrice);
  const totalItems = useAppSelector(selectTotalItems);
  const t = useTranslations("cartPage");

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantity({ productId, quantity: newQuantity }));
  };

  const handleCheckout = () => {
    toast.info(t("checkoutNotImplemented"));
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ShoppingCart />
            </EmptyMedia>
            <EmptyTitle>{t("emptyCart")}</EmptyTitle>
            <EmptyDescription>{t("emptyCartDescription")}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild size="lg">
              <Link href="/products">{t("continueShopping")}</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageTitle>{t("title")}</PageTitle>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => (
            <div
              key={item.product.id}
              className="relative flex gap-4 border rounded-lg p-6"
            >
              <div className="relative size-14 sm:size-28">
                <Image
                  src={item.product.image}
                  alt={item.product.title}
                  fill
                  className="object-contain border rounded"
                />
              </div>

              <div className="flex-1 space-y-3">
                <h3 className="font-semibold">
                  <Link href={`/products/${item.product.id}`}>
                    {item.product.title}
                  </Link>
                </h3>

                <p className="font-semibold">
                  {formatPrice(item.product.price)}
                </p>

                <InputGroup className="rounded-full inline-flex w-26">
                  <InputGroupAddon>
                    <InputGroupButton
                      variant="ghost"
                      size="icon-sm"
                      className="rounded-full"
                      onClick={() =>
                        handleQuantityChange(item.product.id, item.quantity - 1)
                      }
                    >
                      <Minus strokeWidth={1} />
                    </InputGroupButton>
                  </InputGroupAddon>
                  <InputGroupInput
                    type="number"
                    min="1"
                    className="w-8 text-center h-8 px-0! [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(
                        item.product.id,
                        parseInt(e.target.value) || 1
                      )
                    }
                  />

                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      variant="ghost"
                      size="icon-sm"
                      className="rounded-full"
                      onClick={() =>
                        handleQuantityChange(item.product.id, item.quantity + 1)
                      }
                    >
                      <Plus strokeWidth={1} />
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </div>

              <span className="font-semibold text-lg">
                {formatPrice(item.product.price * item.quantity)}
              </span>

              <AppButton
                tooltip={t("remove")}
                onClick={() => dispatch(removeItem(item.product.id))}
                size="icon-sm"
                variant="outline"
                className="absolute -right-[1px] -bottom-[1px] rounded-tr-none rounded-bl-none"
              >
                <Trash2Icon strokeWidth={1} />
              </AppButton>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardContent className="space-y-4">
              <h2 className="text-xl">{t("orderSummary")}</h2>
              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t("items", { count: totalItems })}
                  </span>
                  <span>{totalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("subtotal")}</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>{t("total")}</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              <Button className="w-full" size="lg" onClick={handleCheckout}>
                {t("checkout")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
