"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/Toast";
import { IconX } from "@tabler/icons-react";

export default function LoginPage() {
  const { user, login } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Already logged in
  if (user) {
    router.replace("/account");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      showToast("Logged in successfully.");
      router.push("/");
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#06377a]/20 focus:border-[#06377a] transition-colors";

  return (
    <div className="min-h-[calc(100dvh-83px)] sm:min-h-[calc(100dvh-92px)] bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 pt-6 pb-2">
            <h1 className="text-xl font-bold text-slate-900">Log in</h1>
            <p className="text-sm text-slate-500 mt-1">Welcome back to Shroff Publishers.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Password</label>
              <input
                type="password"
                placeholder="Min. 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                className={inputClass}
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 px-3 py-2 bg-red-50 border border-red-100 rounded-lg">
                <IconX size={13} stroke={2.5} className="text-red-500 mt-0.5 shrink-0" />
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-sm font-semibold text-white bg-[#06377a] rounded-lg hover:bg-[#052d60] active:scale-[0.98] transition-all disabled:opacity-60"
            >
              {loading ? "Please wait…" : "Sign In"}
            </button>

            <p className="text-center text-xs text-slate-400">
              No account?{" "}
              <Link href="/register" className="text-[#06377a] font-medium hover:underline">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
