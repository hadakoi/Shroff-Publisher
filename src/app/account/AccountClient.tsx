"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { IconLock, IconUser, IconPackage, IconMail, IconMapPin } from "@tabler/icons-react";

export default function AccountClient() {
  const { user, logout, hydrated } = useAuth();

  if (!hydrated) {
    return (
      <div className="min-h-[calc(100dvh-92px)] bg-slate-50 py-10 px-4">
        <div className="max-w-2xl mx-auto space-y-5 animate-pulse">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-slate-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-slate-200 rounded w-36" />
                <div className="h-3 bg-slate-200 rounded w-52" />
              </div>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl h-44 shadow-sm" />
          <div className="bg-white border border-slate-200 rounded-2xl h-44 shadow-sm" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[calc(100dvh-92px)] bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-sm w-full">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
            <div className="w-14 h-14 bg-[#e8f0f9] rounded-full flex items-center justify-center mx-auto mb-4">
              <IconLock stroke={1.5} size={24} className="text-[#06377a]" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Sign in to your account</h2>
            <p className="text-sm text-slate-500 mb-6">
              You need to be logged in to view your account details, order history, and saved addresses.
            </p>
            <div className="flex gap-3">
              <Link
                href="/login"
                className="flex-1 py-2.5 text-center text-sm font-semibold text-[#06377a] border border-[#06377a] rounded-lg hover:bg-[#e8f0f9] transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="flex-1 py-2.5 text-center text-sm font-semibold text-white bg-[#06377a] rounded-lg hover:bg-[#052d60] transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100dvh-92px)] bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Profile header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#06377a] flex items-center justify-center shrink-0">
              <span className="text-white text-2xl font-bold">{user.name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-slate-900">{user.name}</h1>
              <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                <IconMail size={13} stroke={1.5} className="text-slate-400" />
                {user.email}
              </p>
            </div>
            <button
              onClick={logout}
              className="shrink-0 px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Account details */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <IconUser stroke={1.5} size={16} className="text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-900">Account Details</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Full Name</label>
                <div className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900">
                  {user.name}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Email Address</label>
                <div className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900">
                  {user.email}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Delivery Address</label>
              <div className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900">
                {user.address ? (
                  <span className="flex items-start gap-1.5">
                    <IconMapPin size={14} stroke={1.5} className="text-slate-400 mt-0.5 shrink-0" />
                    {user.address}
                    {user.pincode && <span className="text-slate-500"> — {user.pincode}</span>}
                  </span>
                ) : (
                  <span className="text-slate-400 italic">No address on file</span>
                )}
              </div>
            </div>
            <p className="text-xs text-slate-400">Profile editing will be available soon.</p>
          </div>
        </div>

        {/* Order history */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <IconPackage stroke={1.5} size={16} className="text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-900">Order History</h2>
          </div>
          <div className="px-6 py-10 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <IconPackage stroke={1.5} size={22} className="text-slate-400" />
            </div>
            <p className="text-sm text-slate-500">No orders yet.</p>
            <p className="text-xs text-slate-400 mt-1">Your orders will appear here once you make a purchase.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
