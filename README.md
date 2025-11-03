This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Supabase Integration

This project can store budgets in a Supabase Postgres table using a Next.js API route.

### 1) Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in your project values:

```bash
cp .env.local.example .env.local
# edit .env.local and set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
```

The service role key is used only on the server (in `app/api/budgets/route.ts`). Never expose it to the client.

### 2) Create the `budgets` table

Run this SQL in your Supabase SQL editor:

```sql
create table if not exists public.budgets (
	number text primary key,
	date timestamptz not null,
	company jsonb not null,
	client jsonb not null,
	items jsonb not null,
	total numeric not null,
	created_at timestamptz not null default now()
);

-- If RLS is enabled (recommended), you can later create policies as needed.
-- For development you might allow inserts from anon (not recommended for prod):
-- alter table public.budgets enable row level security;
-- create policy "allow anon insert" on public.budgets for insert
--   with check (true) to public;
```

### 3) How it works

- Client component `WorkshopBudgetSystem` assembles a `Budget` object and sends it to `POST /api/budgets`.
- The API route uses `@supabase/supabase-js` with the service role key to upsert into `public.budgets` on the `number` column.
- We also keep a local copy in browser storage as offline history.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
