import { Button } from "@fakestore/shadcn/components/button";
import Link from "next/link";
import UserMenu from "./user-menu";
import LanguageSwitcher from "./language-switcher";
import { NavbarMenu } from "./navbar-menu";
import { MobileMenu } from "./mobile-menu";
import { CartPopover } from "./cart-popover";
import { auth } from "../lib/auth";
import { getTranslations } from "next-intl/server";
import NavbarLogo from "./navbar-logo";

export async function Navbar() {
  const session = await auth();
  const t = await getTranslations("navbar");

  return (
    <nav className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <MobileMenu />
            <Link href="/">
              <NavbarLogo />
            </Link>
            <div className="hidden md:block">
              <NavbarMenu />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageSwitcher />
            <CartPopover />
            {session ? (
              <UserMenu user={session.user} />
            ) : (
              <Button asChild size="sm" className="hidden sm:flex">
                <Link href="/login">{t("signIn")}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
