"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { clearFlash, type FlashMessage } from "@/lib/flash";

interface FlashMessageProps {
  flash: FlashMessage | null;
}

export default function FlashMessage({ flash }: FlashMessageProps) {
  useEffect(() => {
    if (flash) {
      const { type, message } = flash;

      switch (type) {
        case "success":
          toast.success(message);
          break;
        case "error":
          toast.error(message);
          break;
        case "warning":
          toast.warning(message);
          break;
        case "info":
          toast.info(message);
          break;
      }

      clearFlash();
    }
  }, [flash]);

  return null;
}
