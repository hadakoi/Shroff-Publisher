import Link from "next/link";
import { IconArrowLeft, IconHammer } from "@tabler/icons-react";

export default function UnderConstruction({ title }: { title: string }) {
  return (
    <div className="min-h-[calc(100dvh-92px)] bg-white flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 bg-[#06377a]/10 rounded-2xl flex items-center justify-center mb-6">
        <IconHammer size={30} stroke={1.5} className="text-[#06377a]" />
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
        {title}
      </h1>
      <p className="text-base text-slate-500 max-w-sm mb-8">
        This page is under construction. Check back soon.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#06377a] rounded-lg hover:bg-[#052d60] transition-colors"
      >
        <IconArrowLeft stroke={2} size={15} />
        Back to Home
      </Link>
    </div>
  );
}
