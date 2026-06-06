"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart, MAX_QUANTITY } from "@/context/CartContext";
import { useToast } from "@/components/Toast";
import BookSearch from "@/components/BookSearch";
import {
  IconX,
  IconMenu,
  IconUser,
  IconShoppingCart,
  IconSearch,
  IconHome,
  IconBook,
  IconInfoCircle,
  IconMail,
  IconMinus,
  IconPlus,
  IconTrash,
  IconLogout,
  IconChevronRight,
  IconShield,
} from "@tabler/icons-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  activeMatch: string;
}

const navigationItems: NavItem[] = [
  { href: "/", label: "Home", icon: <IconHome stroke={1.5} size={18} />, activeMatch: "/" },
  { href: "/books", label: "Browse Books", icon: <IconBook stroke={1.5} size={18} />, activeMatch: "/books" },
];

const companyItems: NavItem[] = [
  { href: "/about-us", label: "About Us", icon: <IconInfoCircle stroke={1.5} size={18} />, activeMatch: "/about-us" },
  { href: "/contact-us", label: "Contact Us", icon: <IconMail stroke={1.5} size={18} />, activeMatch: "/contact-us" },
];

function MenuItem({ item, onClick, pathname }: { item: NavItem; onClick: () => void; pathname: string }) {
  const isActive = pathname === item.activeMatch || (item.activeMatch !== "/" && pathname.startsWith(item.activeMatch));
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`flex items-center gap-3 py-2.5 text-sm font-medium transition-colors relative ${
        isActive
          ? "text-[#06377a]"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md"
      }`}
    >
      {isActive && (
        <span className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#06377a] rounded-r-full" />
      )}
      <span className={isActive ? "text-[#06377a]" : "text-slate-400"}>{item.icon}</span>
      {item.label}
    </Link>
  );
}

function MenuGroup({ title, items, onClick, pathname }: { title: string; items: NavItem[]; onClick: () => void; pathname: string }) {
  return (
    <div className="mb-4">
      <div className="mb-1">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
      </div>
      <div className="space-y-0.5">
        {items.map((item) => (
          <MenuItem key={item.href} item={item} onClick={onClick} pathname={pathname} />
        ))}
      </div>
    </div>
  );
}

// ─── Auth Dropdown ────────────────────────────────────────────────────────────

function AuthDropdown({
  initialTab,
  onClose,
}: {
  initialTab: "login" | "register";
  onClose: () => void;
}) {
  const { user, isAdmin, login, register, logout } = useAuth();
  const { showToast } = useToast();
  const [tab, setTab] = useState<"login" | "register">(initialTab);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const switchTab = (t: "login" | "register") => {
    setTab(t);
    setError("");
    setName("");
    setEmail("");
    setPassword("");
    setAddress("");
    setPincode("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = tab === "login"
        ? await login(email, password)
        : await register(name, email, password, address, pincode);
      setLoading(false);
      if (result.error) setError(result.error);
      else {
        showToast(tab === "login" ? "Logged in successfully." : "Account created — welcome!");
        onClose();
      }
    } catch (err) {
      setLoading(false);
      setError("Something went wrong. Please try again.");
    }
  };

  const inputClass =
    "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#06377a]/20 focus:border-[#06377a] transition-colors";

  if (user) {
    return (
      <div className="absolute top-[calc(100%+10px)] right-0 w-64 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50">
        <div className="p-4 bg-[#e8f0f9]/40 border-b border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#06377a] flex items-center justify-center shrink-0">
            <span className="text-white text-sm font-bold">{user.name.charAt(0).toUpperCase()}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>
        </div>
        <div className="p-1.5">
          <Link
            href="/account"
            onClick={onClose}
            className="flex items-center justify-between gap-2 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <span className="flex items-center gap-2">
              <IconUser stroke={1.5} size={15} className="text-slate-400" />
              My Account
            </span>
            <IconChevronRight size={13} stroke={2} className="text-slate-300" />
          </Link>
          <Link
            href="/cart"
            onClick={onClose}
            className="flex items-center justify-between gap-2 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <span className="flex items-center gap-2">
              <IconShoppingCart stroke={1.5} size={15} className="text-slate-400" />
              My Cart
            </span>
            <IconChevronRight size={13} stroke={2} className="text-slate-300" />
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              onClick={onClose}
              className="flex items-center justify-between gap-2 px-3 py-2.5 text-sm text-[#06377a] hover:bg-[#e8f0f9] rounded-lg transition-colors"
            >
              <span className="flex items-center gap-2">
                <IconShield stroke={1.5} size={15} className="text-[#06377a]" />
                Admin Panel
              </span>
              <IconChevronRight size={13} stroke={2} className="text-[#06377a]/40" />
            </Link>
          )}
        </div>
        <div className="p-1.5 border-t border-slate-100">
          <button
            onClick={() => { logout(); onClose(); }}
            className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <IconLogout stroke={1.5} size={15} />
            Log Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-[calc(100%+10px)] right-0 w-[300px] bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50">
      {/* Tabs */}
      <div className="flex border-b border-slate-100">
        <button
          onClick={() => switchTab("login")}
          className={`flex-1 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
            tab === "login"
              ? "text-[#06377a] border-[#06377a]"
              : "text-slate-400 border-transparent hover:text-slate-600"
          }`}
        >
          Log In
        </button>
        <button
          onClick={() => switchTab("register")}
          className={`flex-1 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
            tab === "register"
              ? "text-[#06377a] border-[#06377a]"
              : "text-slate-400 border-transparent hover:text-slate-600"
          }`}
        >
          Register
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 space-y-3">
        {tab === "register" && (
          <>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="name"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Delivery Address</label>
              <input
                type="text"
                placeholder="Street, Area, City"
                value={address}
                onChange={e => setAddress(e.target.value)}
                autoComplete="street-address"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Pincode</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="6-digit pincode"
                value={pincode}
                onChange={e => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                autoComplete="postal-code"
                className={inputClass}
              />
            </div>
          </>
        )}
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
            autoComplete={tab === "login" ? "current-password" : "new-password"}
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
          {loading ? "Please wait…" : tab === "login" ? "Sign In" : "Create Account"}
        </button>

        <p className="text-center text-xs text-slate-400">
          {tab === "login" ? (
            <>No account?{" "}
              <button type="button" onClick={() => switchTab("register")} className="text-[#06377a] font-medium hover:underline">
                Register
              </button>
            </>
          ) : (
            <>Already have one?{" "}
              <button type="button" onClick={() => switchTab("login")} className="text-[#06377a] font-medium hover:underline">
                Log in
              </button>
            </>
          )}
        </p>
      </form>
    </div>
  );
}

// ─── Cart Dropdown ────────────────────────────────────────────────────────────

function CartDropdown({ onClose, onOpenAuth }: { onClose: () => void; onOpenAuth: () => void }) {
  const { user } = useAuth();
  const { items, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = useCart();

  const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

  if (!user) {
    return (
      <div className="absolute top-[calc(100%+10px)] right-0 w-[280px] bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50">
        <div className="px-5 py-7 text-center">
          <div className="w-12 h-12 bg-[#e8f0f9] rounded-full flex items-center justify-center mx-auto mb-3">
            <IconShoppingCart stroke={1.5} size={20} className="text-[#06377a]" />
          </div>
          <p className="text-sm font-semibold text-slate-900 mb-1">Sign in to view your cart</p>
          <p className="text-xs text-slate-500 mb-5">Log in or create an account to save items and checkout.</p>
          <div className="flex gap-2">
            <button
              onClick={onOpenAuth}
              className="flex-1 py-2 text-sm font-semibold text-white bg-[#06377a] rounded-lg hover:bg-[#052d60] transition-colors"
            >
              Log In
            </button>
            <Link
              href="/books"
              onClick={onClose}
              className="flex-1 py-2 text-center text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Browse
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-[calc(100%+10px)] right-0 w-[320px] bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-900">
          Cart
          {cartCount > 0 && (
            <span className="ml-1.5 text-slate-400 font-normal">({cartCount} {cartCount === 1 ? "item" : "items"})</span>
          )}
        </h3>
        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="text-[11px] font-medium text-slate-400 hover:text-red-500 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="px-4 py-8 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <IconShoppingCart stroke={1.5} size={22} className="text-slate-400" />
          </div>
          <p className="text-sm text-slate-500 mb-4">Your cart is empty</p>
          <Link
            href="/books"
            onClick={onClose}
            className="inline-block px-4 py-2 text-xs font-semibold text-white bg-[#06377a] rounded-lg hover:bg-[#052d60] transition-colors"
          >
            Browse Books
          </Link>
        </div>
      ) : (
        <>
          {/* Items */}
          <div className="max-h-[260px] overflow-y-auto divide-y divide-slate-50">
            {items.map(({ book, quantity }) => (
              <div key={book.id} className="flex gap-3 p-3 hover:bg-slate-50/60 transition-colors">
                {/* Cover */}
                <Link href={`/books/${book.id}`} onClick={onClose} className="shrink-0">
                  <div className="relative w-9 h-12 rounded overflow-hidden bg-slate-100 shadow-sm">
                    <Image
                      src={book.cover}
                      alt={book.title}
                      fill
                      className="object-cover"
                      sizes="36px"
                    />
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-900 line-clamp-2 leading-snug mb-1.5">
                    {book.title}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    {/* Qty controls */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(book.id, quantity - 1)}
                        className="w-5 h-5 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded text-slate-600 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <IconMinus size={9} stroke={2.5} />
                      </button>
                      <span className="text-xs font-bold text-slate-900 w-5 text-center tabular-nums">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(book.id, quantity + 1)}
                        disabled={quantity >= MAX_QUANTITY}
                        className="w-5 h-5 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded text-slate-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Increase quantity"
                      >
                        <IconPlus size={9} stroke={2.5} />
                      </button>
                    </div>
                    <span className="text-xs font-bold text-slate-800 tabular-nums">
                      {fmt(book.priceValue * quantity)}
                    </span>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(book.id)}
                  className="shrink-0 self-start mt-0.5 text-slate-300 hover:text-red-500 transition-colors"
                  aria-label="Remove from cart"
                >
                  <IconTrash size={14} stroke={1.5} />
                </button>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 p-3 space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs text-slate-500">Subtotal</span>
              <span className="text-sm font-bold text-slate-900 tabular-nums">{fmt(cartTotal)}</span>
            </div>
            <Link
              href="/cart"
              onClick={onClose}
              className="block w-full py-2.5 text-center text-sm font-semibold text-white bg-[#06377a] rounded-lg hover:bg-[#052d60] active:scale-[0.98] transition-all"
            >
              View Cart
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const authRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const { user, logout, hydrated: authHydrated } = useAuth();
  const { cartCount, hydrated: cartHydrated } = useCart();

  // Drawer open/close with animation
  useEffect(() => {
    if (menuOpen) {
      setMounted(true);
      // Double RAF guarantees the element is painted before the transition starts
      const id = requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
      document.body.style.overflow = "hidden";
      return () => cancelAnimationFrame(id);
    } else {
      setAnimate(false);
      const t = setTimeout(() => setMounted(false), 300);
      document.body.style.overflow = "";
      return () => clearTimeout(t);
    }
  }, [menuOpen]);

  // Close search panel on route change
  useEffect(() => { setSearchOpen(false); }, [pathname]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (authOpen && authRef.current && !authRef.current.contains(e.target as Node)) {
        setAuthOpen(false);
      }
      if (cartOpen && cartRef.current && !cartRef.current.contains(e.target as Node)) {
        setCartOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [authOpen, cartOpen]);

  // Close dropdowns on Escape
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") { setAuthOpen(false); setCartOpen(false); }
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const toggleAuth = (tab: "login" | "register" = "login") => {
    setCartOpen(false);
    setAuthTab(tab);
    setAuthOpen(prev => (authTab === tab ? !prev : true));
  };

  const toggleCart = () => {
    setAuthOpen(false);
    setCartOpen(prev => !prev);
  };

  const openAuthFromDrawer = (tab: "login" | "register") => {
    closeMenu();
    setAuthTab(tab);
    setCartOpen(false);
    setAuthOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/96 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-[1400px] mx-auto px-1.5 sm:px-2.5 lg:px-3">
          <div className="flex h-[83px] sm:h-[92px] items-center gap-2.5 lg:gap-3">

            {/* Left: Burger + Logo */}
            <div className="flex shrink-0 items-center gap-3">
              <button
                className={`flex items-center justify-center w-9 h-9 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200 ${menuOpen ? "rotate-90" : "rotate-0"}`}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                {menuOpen ? <IconX stroke={1.5} size={18} /> : <IconMenu stroke={1.5} size={18} />}
              </button>

              <Link href="/" className="flex items-center shrink-0">
                <div className="relative h-[69px] w-[19.5rem] sm:h-[77px] sm:w-[21.75rem]">
                  <Image
                    src="/logo.png"
                    alt="Shroff Publishers"
                    fill
                    className="object-contain object-left"
                    priority
                    sizes="300px"
                  />
                </div>
              </Link>
            </div>

            {/* Center search */}
            <div className="hidden xl:block flex-1 min-w-0 pl-4 pr-1.5">
              <Suspense fallback={<div className="h-[44px] w-full rounded-xl border border-slate-200 bg-white shadow-sm" />}>
                <BookSearch className="w-full" inputClassName="py-2.5" />
              </Suspense>
            </div>

            {/* Right: Search icon (mobile) + Cart + Account */}
            <div className="ml-auto flex shrink-0 items-center gap-1">
              {/* Search toggle — visible below xl where the center search bar is hidden */}
              <button
                onClick={() => setSearchOpen(prev => !prev)}
                className={`xl:hidden flex items-center justify-center w-9 h-9 rounded-md transition-colors ${
                  searchOpen ? "text-[#06377a] bg-[#e8f0f9]" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
                aria-label="Search"
              >
                {searchOpen ? <IconX stroke={1.5} size={18} /> : <IconSearch stroke={1.5} size={18} />}
              </button>

              {/* Cart + Account — hidden on mobile, shown sm+ */}
              <div className="hidden sm:flex items-center gap-1">
              {/* Cart button + dropdown */}
              <div className="relative" ref={cartRef}>
                <button
                  onClick={toggleCart}
                  className={`relative flex items-center justify-center w-9 h-9 rounded-md transition-colors ${
                    cartOpen || pathname === "/cart"
                      ? "text-[#06377a] bg-[#e8f0f9]"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                  aria-label="Shopping cart"
                  aria-expanded={cartOpen}
                >
                  <IconShoppingCart stroke={1.5} size={18} />
                  {cartHydrated && cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center bg-[#06377a] text-white text-[10px] font-bold rounded-full tabular-nums">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </button>

                {cartOpen && (
                  <CartDropdown
                    onClose={() => setCartOpen(false)}
                    onOpenAuth={() => { setCartOpen(false); setAuthTab("login"); setAuthOpen(true); }}
                  />
                )}
              </div>

              {/* Account button + dropdown */}
              <div className="relative" ref={authRef}>
                <button
                  onClick={() => toggleAuth("login")}
                  className={`flex items-center justify-center w-9 h-9 rounded-md transition-colors ${
                    authOpen || pathname === "/account"
                      ? "text-[#06377a] bg-[#e8f0f9]"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                  aria-label="Account"
                  aria-expanded={authOpen}
                >
                  {authHydrated && user ? (
                    <span className="w-6 h-6 rounded-full bg-[#06377a] flex items-center justify-center text-white text-[11px] font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <IconUser stroke={1.5} size={18} />
                  )}
                </button>

                {authOpen && (
                  <AuthDropdown
                    key={authTab}
                    initialTab={authTab}
                    onClose={() => setAuthOpen(false)}
                  />
                )}
              </div>
              </div>{/* end sm:flex cart+account */}
            </div>
          </div>

          {/* Mobile search panel */}
          {searchOpen && (
            <div className="xl:hidden pb-3 px-1.5">
              <Suspense fallback={<div className="h-[44px] w-full rounded-xl border border-slate-200 bg-white shadow-sm" />}>
                <BookSearch className="w-full" inputClassName="py-2.5" />
              </Suspense>
            </div>
          )}
        </div>
      </header>

      {/* Slide-in drawer */}
      {mounted && (
        <div className="fixed inset-0 z-40 overflow-hidden">
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black transition-opacity duration-300 ${
              animate ? "opacity-40" : "opacity-0"
            }`}
            onClick={closeMenu}
          />

          {/* Drawer */}
          <div
            className={`absolute top-0 left-0 w-[240px] max-w-[80vw] bg-white shadow-2xl border-r border-slate-100 transition-transform duration-300 ease-out ${
              animate ? "translate-x-0" : "-translate-x-full"
            } h-full flex flex-col`}
          >
            <div className="pt-[83px] sm:pt-[92px] px-5 pb-5 flex flex-col h-full">
              {/* Menu Groups */}
              <div className="flex-1 overflow-y-auto">
                <MenuGroup title="Navigation" items={navigationItems} onClick={closeMenu} pathname={pathname} />

                {/* Account section in drawer */}
                <div className="mb-4">
                  <div className="mb-1">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Account</span>
                  </div>
                  <div className="space-y-0.5">
                    <Link
                      href="/account"
                      onClick={closeMenu}
                      className={`flex items-center gap-3 py-2.5 text-sm font-medium transition-colors relative ${
                        pathname === "/account"
                          ? "text-[#06377a]"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md"
                      }`}
                    >
                      {pathname === "/account" && (
                        <span className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#06377a] rounded-r-full" />
                      )}
                      <span className={pathname === "/account" ? "text-[#06377a]" : "text-slate-400"}>
                        <IconUser stroke={1.5} size={18} />
                      </span>
                      My Account
                    </Link>
                    <Link
                      href="/cart"
                      onClick={closeMenu}
                      className={`flex items-center gap-3 py-2.5 text-sm font-medium transition-colors relative ${
                        pathname === "/cart"
                          ? "text-[#06377a]"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md"
                      }`}
                    >
                      {pathname === "/cart" && (
                        <span className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#06377a] rounded-r-full" />
                      )}
                      <span className={pathname === "/cart" ? "text-[#06377a]" : "text-slate-400"}>
                        <IconShoppingCart stroke={1.5} size={18} />
                      </span>
                      Cart
                      {cartHydrated && cartCount > 0 && (
                        <span className="ml-auto text-[10px] font-bold text-white bg-[#06377a] px-1.5 py-0.5 rounded-full tabular-nums">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                  </div>
                </div>

                <MenuGroup title="Company" items={companyItems} onClick={closeMenu} pathname={pathname} />
              </div>

              {/* Auth section at drawer bottom */}
              <div className="pt-4 border-t border-slate-100">
                {authHydrated && user ? (
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-[#06377a] flex items-center justify-center shrink-0">
                        <span className="text-white text-xs font-bold">{user.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <span className="text-sm font-medium text-slate-900 truncate">{user.name}</span>
                    </div>
                    <button
                      onClick={() => { logout(); closeMenu(); }}
                      className="shrink-0 flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                    >
                      <IconLogout size={13} stroke={1.5} />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Link
                      href="/login"
                      onClick={closeMenu}
                      className="flex-1 py-2 text-center text-sm font-semibold text-[#06377a] border border-[#06377a] rounded-lg hover:bg-[#e8f0f9] transition-colors"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/register"
                      onClick={closeMenu}
                      className="flex-1 py-2 text-center text-sm font-semibold text-white bg-[#06377a] rounded-lg hover:bg-[#052d60] transition-colors"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
