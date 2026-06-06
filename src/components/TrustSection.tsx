const stats = [
  { value: "34+", label: "Years in Business", sub: "Est. 1990" },
  { value: "36+", label: "Titles Available", sub: "Across 3 categories" },
  { value: "6",   label: "Publisher Partners", sub: "World's best" },
];

const publishers = [
  { name: "O'Reilly Media",         abbr: "ORM" },
  { name: "Packt Publishing",        abbr: "PKT" },
  { name: "Apress",                  abbr: "APR" },
  { name: "Manning Publications",    abbr: "MAN" },
  { name: "No Starch Press",         abbr: "NSP" },
  { name: "Business Expert Press",   abbr: "BEP" },
];

export default function TrustSection() {
  return (
    <section className="bg-slate-50 border-y border-slate-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-10">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center px-4 py-5 sm:py-6 bg-white rounded-xl border border-slate-200 shadow-sm"
            >
              <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#06377a] tracking-tight leading-none mb-1">
                {stat.value}
              </span>
              <span className="text-[13px] sm:text-sm font-semibold text-slate-800 mt-2 mb-0.5">
                {stat.label}
              </span>
              <span className="text-[11px] text-slate-400 font-medium hidden sm:block">
                {stat.sub}
              </span>
            </div>
          ))}
        </div>

        {/* Publisher chips */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
            Publisher Partners
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {publishers.map((pub) => (
              <span
                key={pub.name}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-slate-200 rounded-full text-[13px] font-medium text-slate-700 shadow-sm"
              >
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#06377a] text-white text-[9px] font-bold tracking-wide shrink-0">
                  {pub.abbr.slice(0, 2)}
                </span>
                {pub.name}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
