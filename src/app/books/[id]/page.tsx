import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { IconArrowLeft, IconCheck } from "@tabler/icons-react";
import data from "@/data/books.json";
import BookCard from "@/components/BookCard";
import BookActions from "./BookActions";
import { getStockStatus } from "@/lib/bookInventory";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface BookDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { id } = await params;
  const book = data.books.find((b) => b.id === id);

  if (!book) {
    notFound();
  }

  const relatedBooks = data.books
    .filter((b) => b.category === book.category && b.id !== book.id)
    .slice(0, 4);

  const supabase = await createSupabaseServerClient();
  const { data: dbBook } = await supabase
    .from("books")
    .select("stock")
    .eq("id", id)
    .maybeSingle();
  const stock = dbBook?.stock ?? 0;
  const stockStatus = getStockStatus(stock);

  return (
    <div className="bg-white min-h-[100dvh]">
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/books"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            <IconArrowLeft stroke={2} size={16} />
            Back to browsing books
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left - Cover */}
          <div className="flex justify-center lg:justify-start">
            <div className="w-full max-w-[415px]">
              <Image
                src={book.cover}
                alt={book.title}
                width={415}
                height={553}
                className="w-full h-auto rounded-xl shadow-lg block"
                priority
                unoptimized
              />
            </div>
          </div>

          {/* Right - Details */}
          <div className="flex flex-col">
            {/* Publisher Badge */}
            <span className="inline-flex items-center self-start px-3 py-1 text-xs font-semibold text-[#06377a] bg-[#06377a]/10 rounded-full mb-4">
              {book.publisher}
            </span>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
              {book.title}
            </h1>

            {/* Author */}
            <p className="text-lg text-slate-600 mb-6">{book.authors}</p>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-slate-900">{book.price}</span>
              <span className="text-sm text-slate-500">Incl. GST</span>
            </div>

            {/* Availability */}
            <div className={`flex items-center gap-2 text-sm mb-6 ${stockStatus.tone}`}>
              <IconCheck stroke={2} size={16} className="text-emerald-600" />
              <span className="font-medium">{stockStatus.label}</span>
              <span className="text-slate-400">| Ships within 24 hours</span>
            </div>

            {/* CTAs */}
            <BookActions book={{
              id: book.id,
              title: book.title,
              authors: book.authors,
              price: book.price,
              priceValue: book.priceValue,
              cover: book.cover,
              publisher: book.publisher,
            }} />

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-3">About this book</h2>
              <p className="text-slate-600 leading-relaxed">{book.description}</p>
            </div>

            {/* Details */}
            <div className="border-t border-slate-200 pt-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Book Details</h2>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-slate-500 mb-1">ISBN</dt>
                  <dd className="text-sm font-medium text-slate-900">{book.id}</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500 mb-1">Publisher</dt>
                  <dd className="text-sm font-medium text-slate-900">{book.publisher}</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500 mb-1">Category</dt>
                  <dd className="text-sm font-medium text-slate-900">{book.categoryLabel}</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500 mb-1">Format</dt>
                  <dd className="text-sm font-medium text-slate-900">Paperback</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500 mb-1">Stock</dt>
                  <dd className={`text-sm font-medium ${stockStatus.tone}`}>
                    {stock} {stock === 1 ? "copy" : "copies"} available
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Related Books */}
      {relatedBooks.length > 0 && (
        <div className="bg-slate-50 border-t border-slate-200">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-8">
              More from {book.categoryLabel}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function generateStaticParams() {
  return data.books.map((book) => ({
    id: book.id,
  }));
}

export async function generateMetadata({ params }: BookDetailPageProps) {
  const { id } = await params;
  const book = data.books.find((b) => b.id === id);
  if (!book) {
    return {
      title: "Book Not Found",
    };
  }
  return {
    title: `${book.title} | Shroff Publishers`,
    description: book.description,
  };
}
