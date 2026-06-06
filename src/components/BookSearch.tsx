"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconSearch, IconArrowRight, IconX } from "@tabler/icons-react";
import { searchBooks } from "@/lib/books";

export default function BookSearch({
  className = "",
  inputClassName = "",
}: {
  className?: string;
  inputClassName?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const urlQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [open, setOpen] = useState(false);
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    setQuery(urlQuery);
  }, [pathname, urlQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const results = useMemo(() => searchBooks(deferredQuery, 6), [deferredQuery]);
  const trimmedQuery = query.trim();
  const showResults = open && (trimmedQuery.length > 0 || results.length > 0);

  const submitSearch = () => {
    const nextQuery = query.trim();
    if (!nextQuery) return;

    setOpen(false);
    const target = `/books?q=${encodeURIComponent(nextQuery)}`;
    router.push(target);
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitSearch();
        }}
        className="relative"
      >
        <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
          <IconSearch size={16} stroke={1.8} />
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search books or authors..."
          className={`w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-[#06377a] focus:ring-2 focus:ring-[#06377a]/10 ${inputClassName}`}
          aria-label="Search books"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setOpen(true);
            }}
            className="absolute inset-y-0 right-2.5 flex items-center justify-center rounded-lg px-2 text-slate-400 transition-colors hover:text-slate-700"
            aria-label="Clear search"
          >
            <IconX size={14} stroke={2.2} />
          </button>
        )}
      </form>

      {showResults && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {trimmedQuery ? "Search results" : "Popular titles"}
              </p>
              <p className="text-xs text-slate-500">
                {trimmedQuery ? `Showing matches for "${trimmedQuery}"` : "Start typing to search the catalog"}
              </p>
            </div>
            {trimmedQuery && (
              <Link
                href={`/books?q=${encodeURIComponent(trimmedQuery)}`}
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#06377a] hover:text-[#052d60]"
              >
                View all
                <IconArrowRight size={14} stroke={2} />
              </Link>
            )}
          </div>

          <div className="max-h-[26rem] overflow-y-auto">
            {results.length === 0 ? (
              <div className="px-4 py-8 text-sm text-slate-500">
                No books match this search.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {results.map((book) => (
                  <Link
                    key={book.id}
                    href={`/books/${book.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50"
                  >
                    <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-md bg-slate-100">
                      <Image
                        src={book.cover}
                        alt={book.title}
                        fill
                        className="object-cover"
                        sizes="44px"
                        unoptimized
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {book.title}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {book.authors}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-xs">
                        <span className="font-semibold text-slate-900">{book.price}</span>
                        <span className="text-slate-300">•</span>
                        <span className="truncate text-slate-500">{book.publisher}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
