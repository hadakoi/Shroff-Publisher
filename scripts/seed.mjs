// Run once: node scripts/seed.mjs
// Applies schema.sql then seeds all books from src/data/books.json

import pg from "pg";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname, "..");

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("Error: DATABASE_URL environment variable is not set.");
  process.exit(1);
}

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

await client.connect();
console.log("✓ Connected to Supabase");

// Apply schema
const schema = readFileSync(join(root, "supabase/schema.sql"), "utf8");
await client.query(schema);
console.log("✓ Schema applied");

// Seed books
const { books } = JSON.parse(
  readFileSync(join(root, "src/data/books.json"), "utf8")
);

let inserted = 0;
for (const book of books) {
  await client.query(
    `INSERT INTO public.books
       (id, title, authors, price, cover_url, thumbnail_url,
        category, category_label, publisher, description, stock)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     ON CONFLICT (id) DO UPDATE SET
       title          = EXCLUDED.title,
       authors        = EXCLUDED.authors,
       price          = EXCLUDED.price,
       cover_url      = EXCLUDED.cover_url,
       thumbnail_url  = EXCLUDED.thumbnail_url,
       category       = EXCLUDED.category,
       category_label = EXCLUDED.category_label,
       publisher      = EXCLUDED.publisher,
       description    = EXCLUDED.description`,
    [
      book.id,
      book.title,
      book.authors,
      book.priceValue,          // numeric — store rupees as-is
      book.cover,
      book.thumbnail ?? book.cover,
      book.category,
      book.categoryLabel,
      book.publisher,
      book.description ?? "",
      100,                      // default stock for demo
    ]
  );
  inserted++;
}

console.log(`✓ Seeded ${inserted} books`);
await client.end();
