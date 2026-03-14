create extension if not exists "pgcrypto";

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  industry text not null,
  size_range text not null,
  timezone text not null
);

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  company_id uuid references public.companies(id) on delete set null,
  email text not null unique,
  full_name text not null,
  role text not null check (role in ('admin', 'manager', 'worker')),
  avatar_url text
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  company_id uuid not null references public.companies(id) on delete cascade,
  sku text not null,
  name text not null,
  description text not null,
  category text not null,
  unit text not null,
  standard_cost numeric(12,2) not null default 0,
  sales_price numeric(12,2) not null default 0
);

create table if not exists public.inventory (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  company_id uuid not null references public.companies(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null default 0,
  warehouse_location text not null,
  reorder_level integer not null default 0,
  unit_cost numeric(12,2) not null default 0
);

create table if not exists public.bill_of_materials (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  company_id uuid not null references public.companies(id) on delete cascade,
  parent_product_id uuid not null references public.products(id) on delete cascade,
  component_product_id uuid not null references public.products(id) on delete cascade,
  level integer not null default 1,
  quantity integer not null default 1
);

create table if not exists public.work_orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  company_id uuid not null references public.companies(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null,
  status text not null check (status in ('Planned', 'In Production', 'Completed')),
  schedule_date date not null,
  machine text not null,
  owner text not null
);

create table if not exists public.production_schedules (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  company_id uuid not null references public.companies(id) on delete cascade,
  work_order_id uuid not null references public.work_orders(id) on delete cascade,
  machine_name text not null,
  schedule_date date not null,
  shift text not null,
  capacity_percent integer not null default 0,
  status text not null check (status in ('Planned', 'In Production', 'Completed'))
);

create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  contact_name text not null,
  email text not null,
  lead_time_days integer not null default 0,
  status text not null check (status in ('Preferred', 'Approved', 'Trial'))
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  contact_name text not null,
  email text not null,
  region text not null
);

create table if not exists public.purchase_orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  company_id uuid not null references public.companies(id) on delete cascade,
  supplier_id uuid not null references public.suppliers(id) on delete cascade,
  order_number text not null,
  total_amount numeric(12,2) not null default 0,
  status text not null check (status in ('Pending', 'Approved', 'Received')),
  expected_date date not null,
  received_percent integer not null default 0
);

create table if not exists public.sales_orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  company_id uuid not null references public.companies(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  order_number text not null,
  total_amount numeric(12,2) not null default 0,
  status text not null check (status in ('Pending', 'Packed', 'Delivered')),
  delivery_date date not null,
  fulfillment_percent integer not null default 0
);

create table if not exists public.quality_inspections (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  company_id uuid not null references public.companies(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  inspector text not null,
  result text not null check (result in ('Pass', 'Fail')),
  notes text not null,
  inspected_at date not null
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  company_id uuid not null references public.companies(id) on delete cascade,
  title text not null,
  message text not null,
  severity text not null check (severity in ('info', 'warning', 'critical')),
  is_read boolean not null default false
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'admin'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'companies',
    'users',
    'products',
    'inventory',
    'bill_of_materials',
    'work_orders',
    'production_schedules',
    'suppliers',
    'customers',
    'purchase_orders',
    'sales_orders',
    'quality_inspections',
    'notifications'
  ]
  loop
    execute format('drop trigger if exists set_%I_updated_at on public.%I', table_name, table_name);
    execute format(
      'create trigger set_%I_updated_at before update on public.%I for each row execute procedure public.set_updated_at()',
      table_name,
      table_name
    );
  end loop;
end $$;

alter table public.companies enable row level security;
alter table public.users enable row level security;
alter table public.products enable row level security;
alter table public.inventory enable row level security;
alter table public.bill_of_materials enable row level security;
alter table public.work_orders enable row level security;
alter table public.production_schedules enable row level security;
alter table public.suppliers enable row level security;
alter table public.customers enable row level security;
alter table public.purchase_orders enable row level security;
alter table public.sales_orders enable row level security;
alter table public.quality_inspections enable row level security;
alter table public.notifications enable row level security;

create or replace function public.current_company_id()
returns uuid
language sql
stable
as $$
  select company_id from public.users where id = auth.uid()
$$;

create policy "Users can view their company"
on public.companies for select
using (id = public.current_company_id());

create policy "Users can insert company on signup"
on public.companies for insert
with check (true);

create policy "Users manage own profile"
on public.users for all
using (id = auth.uid())
with check (id = auth.uid());

create policy "Company scoped products"
on public.products for all
using (company_id = public.current_company_id())
with check (company_id = public.current_company_id());

create policy "Company scoped inventory"
on public.inventory for all
using (company_id = public.current_company_id())
with check (company_id = public.current_company_id());

create policy "Company scoped bill_of_materials"
on public.bill_of_materials for all
using (company_id = public.current_company_id())
with check (company_id = public.current_company_id());

create policy "Company scoped work_orders"
on public.work_orders for all
using (company_id = public.current_company_id())
with check (company_id = public.current_company_id());

create policy "Company scoped production_schedules"
on public.production_schedules for all
using (company_id = public.current_company_id())
with check (company_id = public.current_company_id());

create policy "Company scoped suppliers"
on public.suppliers for all
using (company_id = public.current_company_id())
with check (company_id = public.current_company_id());

create policy "Company scoped customers"
on public.customers for all
using (company_id = public.current_company_id())
with check (company_id = public.current_company_id());

create policy "Company scoped purchase_orders"
on public.purchase_orders for all
using (company_id = public.current_company_id())
with check (company_id = public.current_company_id());

create policy "Company scoped sales_orders"
on public.sales_orders for all
using (company_id = public.current_company_id())
with check (company_id = public.current_company_id());

create policy "Company scoped quality_inspections"
on public.quality_inspections for all
using (company_id = public.current_company_id())
with check (company_id = public.current_company_id());

create policy "Company scoped notifications"
on public.notifications for all
using (company_id = public.current_company_id())
with check (company_id = public.current_company_id());
