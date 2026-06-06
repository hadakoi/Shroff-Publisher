import Hero from "@/components/Hero";
import CategoriesSection from "@/components/CategoriesSection";
import TrustSection from "@/components/TrustSection";
import NewsletterSection from "@/components/NewsletterSection";
import BookCard from "@/components/BookCard";
import data from "@/data/books.json";
import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";

export default function HomePage() {
  const featuredBooks = data.books.slice(0, 8);

  return (
    <div>
      <Hero />
      <TrustSection />
      <CategoriesSection />

      {/* Featured Books */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
              New Releases
            </h2>
            <p className="text-base text-slate-500 mb-4">
              Handpicked titles our readers love.
            </p>
            <Link
              href="/books"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#06377a] hover:text-[#052d60] transition-colors"
            >
              View All Books
              <IconArrowRight stroke={2} size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

        </div>
      </section>

      <NewsletterSection />
    </div>
  );
}
