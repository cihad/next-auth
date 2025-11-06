import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import Auth0Logo from "@/components/app/auth0-logo";
import { signIn } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata.login");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LoginPage() {
  const t = await getTranslations("loginPage");

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-8 bg-white dark:bg-gray-950">
        <div className="w-full max-w-md space-y-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold">{t("title")}</h1>
          </Link>

          <form
            action={async () => {
              "use server";
              await signIn("auth0", { redirectTo: "/" });
            }}
          >
            <Button type="submit">
              <Auth0Logo />
              {t("signInWithAuth0")}
            </Button>
          </form>

          <div className="text-sm text-muted-foreground">
            {t.rich("termsAgreement", {
              termsLink: (chunks) => (
                <a href="#" className="underline hover:text-foreground">
                  {chunks}
                </a>
              ),
              privacyLink: (chunks) => (
                <a href="#" className="underline hover:text-foreground">
                  {chunks}
                </a>
              ),
            })}
          </div>
        </div>
      </div>

      <div className="hidden lg:block relative overflow-hidden">
        <Image
          src="/login-photo.jpeg"
          alt={t("imageAlt")}
          fill
          sizes="50vw"
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
