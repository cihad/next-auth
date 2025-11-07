import { ShoppingBagIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function NavbarLogo() {
  const t = await getTranslations("navbar");

  return (
    <div className="flex items-center gap-2">
      <ShoppingBagIcon />
      <h1 className="text-xl font-semibold">{t("appName")}</h1>
    </div>
  );
}
