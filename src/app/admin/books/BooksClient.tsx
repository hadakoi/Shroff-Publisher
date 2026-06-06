"use client";

import { useState, useTransition } from "react";
import { IconPencil, IconCheck, IconX } from "@tabler/icons-react";
import { updateBookStock } from "./actions";

interface Book {
  id: string;
  title: string;
  authors: string;
  category_label: string;
  publisher: string;
  price: number;
  stock: number;
}

export default function BooksClient({ initialBooks }: { initialBooks: Book[] }) {
  const [books, setBooks] = useState(initialBooks);
  const [editing, setEditing] = useState<string | null>(null);
  const [draftStock, setDraftStock] = useState("");
  const [isPending, startTransition] = useTransition();

  const startEdit = (book: Book) => {
    setEditing(book.id);
    setDraftStock(String(book.stock));
  };

  const cancelEdit = () => { setEditing(null); setDraftStock(""); };

  const saveStock = (bookId: string) => {
    const newStock = parseInt(draftStock, 10);
    if (isNaN(newStock) || newStock < 0) return;

    startTransition(async () => {
      const result = await updateBookStock(bookId, newStock);
      if (!result.error) {
        setBooks((prev) =>
          prev.map((b) => b.id === bookId ? { ...b, stock: newStock } : b)
        );
      }
      setEditing(null);
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50">
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-[40%]">Book</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Category</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Publisher</th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Price</th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Stock</th>
            <th className="w-16" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {books.map((book) => (
            <tr key={book.id} className="hover:bg-slate-50/60 transition-colors">
              <td className="px-4 py-3">
                <p className="font-semibold text-slate-900 line-clamp-1">{book.title}</p>
                <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{book.authors}</p>
              </td>
              <td className="px-4 py-3 hidden md:table-cell">
                <span className="text-xs bg-[#e8f0f9] text-[#06377a] font-medium px-2 py-0.5 rounded-full">
                  {book.category_label}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-500 text-xs hidden lg:table-cell">{book.publisher}</td>
              <td className="px-4 py-3 text-right font-semibold text-slate-900 tabular-nums">
                ₹{Number(book.price).toLocaleString("en-IN")}
              </td>
              <td className="px-4 py-3 text-right">
                {editing === book.id ? (
                  <input
                    type="number"
                    min={0}
                    value={draftStock}
                    onChange={(e) => setDraftStock(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveStock(book.id);
                      if (e.key === "Escape") cancelEdit();
                    }}
                    className="w-16 text-right px-2 py-1 border border-[#06377a] rounded-lg text-sm font-semibold focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <span className={`font-semibold tabular-nums ${book.stock < 10 ? "text-red-600" : "text-slate-900"}`}>
                    {book.stock}
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  {editing === book.id ? (
                    <>
                      <button
                        onClick={() => saveStock(book.id)}
                        disabled={isPending}
                        className="w-7 h-7 flex items-center justify-center text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        aria-label="Save"
                      >
                        <IconCheck size={14} stroke={2.5} />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="w-7 h-7 flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                        aria-label="Cancel"
                      >
                        <IconX size={14} stroke={2.5} />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startEdit(book)}
                      className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-[#06377a] hover:bg-[#e8f0f9] rounded-lg transition-colors"
                      aria-label="Edit stock"
                    >
                      <IconPencil size={14} stroke={1.75} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
