import Image from "next/image";
import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import data from "@/data/books.json";

const categories = data.categories;

export default function CategoriesSection() {
  return (
    <section className="py-16 lg:py-24 bg-slate-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Browse by Category
          </h2>
          <p className="text-base text-slate-500 max-w-lg">
            Explore titles across key technology domains, curated by topic.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const featuredBook = data.books.find(
              (b) => b.id === category.featuredBook
            );

            return (
              <Link
                key={category.id}
                href={`/books?category=${category.id}`}
                className="group flex gap-5 items-start p-5 bg-white rounded-xl border border-slate-200 hover:border-[#06377a]/40 hover:shadow-md transition-all duration-200"
              >
                {/* Book cover - larger and square aspect */}
                {featuredBook && (
                  <div className="relative w-20 shrink-0 aspect-[3/4] rounded overflow-hidden shadow-sm bg-slate-100">
                    <Image
                      src={featuredBook.cover}
                      alt={featuredBook.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="80px"
                      unoptimized
                    />
                  </div>
                )}

                {/* Text */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <h3 className="text-[15px] font-bold text-slate-900 group-hover:text-[#06377a] transition-colors mb-1 leading-snug">
                    {category.label}
                  </h3>
                  <p className="text-[13px] text-slate-500 leading-snug mb-3 line-clamp-2">
                    {category.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#06377a]">
                    {category.count} books
                    <IconArrowRight
                      stroke={2}
                      size={13}
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
