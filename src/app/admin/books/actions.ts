"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function updateBookStock(
  bookId: string,
  stock: number
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
    .from("books")
    .update({ stock, updated_at: new Date().toISOString() })
    .eq("id", bookId);

  if (error) return { error: error.message };
  return {};
}
