"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getSupabaseBrowserClient, hasSupabaseCredentials } from "@/lib/supabase/client";
import { queueToast } from "@/components/Toast";

interface User {
  id: string;
  name: string;
  email: string;
  address?: string;
  pincode?: string;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  hydrated: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (name: string, email: string, password: string, address: string, pincode: string) => Promise<{ error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!hasSupabaseCredentials()) {
      // Fall back to localStorage mock when Supabase isn't configured yet
      try {
        const stored = localStorage.getItem("shroff_user");
        if (stored) setUser(JSON.parse(stored));
      } catch {}
      setHydrated(true);
      return;
    }

    const supabase = getSupabaseBrowserClient()!;

    const checkAdmin = async (userId: string) => {
      const { data } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", userId)
        .maybeSingle();
      setIsAdmin(!!data);
    };

    const fetchProfile = async (userId: string) => {
      const { data } = await supabase
        .from("profiles")
        .select("address, pincode")
        .eq("user_id", userId)
        .maybeSingle();
      return { address: data?.address ?? undefined, pincode: data?.pincode ?? undefined };
    };

    // Get current session on mount
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        const profile = await fetchProfile(data.user.id);
        setUser({
          id: data.user.id,
          name: data.user.user_metadata?.full_name ?? data.user.email ?? "",
          email: data.user.email ?? "",
          ...profile,
        });
        checkAdmin(data.user.id);
      }
      setHydrated(true);
    });

    // Keep in sync with auth state changes (login, logout, token refresh).
    // The callback must be synchronous — supabase-js awaits it before resolving
    // signInWithPassword, so any await here blocks the login call from returning.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // Set basic identity immediately so the UI unblocks right away,
        // then enrich with profile data asynchronously.
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.full_name ?? session.user.email ?? "",
          email: session.user.email ?? "",
        });
        // Fire-and-forget: don't block the auth state change notification
        fetchProfile(session.user.id).then((profile) => {
          setUser((prev) => prev ? { ...prev, ...profile } : prev);
        });
        checkAdmin(session.user.id);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    if (!email.trim() || !password) return { error: "Please fill in all fields." };

    if (!hasSupabaseCredentials()) {
      // localStorage fallback
      if (password.length < 6) return { error: "Password must be at least 6 characters." };
      try {
        const accounts: Record<string, { name: string; password: string }> =
          JSON.parse(localStorage.getItem("shroff_accounts") || "{}");
        const account = accounts[email.toLowerCase().trim()];
        if (!account) return { error: "No account found with this email." };
        if (account.password !== password) return { error: "Incorrect password." };
        const u: User = { id: "local", name: account.name, email: email.toLowerCase().trim() };
        setUser(u);
        localStorage.setItem("shroff_user", JSON.stringify(u));
        return {};
      } catch {
        return { error: "Something went wrong." };
      }
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return { error: "Auth client not available. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY." };

    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      if (error.message.includes("Invalid login")) return { error: "Incorrect email or password." };
      return { error: error.message };
    }
    return {};
  };

  const register = async (name: string, email: string, password: string, address: string, pincode: string): Promise<{ error?: string }> => {
    if (!name.trim() || !email.trim() || !password || !address.trim() || !pincode.trim())
      return { error: "Please fill in all fields." };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return { error: "Please enter a valid email address." };
    if (password.length < 6) return { error: "Password must be at least 6 characters." };
    if (!/^\d{6}$/.test(pincode.trim())) return { error: "Pincode must be a 6-digit number." };

    if (!hasSupabaseCredentials()) {
      // localStorage fallback
      try {
        const accounts: Record<string, { name: string; password: string; address: string; pincode: string }> =
          JSON.parse(localStorage.getItem("shroff_accounts") || "{}");
        const key = email.toLowerCase().trim();
        if (accounts[key]) return { error: "An account with this email already exists." };
        accounts[key] = { name: name.trim(), password, address: address.trim(), pincode: pincode.trim() };
        localStorage.setItem("shroff_accounts", JSON.stringify(accounts));
        const u: User = { id: "local", name: name.trim(), email: key, address: address.trim(), pincode: pincode.trim() };
        setUser(u);
        localStorage.setItem("shroff_user", JSON.stringify(u));
        return {};
      } catch {
        return { error: "Something went wrong." };
      }
    }

    const supabase = getSupabaseBrowserClient()!;
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: name.trim() } },
    });

    if (error) {
      if (error.message.includes("already registered")) return { error: "An account with this email already exists." };
      return { error: error.message };
    }

    // Create profile row (best-effort — a DB trigger is the safer long-term approach)
    if (data.user) {
      await supabase.from("profiles").upsert({
        user_id: data.user.id,
        full_name: name.trim(),
        email: email.trim().toLowerCase(),
        address: address.trim(),
        pincode: pincode.trim(),
      });
      // onAuthStateChange fires before the upsert completes, so patch user state here
      setUser((prev) =>
        prev ? { ...prev, address: address.trim(), pincode: pincode.trim() } : prev
      );
    }

    return {};
  };

  const logout = async () => {
    if (hasSupabaseCredentials()) {
      const supabase = getSupabaseBrowserClient();
      await supabase?.auth.signOut();
    } else {
      setUser(null);
      localStorage.removeItem("shroff_user");
    }
    queueToast("Logged out successfully.");
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, hydrated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
