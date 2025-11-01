import { Button } from "@/components/ui/button";
import Link from "next/link";
import UserMenu from "./user-menu";
import { auth } from "@/lib/auth";

export async function Navbar() {
  const session = await auth();

  return (
    <nav className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-xl font-bold">Next Auth</h1>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {session ? (
              <UserMenu user={session.user} />
            ) : (
              <>
                <Button asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
