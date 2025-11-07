import { cn } from "@fakestore/shared/lib/utils";
import { ComponentProps } from "react";

export function PageTitle({ className, ...props }: ComponentProps<"h2">) {
  return <h2 className={cn("text-2xl mb-8", className)} {...props} />;
}
