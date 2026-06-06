"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function updateProfile(
  userId: string,
  fields: { full_name?: string; address?: string; pincode?: string }
): Promise<{ error?: string }> {
  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthenticated" };

  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!adminRow) return { error: "Forbidden" };

  const { error } = await supabase
    .from("profiles")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("user_id", userId);

  if (error) return { error: error.message };
  return {};
}
