"use client";

import Image from "next/image";
import Link from "next/link";
import { IconShoppingCart, IconCheck, IconAlertCircle } from "@tabler/icons-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/Toast";

interface Book {
  id: string;
  title: string;
  authors: string;
  price: string;
  priceValue: number;
  cover: string;
  category: string;
  categoryLabel: string;
  publisher: string;
}

type Flash = "added" | "max" | null;

export default function BookCard({ book }: { book: Book }) {
  const [flash, setFlash] = useState<Flash>(null);
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const router = useRouter();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const { atMax, requiresAuth } = await addToCart({
      id: book.id,
      title: book.title,
      authors: book.authors,
      price: book.price,
      priceValue: book.priceValue,
      cover: book.cover,
      publisher: book.publisher,
    });
    if (requiresAuth) { showToast("You must be logged in to add books to your cart.", "info"); router.push("/account"); return; }
    setFlash(atMax ? "max" : "added");
    setTimeout(() => setFlash(null), 2000);
  };

  return (
    <article className="group flex h-full flex-col">
      {/* Cover */}
      <Link href={`/books/${book.id}`} tabIndex={-1} className="relative mb-3 block aspect-[3/4] overflow-hidden rounded bg-slate-100 shadow-sm group-hover:shadow-md transition-shadow duration-300">
        <Image
          src={book.cover}
          alt={book.title}
          fill
          loading="eager"
          className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 25vw"
          unoptimized
        />
      </Link>

      {/* Text below cover */}
      <div className="flex flex-1 flex-col">
        <div className="flex-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
            {book.publisher}
          </span>
          <Link href={`/books/${book.id}`} className="block">
            <h3 className="mt-0.5 text-[14px] font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-[#06377a] transition-colors">
              {book.title}
            </h3>
          </Link>
          <p className="mt-0.5 text-[12px] text-slate-500 line-clamp-1">{book.authors}</p>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2 border-t border-slate-100 pt-2">
          <span className="text-base font-bold text-slate-900">{book.price}</span>
          <button
            onClick={handleAddToCart}
            aria-label={flash === "added" ? "Added to cart" : flash === "max" ? "Maximum quantity reached" : "Add to cart"}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-semibold transition-all active:scale-[0.97] ${
              flash === "added"
                ? "bg-emerald-50 text-emerald-700"
                : flash === "max"
                ? "bg-amber-50 text-amber-700"
                : "bg-[#06377a] text-white hover:bg-[#052d60]"
            }`}
          >
            {flash === "added" ? (
              <><IconCheck stroke={2} size={13} />Added</>
            ) : flash === "max" ? (
              <><IconAlertCircle stroke={2} size={13} />Max 2</>
            ) : (
              <><IconShoppingCart stroke={1.5} size={13} />Add</>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
