"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { getSupabaseBrowserClient, hasSupabaseCredentials } from "@/lib/supabase/client";

// Supabase returns opaque Json for nested selects without generated types.
interface SupabaseCartBook {
  id: string;
  title: string;
  authors: string;
  price: number;
  cover_url: string;
  publisher: string;
}

export interface CartBook {
  id: string;
  title: string;
  authors: string;
  price: string;
  priceValue: number;
  cover: string;
  publisher: string;
}

export interface CartItem {
  book: CartBook;
  quantity: number;
}

export const MAX_QUANTITY = 2;

interface CartContextType {
  items: CartItem[];
  addToCart: (book: CartBook) => Promise<{ atMax: boolean; requiresAuth: boolean }>;
  removeFromCart: (bookId: string) => Promise<void>;
  updateQuantity: (bookId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartCount: number;
  cartTotal: number;
  hydrated: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

// ── Helpers ──────────────────────────────────────────────────────────────────

function localLoad(): CartItem[] {
  try {
    const s = localStorage.getItem("shroff_cart");
    return s ? JSON.parse(s) : [];
  } catch { return []; }
}

function localSave(items: CartItem[]) {
  localStorage.setItem("shroff_cart", JSON.stringify(items));
}

function localClear() {
  localStorage.removeItem("shroff_cart");
}

// ── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, hydrated: authHydrated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const cartIdRef = useRef<string | null>(null);

  // Load cart whenever auth state settles
  useEffect(() => {
    if (!authHydrated) return;

    if (user && hasSupabaseCredentials()) {
      loadDbCart();
    } else if (user) {
      // Supabase not configured — local dev fallback
      setItems(localLoad());
      setHydrated(true);
    } else {
      // Not logged in — clear any stale guest cart and show empty
      localClear();
      setItems([]);
      setHydrated(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, authHydrated]);

  // ── DB helpers ──────────────────────────────────────────────────────────────

  async function getOrCreateCartId(userId: string): Promise<string | null> {
    const sb = getSupabaseBrowserClient();
    if (!sb) return null;

    const { data: existing } = await sb
      .from("carts")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (existing) { cartIdRef.current = existing.id; return existing.id; }

    const { data: created } = await sb
      .from("carts")
      .insert({ user_id: userId })
      .select("id")
      .single();

    if (created) { cartIdRef.current = created.id; return created.id; }
    return null;
  }

  async function loadDbCart() {
    const sb = getSupabaseBrowserClient();
    if (!sb || !user) { setItems(localLoad()); setHydrated(true); return; }

    const cartId = await getOrCreateCartId(user.id);
    if (!cartId) { setItems(localLoad()); setHydrated(true); return; }

    // Merge any guest items into the DB cart, then clear localStorage
    const guestItems = localLoad();
    if (guestItems.length > 0) {
      for (const { book, quantity } of guestItems) {
        await sb.from("cart_items").upsert(
          { cart_id: cartId, book_id: book.id, quantity },
          { onConflict: "cart_id,book_id" }
        );
      }
      localClear();
    }

    // Read current items from DB
    const { data } = await sb
      .from("cart_items")
      .select("quantity, books(id, title, authors, price, cover_url, publisher)")
      .eq("cart_id", cartId);

    if (data) {
      setItems(
        data
          .filter((row) => row.books && !Array.isArray(row.books))
          .map((row) => {
            const b = row.books as unknown as SupabaseCartBook;
            return {
              book: {
                id: b.id,
                title: b.title,
                authors: b.authors,
                price: `₹${Number(b.price).toLocaleString("en-IN")}`,
                priceValue: Number(b.price),
                cover: b.cover_url,
                publisher: b.publisher,
              },
              quantity: row.quantity,
            };
          })
      );
    }

    setHydrated(true);
  }

  // ── Operations ──────────────────────────────────────────────────────────────

  const addToCart = async (book: CartBook): Promise<{ atMax: boolean; requiresAuth: boolean }> => {
    if (!user) return { atMax: false, requiresAuth: true };

    let atMax = false;

    setItems((prev) => {
      const exists = prev.find((i) => i.book.id === book.id);
      if (exists && exists.quantity >= MAX_QUANTITY) {
        atMax = true;
        return prev;
      }
      return exists
        ? prev.map((i) => i.book.id === book.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { book, quantity: 1 }];
    });

    if (atMax) return { atMax: true, requiresAuth: false };

    if (user && hasSupabaseCredentials()) {
      const sb = getSupabaseBrowserClient();
      const cartId = cartIdRef.current ?? await getOrCreateCartId(user.id);
      if (!sb || !cartId) return { atMax: false, requiresAuth: false };

      const existing = items.find((i) => i.book.id === book.id);
      const newQty = Math.min((existing?.quantity ?? 0) + 1, MAX_QUANTITY);
      await sb.from("cart_items").upsert(
        { cart_id: cartId, book_id: book.id, quantity: newQty },
        { onConflict: "cart_id,book_id" }
      );
    } else {
      setItems((prev) => { localSave(prev); return prev; });
    }

    return { atMax: false, requiresAuth: false };
  };

  const removeFromCart = async (bookId: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.book.id !== bookId);
      if (!user) localSave(next);
      return next;
    });

    if (user && hasSupabaseCredentials()) {
      const sb = getSupabaseBrowserClient();
      const cartId = cartIdRef.current;
      if (!sb || !cartId) return;
      await sb.from("cart_items").delete()
        .eq("cart_id", cartId).eq("book_id", bookId);
    }
  };

  const updateQuantity = async (bookId: string, quantity: number) => {
    if (quantity < 1) { await removeFromCart(bookId); return; }
    const clamped = Math.min(quantity, MAX_QUANTITY);

    setItems((prev) => {
      const next = prev.map((i) => i.book.id === bookId ? { ...i, quantity: clamped } : i);
      if (!user) localSave(next);
      return next;
    });

    if (user && hasSupabaseCredentials()) {
      const sb = getSupabaseBrowserClient();
      const cartId = cartIdRef.current;
      if (!sb || !cartId) return;
      await sb.from("cart_items")
        .update({ quantity: clamped })
        .eq("cart_id", cartId).eq("book_id", bookId);
    }
  };

  const clearCart = async () => {
    setItems([]);
    localClear();

    if (user && hasSupabaseCredentials()) {
      const sb = getSupabaseBrowserClient();
      const cartId = cartIdRef.current;
      if (!sb || !cartId) return;
      await sb.from("cart_items").delete().eq("cart_id", cartId);
    }
  };

  const cartCount = items.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = items.reduce((s, i) => s + i.book.priceValue * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal, hydrated }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
