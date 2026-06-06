"use client";

import { useState } from "react";
import { IconShoppingCart, IconCheck, IconAlertCircle } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/Toast";

interface Props {
  book: {
    id: string;
    title: string;
    authors: string;
    price: string;
    priceValue: number;
    cover: string;
    publisher: string;
  };
}

type Flash = "added" | "max" | null;

export default function BookActions({ book }: Props) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const router = useRouter();
  const [flash, setFlash] = useState<Flash>(null);

  const handleAdd = async () => {
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
    <div className="flex flex-col sm:flex-row gap-3 mb-8">
      <button
        onClick={handleAdd}
        className={`flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg transition-all active:scale-[0.98] ${
          flash === "added"
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : flash === "max"
            ? "bg-amber-50 text-amber-700 border border-amber-200"
            : "text-white bg-[#06377a] hover:bg-[#052d60]"
        }`}
      >
        {flash === "added" ? (
          <><IconCheck stroke={2} size={17} /> Added to Cart</>
        ) : flash === "max" ? (
          <><IconAlertCircle stroke={2} size={17} /> Max 2 per order</>
        ) : (
          <><IconShoppingCart stroke={1.5} size={17} /> Buy Now</>
        )}
      </button>
    </div>
  );
}
