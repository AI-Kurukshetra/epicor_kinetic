create table if not exists public.companies (
  id uuid primary key,
  name text not null,
  industry text not null,
  created_at timestamptz not null default now()
);

insert into public.companies (id, name, industry)
values (
  '11111111-1111-1111-1111-111111111111',
  'NextGen Manufacturing',
  'Industrial Manufacturing'
)
on conflict (id) do update
set name = excluded.name,
    industry = excluded.industry;

alter table public.products
  add column if not exists company_id uuid;
alter table public.inventory
  add column if not exists company_id uuid;
alter table public.suppliers
  add column if not exists company_id uuid;
alter table public.customers
  add column if not exists company_id uuid;
alter table public.work_orders
  add column if not exists company_id uuid;
alter table public.purchase_orders
  add column if not exists company_id uuid;
alter table public.sales_orders
  add column if not exists company_id uuid;

alter table public.products
  add constraint products_company_id_fkey
  foreign key (company_id) references public.companies(id)
  on delete cascade
  deferrable initially deferred;

alter table public.inventory
  add constraint inventory_company_id_fkey
  foreign key (company_id) references public.companies(id)
  on delete cascade
  deferrable initially deferred;

alter table public.suppliers
  add constraint suppliers_company_id_fkey
  foreign key (company_id) references public.companies(id)
  on delete cascade
  deferrable initially deferred;

alter table public.customers
  add constraint customers_company_id_fkey
  foreign key (company_id) references public.companies(id)
  on delete cascade
  deferrable initially deferred;

alter table public.work_orders
  add constraint work_orders_company_id_fkey
  foreign key (company_id) references public.companies(id)
  on delete cascade
  deferrable initially deferred;

alter table public.purchase_orders
  add constraint purchase_orders_company_id_fkey
  foreign key (company_id) references public.companies(id)
  on delete cascade
  deferrable initially deferred;

alter table public.sales_orders
  add constraint sales_orders_company_id_fkey
  foreign key (company_id) references public.companies(id)
  on delete cascade
  deferrable initially deferred;

update public.products
set company_id = '11111111-1111-1111-1111-111111111111'
where company_id is distinct from '11111111-1111-1111-1111-111111111111';

update public.inventory
set company_id = '11111111-1111-1111-1111-111111111111'
where company_id is distinct from '11111111-1111-1111-1111-111111111111';

update public.suppliers
set company_id = '11111111-1111-1111-1111-111111111111'
where company_id is distinct from '11111111-1111-1111-1111-111111111111';

update public.customers
set company_id = '11111111-1111-1111-1111-111111111111'
where company_id is distinct from '11111111-1111-1111-1111-111111111111';

update public.work_orders
set company_id = '11111111-1111-1111-1111-111111111111'
where company_id is distinct from '11111111-1111-1111-1111-111111111111';

update public.purchase_orders
set company_id = '11111111-1111-1111-1111-111111111111'
where company_id is distinct from '11111111-1111-1111-1111-111111111111';

update public.sales_orders
set company_id = '11111111-1111-1111-1111-111111111111'
where company_id is distinct from '11111111-1111-1111-1111-111111111111';

alter table public.purchase_orders
  drop constraint if exists purchase_orders_status_check;
alter table public.purchase_orders
  add constraint purchase_orders_status_check
  check (status in ('Pending', 'Ordered', 'Received', 'Approved'));

alter table public.sales_orders
  drop constraint if exists sales_orders_status_check;
alter table public.sales_orders
  add constraint sales_orders_status_check
  check (status in ('Pending', 'Processing', 'Shipped', 'Delivered', 'Packed'));
