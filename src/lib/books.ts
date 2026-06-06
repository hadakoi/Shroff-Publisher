import data from "@/data/books.json";

export type BookRecord = (typeof data.books)[number];

const normalized = (value: string) =>
  value
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

export function matchesBookQuery(book: BookRecord, query: string) {
  const q = normalized(query);
  if (!q) return true;

  return [
    book.title,
    book.authors,
    book.publisher,
    book.categoryLabel,
    book.description,
    book.id,
  ].some((field) => normalized(field).includes(q));
}

function scoreBook(book: BookRecord, query: string) {
  const q = normalized(query);
  if (!q) return 0;

  const title = normalized(book.title);
  const authors = normalized(book.authors);
  const publisher = normalized(book.publisher);
  const category = normalized(book.categoryLabel);
  const description = normalized(book.description);
  const isbn = book.id;

  if (isbn === q || isbn.includes(q)) return 950;
  if (title === q) return 1000;
  if (title.startsWith(q)) return 900;
  if (authors.includes(q)) return 700;
  if (publisher.includes(q)) return 500;
  if (category.includes(q)) return 400;
  if (title.includes(q)) return 350;
  if (description.includes(q)) return 100;
  return 0;
}

export function searchBooks(query: string, limit = 6) {
  const q = normalized(query);
  const books = data.books as BookRecord[];

  if (!q) {
    return books.slice(0, limit);
  }

  return books
    .map((book) => ({ book, score: scoreBook(book, q) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.book.title.localeCompare(b.book.title))
    .slice(0, limit)
    .map(({ book }) => book);
}

export function formatQuery(query: string) {
  return normalized(query);
}
