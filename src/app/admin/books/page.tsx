import { createSupabaseServerClient } from "@/lib/supabase/server";
import BooksClient from "./BooksClient";

export default async function AdminBooksPage() {
  const supabase = await createSupabaseServerClient();

  const { data: books } = await supabase
    .from("books")
    .select("id, title, authors, category_label, publisher, price, stock")
    .order("category_label")
    .order("title");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Books</h1>
        <p className="text-sm text-slate-500 mt-1">
          {books?.length ?? 0} titles — click the pencil to edit stock
        </p>
      </div>

      <BooksClient initialBooks={books ?? []} />
    </div>
  );
}
