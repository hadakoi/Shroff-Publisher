import Image from "next/image";
import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import data from "@/data/books.json";

const heroBooks = [
  data.books[0],   // Large Language Models   - top-left
  data.books[6],   // Gen AI on Kubernetes    - top-right
  data.books[13],  // RAG with Python         - bottom-left
  data.books[24],  // Gen AI for Software Dev - bottom-right
  data.books[28],  // Machine Learning        - center (featured)
];

export default function Hero() {
  return (
    <section className="bg-white border-b border-slate-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center py-12 lg:py-24">

          {/* Left */}
          <div>
            <p className="text-xs font-semibold text-[#06377a] uppercase tracking-widest mb-5">
              India's Leading Technical Book Distributor
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight text-slate-900 leading-[1.08] mb-6">
              Technical Books.<br />
              Expert Knowledge.
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed mb-8 max-w-[42ch]">
              Curated titles from O'Reilly, Packt, and top publishers. Programming, AI, data science and more.
            </p>
            <Link
              href="/books"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#06377a] rounded-lg hover:bg-[#052d60] transition-colors active:scale-[0.98]"
            >
              Browse Catalog
              <IconArrowRight stroke={2} size={15} />
            </Link>
          </div>

          {/* Right - Book collage, visible on all screen sizes */}
          <div className="relative h-[340px] sm:h-[410px] lg:h-[520px]">

            {/* Top-left */}
            <Link href={`/books/${heroBooks[0].id}`} className="absolute top-3 left-2 lg:top-4 lg:left-4 w-[8rem] lg:w-[11.5rem] aspect-[3/4] -rotate-6 hover:rotate-0 transition-transform duration-300 rounded-lg overflow-hidden shadow-md hover:shadow-lg z-[3] block">
              <Image
                src={heroBooks[0].cover}
                alt={heroBooks[0].title}
                fill
                loading="eager"
                className="object-cover"
                sizes="(max-width: 1024px) 128px, 184px"
                unoptimized
              />
            </Link>

            {/* Top-right */}
            <Link href={`/books/${heroBooks[1].id}`} className="absolute top-2 right-2 lg:top-4 lg:right-4 w-[7rem] lg:w-[10rem] aspect-[3/4] rotate-6 hover:rotate-0 transition-transform duration-300 rounded-lg overflow-hidden shadow-md hover:shadow-lg z-[3] block">
              <Image
                src={heroBooks[1].cover}
                alt={heroBooks[1].title}
                fill
                loading="eager"
                className="object-cover"
                sizes="(max-width: 1024px) 112px, 160px"
                unoptimized
              />
            </Link>

            {/* Bottom-left */}
            <Link href={`/books/${heroBooks[2].id}`} className="absolute bottom-3 left-2 lg:bottom-4 lg:left-4 w-[9rem] lg:w-[13rem] aspect-[3/4] rotate-3 hover:rotate-0 transition-transform duration-300 rounded-lg overflow-hidden shadow-md hover:shadow-lg z-[3] block">
              <Image
                src={heroBooks[2].cover}
                alt={heroBooks[2].title}
                fill
                loading="eager"
                className="object-cover"
                sizes="(max-width: 1024px) 144px, 208px"
                unoptimized
              />
            </Link>

            {/* Bottom-right */}
            <Link href={`/books/${heroBooks[3].id}`} className="absolute bottom-2 right-2 lg:bottom-4 lg:right-4 w-[8rem] lg:w-[11.5rem] aspect-[3/4] -rotate-3 hover:rotate-0 transition-transform duration-300 rounded-lg overflow-hidden shadow-md hover:shadow-lg z-[3] block">
              <Image
                src={heroBooks[3].cover}
                alt={heroBooks[3].title}
                fill
                loading="eager"
                className="object-cover"
                sizes="(max-width: 1024px) 128px, 184px"
                unoptimized
              />
            </Link>

            {/* Center - featured */}
            <Link href={`/books/${heroBooks[4].id}`} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 block">
              <div className="relative w-[9.5rem] lg:w-[14rem] aspect-[3/4] rounded-lg overflow-hidden shadow-xl hover:scale-105 transition-transform duration-300">
                <Image
                  src={heroBooks[4].cover}
                  alt={heroBooks[4].title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 152px, 224px"
                  priority
                  unoptimized
                />
              </div>
            </Link>

          </div>

        </div>
      </div>
    </section>
  );
}
