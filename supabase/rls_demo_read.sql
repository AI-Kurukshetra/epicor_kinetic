-- Demo read policies to expose data for authenticated users.
-- Apply in Supabase SQL editor if RLS is blocking reads.

create policy "Demo read products"
on public.products for select
using (auth.uid() is not null);

create policy "Demo read inventory"
on public.inventory for select
using (auth.uid() is not null);

create policy "Demo read work orders"
on public.work_orders for select
using (auth.uid() is not null);

create policy "Demo read suppliers"
on public.suppliers for select
using (auth.uid() is not null);

create policy "Demo read customers"
on public.customers for select
using (auth.uid() is not null);

create policy "Demo read purchase orders"
on public.purchase_orders for select
using (auth.uid() is not null);

create policy "Demo read sales orders"
on public.sales_orders for select
using (auth.uid() is not null);
