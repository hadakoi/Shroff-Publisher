import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { IconBook, IconUsers, IconShoppingCart, IconCurrencyRupee } from "@tabler/icons-react";

// Supabase returns opaque Json for nested selects without generated types.
// This interface narrows the shape we actually query.
interface CartItemBookPrice {
  price: number;
}

export default async function AdminDashboard() {
  const supabase = await createSupabaseServerClient();

  const [
    { count: bookCount },
    { count: userCount },
    { count: cartCount },
    { data: cartItems },
  ] = await Promise.all([
    supabase.from("books").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("carts").select("*", { count: "exact", head: true }),
    supabase.from("cart_items").select("quantity, books(price)"),
  ]);

  const totalCartValue = (cartItems ?? []).reduce((sum, row) => {
    const price = (row.books as unknown as CartItemBookPrice | null)?.price ?? 0;
    return sum + price * row.quantity;
  }, 0);

  const stats = [
    { label: "Total Books", value: bookCount ?? 0, icon: IconBook, color: "bg-blue-50 text-[#06377a]" },
    { label: "Registered Users", value: userCount ?? 0, icon: IconUsers, color: "bg-emerald-50 text-emerald-700" },
    { label: "Active Carts", value: cartCount ?? 0, icon: IconShoppingCart, color: "bg-amber-50 text-amber-700" },
    {
      label: "Total Cart Value",
      value: `₹${totalCartValue.toLocaleString("en-IN")}`,
      icon: IconCurrencyRupee,
      color: "bg-violet-50 text-violet-700",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Overview of your store</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
              <Icon size={20} stroke={1.75} />
            </div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-sm text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900 mb-1">Quick actions</h2>
        <p className="text-xs text-slate-400 mb-4">Manage your store from the sidebar.</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/books" className="px-4 py-2 text-sm font-semibold text-white bg-[#06377a] rounded-lg hover:bg-[#052d60] transition-colors">
            Manage Books
          </Link>
          <Link href="/admin/users" className="px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            View Users
          </Link>
        </div>
      </div>
    </div>
  );
}
