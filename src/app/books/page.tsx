import BookList from "@/components/BookList";

export default async function AllBooksPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;

  return <BookList searchQuery={q} initialCategory={category} />;
}
