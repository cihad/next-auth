"use server";

import { cookies } from "next/headers";

export type FlashType = "success" | "error" | "info" | "warning";

export interface FlashMessage {
  type: FlashType;
  message: string;
}

const FLASH_COOKIE_NAME = "flash-message";

export async function setFlash(type: FlashType, message: string) {
  const cookieStore = await cookies();
  const flash: FlashMessage = { type, message };

  cookieStore.set(FLASH_COOKIE_NAME, JSON.stringify(flash), {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60,
    path: "/",
  });
}

export async function getFlash(): Promise<FlashMessage | null> {
  const cookieStore = await cookies();
  const flash = cookieStore.get(FLASH_COOKIE_NAME);

  if (!flash) {
    return null;
  }

  try {
    return JSON.parse(flash.value) as FlashMessage;
  } catch {
    return null;
  }
}

export async function clearFlash() {
  const cookieStore = await cookies();
  cookieStore.delete(FLASH_COOKIE_NAME);
}
