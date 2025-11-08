import { Button } from "@fakestore/shadcn/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@fakestore/shadcn/components/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@fakestore/shadcn/components/avatar";
import { Session } from "next-auth";
import { signOut } from "../lib/auth";
import { setFlash } from "../lib/flash";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

interface UserMenuProps {
  user?: Session["user"];
}

export default function UserMenu({ user }: UserMenuProps) {
  const t = useTranslations("userMenu");

  const handleSignOut = async () => {
    "use server";
    const flashT = await getTranslations("flash");
    await setFlash("success", flashT("signOutSuccess"));
    await signOut({ redirectTo: "/" });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar>
            <AvatarImage src={user?.image || ""} alt={user?.email || "User"} />
            <AvatarFallback>
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <form action={handleSignOut}>
          <DropdownMenuItem asChild>
            <button type="submit" className="w-full">
              {t("signOut")}
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
