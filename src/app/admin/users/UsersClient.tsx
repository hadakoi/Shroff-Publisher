"use client";

import { useState, useTransition } from "react";
import { IconPencil, IconCheck, IconX, IconUser } from "@tabler/icons-react";
import { updateProfile } from "./actions";

interface Profile {
  user_id: string;
  full_name: string | null;
  email: string | null;
  address: string | null;
  pincode: string | null;
  created_at: string;
}

interface EditState {
  full_name: string;
  address: string;
  pincode: string;
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function UsersClient({ initialProfiles }: { initialProfiles: Profile[] }) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<EditState>({ full_name: "", address: "", pincode: "" });
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const startEdit = (p: Profile) => {
    setEditingId(p.user_id);
    setDraft({ full_name: p.full_name ?? "", address: p.address ?? "", pincode: p.pincode ?? "" });
    setSaveError(null);
  };

  const cancelEdit = () => { setEditingId(null); setSaveError(null); };

  const saveEdit = (userId: string) => {
    setSaveError(null);
    startTransition(async () => {
      const result = await updateProfile(userId, {
        full_name: draft.full_name.trim() || undefined,
        address: draft.address.trim() || undefined,
        pincode: draft.pincode.trim() || undefined,
      });
      if (result.error) { setSaveError(result.error); return; }
      setProfiles((prev) =>
        prev.map((p) =>
          p.user_id === userId
            ? { ...p, full_name: draft.full_name.trim() || p.full_name, address: draft.address.trim() || null, pincode: draft.pincode.trim() || null }
            : p
        )
      );
      setEditingId(null);
    });
  };

  const inputClass = "w-full px-2 py-1 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#06377a]/30 focus:border-[#06377a]";

  if (!profiles.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <IconUser size={22} stroke={1.5} className="text-slate-400" />
        </div>
        <p className="text-sm text-slate-500">No users have registered yet.</p>
      </div>
    );
  }

  return (
    <>
      {saveError && (
        <div className="mb-4 px-4 py-2.5 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
          {saveError}
        </div>
      )}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">User</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Email</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Address / Pincode</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Joined</th>
              <th className="px-4 py-3 w-20" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {profiles.map((profile) => {
              const isEditing = editingId === profile.user_id;
              return (
                <tr key={profile.user_id} className={`transition-colors ${isEditing ? "bg-[#e8f0f9]/30" : "hover:bg-slate-50/60"}`}>
                  {/* Name */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#06377a] flex items-center justify-center shrink-0">
                        <span className="text-white text-xs font-bold">
                          {(profile.full_name ?? "?").charAt(0).toUpperCase()}
                        </span>
                      </div>
                      {isEditing ? (
                        <input
                          value={draft.full_name}
                          onChange={(e) => setDraft((d) => ({ ...d, full_name: e.target.value }))}
                          className={inputClass}
                          placeholder="Full name"
                        />
                      ) : (
                        <span className="font-medium text-slate-900">{profile.full_name || "—"}</span>
                      )}
                    </div>
                  </td>

                  {/* Email (read-only — tied to auth) */}
                  <td className="px-4 py-3 text-slate-500 hidden sm:table-cell text-xs">
                    {profile.email || <span className="text-slate-300">—</span>}
                  </td>

                  {/* Address / Pincode */}
                  <td className="px-4 py-3 hidden md:table-cell">
                    {isEditing ? (
                      <div className="flex flex-col gap-1.5">
                        <input
                          value={draft.address}
                          onChange={(e) => setDraft((d) => ({ ...d, address: e.target.value }))}
                          className={inputClass}
                          placeholder="Address"
                        />
                        <input
                          value={draft.pincode}
                          onChange={(e) => setDraft((d) => ({ ...d, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) }))}
                          className={inputClass}
                          placeholder="Pincode"
                          inputMode="numeric"
                          maxLength={6}
                        />
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 space-y-0.5">
                        <p>{profile.address || <span className="text-slate-300">No address</span>}</p>
                        {profile.pincode && <p className="font-mono text-slate-400">{profile.pincode}</p>}
                      </div>
                    )}
                  </td>

                  {/* Joined */}
                  <td className="px-4 py-3 text-slate-500 text-xs hidden lg:table-cell">
                    {fmt(profile.created_at)}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => saveEdit(profile.user_id)}
                          disabled={isPending}
                          className="w-7 h-7 flex items-center justify-center bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors disabled:opacity-50"
                          aria-label="Save"
                        >
                          <IconCheck size={14} stroke={2.5} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="w-7 h-7 flex items-center justify-center bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-lg transition-colors"
                          aria-label="Cancel"
                        >
                          <IconX size={14} stroke={2.5} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(profile)}
                        className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-[#06377a] hover:bg-[#e8f0f9] rounded-lg transition-colors"
                        aria-label="Edit user"
                      >
                        <IconPencil size={14} stroke={1.5} />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
