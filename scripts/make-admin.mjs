// Usage: node scripts/make-admin.mjs your@email.com
// Grants admin rights to a registered user by email.

import pg from "pg";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const email = process.argv[2];
if (!email) {
  console.error("Usage: node scripts/make-admin.mjs <email>");
  process.exit(1);
}

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

// Apply admin schema (idempotent — silently skips if already applied)
const adminSchema = readFileSync(
  join(__dirname, "../supabase/admin-schema.sql"),
  "utf8"
);
try {
  await client.query(adminSchema);
  console.log("✓ Admin schema applied");
} catch (e) {
  if (e.code === "42710") {
    console.log("✓ Admin schema already applied, skipping");
  } else {
    throw e;
  }
}

// Find user
const { rows } = await client.query(
  "SELECT id FROM auth.users WHERE email = $1",
  [email]
);

if (!rows.length) {
  console.error(`✗ No user found with email: ${email}`);
  console.error("  Make sure the user has registered first.");
  await client.end();
  process.exit(1);
}

const userId = rows[0].id;

await client.query(
  `INSERT INTO public.admin_users (user_id)
   VALUES ($1)
   ON CONFLICT (user_id) DO NOTHING`,
  [userId]
);

console.log(`✓ ${email} is now an admin (user_id: ${userId})`);
await client.end();
