import { Button } from "@/components/ui/button";
import Link from "next/link";
import UserMenu from "./user-menu";
import LanguageSwitcher from "./language-switcher";
import { NavbarMenu } from "./navbar-menu";
import { auth } from "@/lib/auth";
import { getTranslations } from "next-intl/server";

export async function Navbar() {
  const session = await auth();
  const t = await getTranslations("navbar");

  return (
    <nav className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/">
              <h1 className="text-xl font-bold">{t("appTitle")}</h1>
            </Link>
            <NavbarMenu />
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            {session ? (
              <UserMenu user={session.user} />
            ) : (
              <>
                <Button asChild>
                  <Link href="/login">{t("signIn")}</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
