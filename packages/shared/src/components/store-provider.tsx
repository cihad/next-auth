"use client";

import { useRef, useEffect } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "../store/store";
import { setItems } from "../store/cart-slice";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | undefined>(undefined);

  if (!storeRef.current) {
    storeRef.current = makeStore();

    // Load cart from localStorage on initialization (client-side only)
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart-storage");
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          if (parsed.state?.items) {
            storeRef.current.dispatch(setItems(parsed.state.items));
          }
        } catch (error) {
          console.error("Failed to load cart from localStorage:", error);
        }
      }
    }
  }

  // Save to localStorage on every state change
  useEffect(() => {
    if (!storeRef.current) return;

    const unsubscribe = storeRef.current.subscribe(() => {
      const state = storeRef.current?.getState();
      if (state) {
        localStorage.setItem(
          "cart-storage",
          JSON.stringify({ state: { items: state.cart.items } })
        );
      }
    });

    return unsubscribe;
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
