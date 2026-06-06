"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart, MAX_QUANTITY } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  IconShoppingCart,
  IconMinus,
  IconPlus,
  IconTrash,
  IconLock,
  IconArrowRight,
} from "@tabler/icons-react";

export default function CartClient() {
  const { items, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount, hydrated } = useCart();
  const { user } = useAuth();

  const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

  // Wait until localStorage has been read before showing empty state,
  // otherwise a hard refresh always briefly flashes "Your cart is empty".
  if (!hydrated) {
    return (
      <div className="min-h-[calc(100dvh-92px)] bg-slate-50 py-10 px-4">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="h-7 bg-slate-200 rounded w-44 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              <div className="bg-white border border-slate-200 rounded-xl h-28 shadow-sm" />
              <div className="bg-white border border-slate-200 rounded-xl h-28 shadow-sm" />
            </div>
            <div className="bg-white border border-slate-200 rounded-xl h-56 shadow-sm" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[calc(100dvh-92px)] bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <div className="w-16 h-16 bg-[#e8f0f9] rounded-full flex items-center justify-center mx-auto mb-4">
              <IconShoppingCart stroke={1.5} size={28} className="text-[#06377a]" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Log in to view your cart</h1>
            <p className="text-sm text-slate-500 mb-6 max-w-xs mx-auto">
              Sign in to see saved items, update quantities, and continue to checkout.
            </p>
            <Link
              href="/account"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#06377a] rounded-lg hover:bg-[#052d60] transition-colors"
            >
              Go to account
              <IconArrowRight size={15} stroke={2} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[calc(100dvh-92px)] bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconShoppingCart stroke={1.5} size={28} className="text-slate-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h1>
          <p className="text-sm text-slate-500 mb-6 max-w-xs mx-auto">
            Browse our collection and add books to get started.
          </p>
          <Link
            href="/books"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#06377a] rounded-lg hover:bg-[#052d60] transition-colors"
          >
            Browse Books
            <IconArrowRight size={15} stroke={2} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100dvh-92px)] bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Shopping Cart
            <span className="text-base font-normal text-slate-400 ml-2">({cartCount} {cartCount === 1 ? "item" : "items"})</span>
          </h1>
          <button
            onClick={clearCart}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors"
          >
            <IconTrash size={14} stroke={1.5} />
            Clear cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items list */}
          <div className="lg:col-span-2 space-y-3">
            {items.map(({ book, quantity }) => (
              <div
                key={book.id}
                className="bg-white border border-slate-200 rounded-xl p-4 flex gap-4 shadow-sm"
              >
                {/* Cover */}
                <Link href={`/books/${book.id}`} className="shrink-0">
                  <div className="relative w-16 h-[84px] rounded overflow-hidden bg-slate-100 shadow-sm">
                    <Image
                      src={book.cover}
                      alt={book.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                      unoptimized
                    />
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
                    {book.publisher}
                  </p>
                  <Link href={`/books/${book.id}`}>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug hover:text-[#06377a] transition-colors line-clamp-2">
                      {book.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-500 mt-0.5 mb-3">{book.authors}</p>

                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    {/* Qty controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(book.id, quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <IconMinus size={12} stroke={2.5} />
                      </button>
                      <span className="text-sm font-bold text-slate-900 w-6 text-center tabular-nums">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(book.id, quantity + 1)}
                        disabled={quantity >= MAX_QUANTITY}
                        className="w-7 h-7 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Increase quantity"
                      >
                        <IconPlus size={12} stroke={2.5} />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-slate-900 tabular-nums">
                        {fmt(book.priceValue * quantity)}
                      </span>
                      <button
                        onClick={() => removeFromCart(book.id)}
                        className="text-slate-300 hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <IconTrash size={16} stroke={1.5} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm sticky top-[108px]">
              <h2 className="text-sm font-semibold text-slate-900 mb-4">Order Summary</h2>

              <div className="space-y-2.5 mb-4">
                {items.map(({ book, quantity }) => (
                  <div key={book.id} className="flex justify-between text-xs text-slate-500">
                    <span className="truncate mr-2 flex-1">{book.title} × {quantity}</span>
                    <span className="shrink-0 tabular-nums">{fmt(book.priceValue * quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-3 flex justify-between items-center mb-5">
                <span className="text-sm font-semibold text-slate-700">Total</span>
                <span className="text-lg font-bold text-slate-900 tabular-nums">{fmt(cartTotal)}</span>
              </div>

              {user ? (
                <Link href="/checkout" className="w-full py-3 text-sm font-semibold text-white bg-[#06377a] rounded-xl hover:bg-[#052d60] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                  Proceed to Checkout
                  <IconArrowRight size={15} stroke={2} />
                </Link>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <IconLock size={14} stroke={1.5} className="text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-700">
                      <span className="font-semibold">Log in to checkout.</span> Use the account icon in the navigation bar to sign in or create an account.
                    </p>
                  </div>
                  <button
                    disabled
                    className="w-full py-3 text-sm font-semibold text-white bg-slate-300 rounded-xl cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout
                    <IconArrowRight size={15} stroke={2} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
