"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  EMPTY_CART,
  ENGRAVING_MAX,
  cartCount,
  itemKey,
  type Cart,
  type CartConfig,
  type CartItem,
} from "@/lib/cart";

const STORAGE_KEY = "lumiere:cart";

type AddInput = Omit<CartItem, "key" | "qty"> & { qty?: number };

type CartContextValue = {
  cart: Cart;
  count: number;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (item: AddInput, opts?: { open?: boolean }) => void;
  removeItem: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  setGiftWrap: (on: boolean) => void;
  setEngraving: (text: string) => void;
  applyPromo: (code: string | null) => void;
};

const CartCtx = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>(EMPTY_CART);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const hydrated = useRef(false);

  /* Hydrate once from localStorage. */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Cart>;
        setCart({
          items: Array.isArray(parsed.items) ? parsed.items : [],
          giftWrap: parsed.giftWrap ?? true,
          engraving: typeof parsed.engraving === "string" ? parsed.engraving : "",
          promo: typeof parsed.promo === "string" ? parsed.promo : null,
        });
      }
    } catch {
      /* corrupt storage — start fresh */
    }
    hydrated.current = true;
  }, []);

  /* Persist after hydration. */
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      /* quota / private mode — non-fatal */
    }
  }, [cart]);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const addItem = useCallback<CartContextValue["addItem"]>((item, opts) => {
    const config: CartConfig = item.config;
    const key = itemKey(item.productId, config);
    setCart((prev) => {
      const existing = prev.items.find((i) => i.key === key);
      const items = existing
        ? prev.items.map((i) =>
            i.key === key ? { ...i, qty: i.qty + (item.qty ?? 1) } : i
          )
        : [...prev.items, { ...item, key, qty: item.qty ?? 1 }];
      return { ...prev, items };
    });
    if (opts?.open !== false) setDrawerOpen(true);
  }, []);

  const removeItem = useCallback((key: string) => {
    setCart((prev) => ({ ...prev, items: prev.items.filter((i) => i.key !== key) }));
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setCart((prev) => ({
      ...prev,
      items:
        qty <= 0
          ? prev.items.filter((i) => i.key !== key)
          : prev.items.map((i) => (i.key === key ? { ...i, qty } : i)),
    }));
  }, []);

  const clear = useCallback(() => {
    setCart((prev) => ({ ...EMPTY_CART, giftWrap: prev.giftWrap }));
  }, []);

  const setGiftWrap = useCallback((on: boolean) => {
    setCart((prev) => ({ ...prev, giftWrap: on }));
  }, []);

  const setEngraving = useCallback((text: string) => {
    setCart((prev) => ({ ...prev, engraving: text.slice(0, ENGRAVING_MAX) }));
  }, []);

  const applyPromo = useCallback((code: string | null) => {
    setCart((prev) => ({ ...prev, promo: code }));
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      count: cartCount(cart),
      drawerOpen,
      openDrawer,
      closeDrawer,
      addItem,
      removeItem,
      setQty,
      clear,
      setGiftWrap,
      setEngraving,
      applyPromo,
    }),
    [
      cart,
      drawerOpen,
      openDrawer,
      closeDrawer,
      addItem,
      removeItem,
      setQty,
      clear,
      setGiftWrap,
      setEngraving,
      applyPromo,
    ]
  );

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}
