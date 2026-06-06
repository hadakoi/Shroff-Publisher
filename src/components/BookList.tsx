"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { IconX } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import BookCard from "@/components/BookCard";
import data from "@/data/books.json";
import { matchesBookQuery, type BookRecord } from "@/lib/books";

type Book = BookRecord;

interface CategoryData {
  id: string;
  label: string;
  description: string;
  count: number;
  featuredBook: string;
  color: string;
}

const PRICE_BANDS = [
  { label: "Under ₹1,000", min: 0, max: 999 },
  { label: "₹1,000 – ₹1,500", min: 1000, max: 1500 },
  { label: "₹1,500 – ₹2,000", min: 1500, max: 2000 },
  { label: "Above ₹2,000", min: 2000, max: Infinity },
];

// Shorten publisher names for chips
const PUBLISHER_LABELS: Record<string, string> = {
  "Shroff/O'Reilly": "O'Reilly",
  "Shroff/Rheinwerk": "Rheinwerk",
  "Shroff/X-Team": "X-Team",
  "Shroff/Business Expert Press": "Business Expert Press",
  "Shroff Publishers & Distributors Pvt. Ltd.": "Shroff",
  "Qurate Books Pvt. Ltd.": "Qurate",
};

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-[13px] font-medium rounded-full border transition-colors whitespace-nowrap ${
        active
          ? "bg-[#06377a] text-white border-[#06377a]"
          : "bg-white text-slate-600 border-slate-200 hover:border-[#06377a]/50 hover:text-[#06377a]"
      }`}
    >
      {label}
    </button>
  );
}

export default function BookList({
  categoryId,
  categoryData,
  searchQuery,
  initialCategory,
}: {
  categoryId?: string;
  categoryData?: CategoryData;
  searchQuery?: string;
  initialCategory?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "newest">("newest");
  const [selectedPublishers, setSelectedPublishers] = useState<Set<string>>(new Set());
  const [selectedPriceBand, setSelectedPriceBand] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory ?? null);
  const activeSearchQuery = searchQuery?.trim() ?? "";

  const clearSearchQuery = () => {
    if (!activeSearchQuery) return;
    router.replace(pathname);
  };

  const togglePublisher = (pub: string) => {
    setSelectedPublishers((prev) => {
      const next = new Set(prev);
      if (next.has(pub)) {
        next.delete(pub);
      } else {
        next.add(pub);
      }
      return next;
    });
  };

  const togglePriceBand = (idx: number) =>
    setSelectedPriceBand((prev) => (prev === idx ? null : idx));

  const toggleCategory = (id: string) =>
    setSelectedCategory((prev) => (prev === id ? null : id));

  const clearAll = () => {
    setSelectedPublishers(new Set());
    setSelectedPriceBand(null);
    setSelectedCategory(null);
    clearSearchQuery();
  };

  const activeFilterCount =
    selectedPublishers.size +
    (selectedPriceBand !== null ? 1 : 0) +
    (selectedCategory ? 1 : 0) +
    (activeSearchQuery ? 1 : 0);

  const filteredBooks = useMemo(() => {
    let books = data.books as Book[];
    const query = activeSearchQuery;

    // Category from route takes priority over chip selection
    const catFilter = categoryId ?? selectedCategory;
    if (catFilter) books = books.filter((b) => b.category === catFilter);

    if (selectedPublishers.size > 0)
      books = books.filter((b) => selectedPublishers.has(b.publisher));

    if (selectedPriceBand !== null) {
      const band = PRICE_BANDS[selectedPriceBand];
      books = books.filter(
        (b) => b.priceValue >= band.min && b.priceValue <= band.max
      );
    }

    if (query) {
      books = books.filter((book) => matchesBookQuery(book, query));
    }

    if (sortBy === "price-asc")
      books = [...books].sort((a, b) => a.priceValue - b.priceValue);
    else if (sortBy === "price-desc")
      books = [...books].sort((a, b) => b.priceValue - a.priceValue);

    return books;
  }, [activeSearchQuery, categoryId, selectedCategory, selectedPublishers, selectedPriceBand, sortBy]);

  return (
    <div className="bg-white min-h-[100dvh]">

      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <Link href="/" className="hover:text-slate-700 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/books" className="hover:text-slate-700 transition-colors">Books</Link>
            {categoryData && (
              <>
                <span>/</span>
                <span className="text-slate-900 font-medium">{categoryData.label}</span>
              </>
            )}
          </nav>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-1">
            {categoryData ? categoryData.label : "All Books"}
          </h1>
          <p className="text-sm text-slate-500">
            {filteredBooks.length} {filteredBooks.length === 1 ? "title" : "titles"} found
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        <div className="flex gap-10">

          {/* Sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-28 max-h-[calc(100dvh-9rem)] overflow-y-auto pr-2 space-y-7">

              {/* Header row */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900">
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#06377a] text-white text-[10px] font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </span>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-xs text-[#06377a] hover:text-[#052d60] font-medium"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Category — only on All Books, not category pages */}
              {!categoryId && (
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-3">
                    Category
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {data.categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id)}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-colors text-left ${
                          selectedCategory === cat.id
                            ? "bg-[#06377a] text-white"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        <span>{cat.label}</span>
                        <span className={`text-[11px] ${selectedCategory === cat.id ? "text-blue-200" : "text-slate-400"}`}>
                          {cat.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price */}
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-3">
                  Price Range
                </p>
                <div className="flex flex-col gap-1.5">
                  {PRICE_BANDS.map((band, idx) => (
                    <button
                      key={band.label}
                      onClick={() => togglePriceBand(idx)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-colors text-left ${
                        selectedPriceBand === idx
                          ? "bg-[#06377a] text-white"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      {band.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Publisher */}
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-3">
                  Publisher
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {data.publishers.map((pub) => (
                    <Chip
                      key={pub}
                      label={PUBLISHER_LABELS[pub] ?? pub}
                      active={selectedPublishers.has(pub)}
                      onClick={() => togglePublisher(pub)}
                    />
                  ))}
                </div>
              </div>

            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">

              {/* Active filter tags */}
              <div className="flex flex-wrap items-center gap-2">
                {selectedCategory && !categoryId && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#e8f0f9] text-[#06377a] text-[12px] font-semibold rounded-full">
                    {data.categories.find((c) => c.id === selectedCategory)?.label}
                    <button onClick={() => setSelectedCategory(null)} aria-label="Remove filter">
                      <IconX size={11} stroke={2.5} />
                    </button>
                  </span>
                )}
                {selectedPriceBand !== null && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#e8f0f9] text-[#06377a] text-[12px] font-semibold rounded-full">
                    {PRICE_BANDS[selectedPriceBand].label}
                    <button onClick={() => setSelectedPriceBand(null)} aria-label="Remove filter">
                      <IconX size={11} stroke={2.5} />
                    </button>
                  </span>
                )}
                {[...selectedPublishers].map((pub) => (
                  <span key={pub} className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#e8f0f9] text-[#06377a] text-[12px] font-semibold rounded-full">
                    {PUBLISHER_LABELS[pub] ?? pub}
                    <button onClick={() => togglePublisher(pub)} aria-label="Remove filter">
                      <IconX size={11} stroke={2.5} />
                    </button>
                  </span>
                ))}
                {activeSearchQuery && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#e8f0f9] text-[#06377a] text-[12px] font-semibold rounded-full">
                    {activeSearchQuery}
                    <button onClick={clearSearchQuery} aria-label="Clear search">
                      <IconX size={11} stroke={2.5} />
                    </button>
                  </span>
                )}
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#06377a]/20 focus:border-[#06377a] outline-none"
              >
                <option value="newest">Newest first</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {/* Mobile filter chips */}
            <div className="lg:hidden mb-5 space-y-3">
              {!categoryId && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {data.categories.map((cat) => (
                    <Chip
                      key={cat.id}
                      label={cat.label}
                      active={selectedCategory === cat.id}
                      onClick={() => toggleCategory(cat.id)}
                    />
                  ))}
                </div>
              )}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {PRICE_BANDS.map((band, idx) => (
                  <Chip
                    key={band.label}
                    label={band.label}
                    active={selectedPriceBand === idx}
                    onClick={() => togglePriceBand(idx)}
                  />
                ))}
              </div>
            </div>

            {/* Grid */}
            {filteredBooks.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg font-semibold text-slate-700 mb-2">
                  {activeSearchQuery ? `No titles match "${activeSearchQuery}"` : "No titles match"}
                </p>
                <p className="text-sm text-slate-500 mb-4">Try adjusting or clearing your filters.</p>
                <button
                  onClick={clearAll}
                  className="px-4 py-2 text-sm font-semibold text-white bg-[#06377a] rounded-lg hover:bg-[#052d60] transition-colors"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
