# Shroff Publishers — Storefront

Next.js 16 e-commerce storefront for Shroff Publishers & Distributors Pvt. Ltd., India's premier distributor of O'Reilly, Rheinwerk, and international technical books.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.7 (App Router) |
| UI | React 19, Tailwind CSS v4 |
| Language | TypeScript (strict) |
| Auth | Supabase Auth via `@supabase/ssr` v0.10.3 |
| Database | Supabase PostgreSQL with RLS |
| Icons | Tabler Icons React |

---

## Architecture

### Auth flow
- `src/proxy.ts` — Next.js 16 proxy (replaces `middleware.ts`). Refreshes Supabase sessions on every request using `getClaims()` (not `getSession()` — avoids stale JWT reads).
- `src/context/AuthContext.tsx` — Client-side auth state. The `onAuthStateChange` callback is intentionally **synchronous** to avoid blocking `signInWithPassword` (supabase-js v2 awaits all callbacks before resolving the sign-in promise).
- `src/lib/supabase/client.ts` — Singleton browser client. Returns `null` when env vars are missing so the app degrades gracefully without crashing.
- `src/lib/supabase/server.ts` — Server client for RSC and Server Actions. Throws a clear error if env vars are missing.

### Admin access
- Admin role is stored in `admin_users` table (separate from `profiles`), not in JWT claims.
- `is_admin()` is a `SECURITY DEFINER` function used in RLS policies to gate admin operations.
- `src/app/admin/layout.tsx` performs a server-side admin check on every admin route and redirects to `/` on failure.
- All admin Server Actions re-validate the requesting user against `admin_users` before mutating data.

### Cart
- Persisted to `localStorage` (Phase 1). Schema for Supabase-backed carts exists (`carts`, `cart_items`) but is not yet wired.
- Max 2 copies per title enforced in `CartContext` and in the UI.

### Toast notifications
- `src/components/Toast.tsx` — lightweight context-based toast system, no external library.
- Login and register fire `showToast()` immediately after success.
- Logout queues a message in `sessionStorage` via `queueToast()` before the page redirect; `ToastProvider` reads and displays it on mount at the next page.

### Book data
- Catalog is currently read from `src/data/books.json` (local JSON). `books` table in Supabase holds stock counts only.
- Book detail pages fetch live stock from Supabase with `export const dynamic = "force-dynamic"`.

---

## Database schema

Tables live in `supabase/schema.sql` and `supabase/admin-schema.sql`.

| Table | Purpose |
|---|---|
| `profiles` | `user_id`, `full_name`, `email`, `address`, `pincode`, `created_at` |
| `books` | `id` (ISBN), `title`, `stock`, `updated_at` |
| `carts` | One row per user — Phase 2 |
| `cart_items` | Per-user cart rows — Phase 2 |
| `admin_users` | `user_id` rows granting admin access |

All tables have RLS enabled. `profiles` and `books` are exposed to the Data API; `admin_users` is admin-only via `SECURITY DEFINER`.

---

## Local setup

### 1. Install dependencies
```bash
npm install
```

### 2. Create a Supabase project
In the Supabase dashboard, create a new project and note the project URL and publishable key.

### 3. Apply the schema
Run both SQL files in the Supabase SQL editor (in order):
```
supabase/schema.sql
supabase/admin-schema.sql
```

### 4. Configure environment variables
```bash
cp .env.example .env.local
```
Fill in all four values. See `.env.example` for descriptions.

> `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is the new-format key (`sb_publishable_...`), not the legacy `anon` key.

### 5. Run dev server
```bash
npm run dev
```

### 6. Grant admin access
```bash
node scripts/make-admin.mjs user@example.com
```

---

## Environment variables

| Variable | Visibility | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Public (browser) | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public (browser) | Publishable key for client-side auth |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** | Bypasses RLS — never expose to browser |
| `DATABASE_URL` | **Server only** | Direct pooler connection for migration scripts |

> **Security:** `SUPABASE_SERVICE_ROLE_KEY` and `DATABASE_URL` must never appear in a `NEXT_PUBLIC_` variable. They are used only in Node.js scripts, never in `src/`.

---

## Project structure

```
src/
  app/                  # Next.js App Router pages
    admin/              # Admin panel (server-side role-gated)
    books/[id]/         # Book detail page
    cart/               # Cart page
    checkout/           # Under construction
    account/            # User account
    about-us/           # Static content
    contact-us/         # Static content
    faq/                # Under construction
    returns/            # Under construction
    shipping-policy/    # Under construction
    track-order/        # Under construction
    our-distributors/   # Under construction
    our-retailers/      # Under construction
  components/           # Shared UI components
    UnderConstruction   # Shared stub for in-progress pages
    BookCard            # Book grid card with add-to-cart
    BookList            # Filterable/sortable book grid
    Navbar              # Top nav with cart and auth dropdowns
    Hero                # Homepage hero with clickable book collage
    CategoriesSection   # Browse-by-category cards → /books?category=
  context/
    AuthContext         # Supabase auth + profile state
    CartContext         # Cart state with localStorage persistence
  lib/
    supabase/client.ts  # Browser Supabase client (singleton)
    supabase/server.ts  # Server Supabase client (RSC / Actions)
    books.ts            # Book search and scoring
    bookInventory.ts    # Stock status labels
  data/
    books.json          # Local book catalog (ISBN, title, price, cover URL)
  proxy.ts              # Next.js 16 session refresh proxy

scripts/                # Node.js admin/migration utilities (run locally only)
supabase/               # SQL schema files
public/covers/          # Downloaded book cover images
```

---

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `node scripts/make-admin.mjs <email>` | Grant admin role to a user |
| `node scripts/seed.mjs` | Seed initial book records |

---

## Deployment (Vercel)

1. Clean commit history and push to GitHub.
2. Import repo in Vercel.
3. Add all four env vars in Vercel project settings.
4. Deploy. Next.js 16 requires no special Vercel config — the App Router and proxy are detected automatically.

> Disable email confirmation in Supabase Auth (Authentication → Settings) for immediate login after registration in dev/staging.

---

## Known incomplete features

- Checkout flow — UI stub only, no payment integration
- Order history — not implemented
- Persistent cart — localStorage only, Supabase cart tables exist but are not wired
- Track order, Returns, Shipping Policy, FAQ, Distributors, Retailers — content pending
