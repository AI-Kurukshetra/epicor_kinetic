# NextGen Manufacturing ERP

Modern cloud-native manufacturing ERP MVP built with Next.js App Router, TypeScript, Tailwind CSS, shadcn-style UI primitives, Supabase auth/database, React Server Components, and Server Actions.

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS v4
- Supabase Auth + Postgres
- shadcn-style component primitives
- Recharts

## Features

- Supabase login, signup, logout, and protected routes
- Role-aware SaaS shell with sidebar navigation and dark mode
- Dashboard KPIs, operations chart, recent activity, and alerts
- Inventory management with detail and creation flows
- Multi-level bill of materials rollups
- Work orders and production scheduling
- Purchase and sales order management
- Quality inspections
- Reporting dashboard
- REST API routes for auth, inventory, BOM, work orders, purchases, sales, and reports
- Seeded demo fallback when Supabase env vars are not configured

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local` and set:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

3. Apply the schema in `supabase/schema.sql`.

4. Seed the database:

```bash
npm run seed
```

5. Start the app:

```bash
npm run dev
```

## Project structure

- `app/` routes, layouts, server actions, and API handlers
- `components/` layout, shared, and UI primitives
- `lib/` Supabase helpers, auth helpers, utilities, and validation
- `services/` ERP data layer and mock seed data
- `types/` shared TypeScript models
- `scripts/seed.ts` Supabase seed script
- `supabase/schema.sql` database schema and RLS policies

## Deployment

Deploy directly to Vercel after adding the same environment variables. The app is already structured for App Router hosting with server actions and server components.
