export default function AdminLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div>
        <div className="h-7 bg-slate-200 rounded w-40 mb-2" />
        <div className="h-4 bg-slate-100 rounded w-64" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="w-10 h-10 bg-slate-100 rounded-xl" />
            <div className="h-7 bg-slate-200 rounded w-16" />
            <div className="h-4 bg-slate-100 rounded w-28" />
          </div>
        ))}
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-slate-50 last:border-0">
            <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 bg-slate-200 rounded w-40" />
              <div className="h-3 bg-slate-100 rounded w-56" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
