"use client";

import { Button } from "@fakestore/shadcn/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@fakestore/shadcn/components/dropdown-menu";
import { MenuIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export function MobileMenu() {
  const t = useTranslations("navbar");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <MenuIcon className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem asChild>
          <a href="/" className="w-full cursor-pointer">
            {t("home")}
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="/products" className="w-full cursor-pointer">
            {t("products")}
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
