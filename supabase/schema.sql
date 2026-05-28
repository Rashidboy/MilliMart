create extension if not exists "pgcrypto";

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  price bigint not null check (price >= 0),
  discount integer not null default 0,
  images text[] not null default '{}',
  category text not null,
  rating_avg numeric(3,2) not null default 0,
  review_count integer not null default 0,
  stock integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_name text not null,
  rating integer not null check (rating between 1 and 5),
  pros text,
  cons text,
  comment text not null,
  image_url text,
  date date not null default now(),
  status text not null default 'pending' check (status in ('pending', 'approved')),
  created_at timestamptz not null default now()
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create or replace function public.recalc_product_rating()
returns trigger
language plpgsql
as $$
declare
  target_product uuid;
begin
  target_product := coalesce(new.product_id, old.product_id);

  update public.products p
  set
    rating_avg = coalesce(stats.avg_rating, 0),
    review_count = coalesce(stats.approved_count, 0)
  from (
    select
      product_id,
      round(avg(rating)::numeric, 2) as avg_rating,
      count(*) as approved_count
    from public.reviews
    where status = 'approved'
    group by product_id
  ) stats
  where p.id = target_product and p.id = stats.product_id;

  update public.products
  set rating_avg = 0, review_count = 0
  where id = target_product
    and not exists (
      select 1 from public.reviews
      where product_id = target_product
        and status = 'approved'
    );

  return coalesce(new, old);
end;
$$;

drop trigger if exists reviews_recalc_product_rating on public.reviews;
create trigger reviews_recalc_product_rating
after insert or update or delete
on public.reviews
for each row
execute function public.recalc_product_rating();
