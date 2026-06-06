import { createSupabaseServerClient } from "@/lib/supabase/server";
import UsersClient from "./UsersClient";

export default async function AdminUsersPage() {
  const supabase = await createSupabaseServerClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("user_id, full_name, email, address, pincode, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Users</h1>
        <p className="text-sm text-slate-500 mt-1">
          {profiles?.length ?? 0} registered accounts — click the pencil to edit
        </p>
      </div>
      <UsersClient initialProfiles={profiles ?? []} />
    </div>
  );
}
