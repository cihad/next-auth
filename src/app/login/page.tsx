import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import Auth0Logo from "@/components/app/auth0-logo";
import { signIn } from "@/lib/auth";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-8 bg-white dark:bg-gray-950">
        <div className="w-full max-w-md space-y-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold">Sign in to your account</h1>
          </Link>

          <form
            action={async () => {
              "use server";
              await signIn("auth0", { redirectTo: "/" });
            }}
          >
            <Button type="submit">
              <Auth0Logo />
              Sign in with Auth0
            </Button>
          </form>

          <div className="text-sm text-muted-foreground">
            By continuing, you agree to our{" "}
            <a href="#" className="underline hover:text-foreground">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-foreground">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>

      <div className="hidden lg:block relative overflow-hidden">
        <Image
          src="/login-photo.jpeg"
          alt="Welcome to Next Auth"
          fill
          sizes="50vw"
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
