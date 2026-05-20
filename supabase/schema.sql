-- =====================================================================
-- Nutrition — Full Supabase Schema (Corrected Order)
-- Run this in your Supabase SQL Editor
-- =====================================================================

-- ── 1. TABLES DEFINITIONS ────────────────────────────────────────────

-- Profiles
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  phone text,
  address jsonb,
  role text default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Banners (Hero Slider)
create table if not exists banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  badge text,
  cta_text text default 'SHOP NOW',
  cta_link text default '/products',
  cta2_text text,
  cta2_link text,
  bg_color text default '#080808',
  image_url text,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Promo Bar
create table if not exists promo_messages (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  link text,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Categories
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  abbr text,
  bg_color text default '#1a1a3a',
  image_url text,
  sort_order integer default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Products
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  sku text unique,
  name text not null,
  brand text,
  slug text unique not null,
  description_short text,
  description_long text,
  category text,
  subcategory text,
  price numeric(10,2) not null,
  price_original numeric(10,2),
  currency text default 'CHF',
  weight_g integer,
  flavors text[],
  images text[],
  in_stock boolean default true,
  is_featured boolean default false,
  is_new boolean default false,
  badge_text text,
  badge_color text default '#c8102e',
  rating numeric(2,1) default 0,
  review_count integer default 0,
  tags text[],
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Offers
create table if not exists offers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  offer_type text not null check (offer_type in ('bogo', 'percentage', 'fixed')),
  discount_value numeric(10,2),
  product_id uuid references products(id) on delete cascade,
  category text,
  is_active boolean default true,
  start_date timestamptz,
  end_date timestamptz,
  created_at timestamptz default now()
);

-- Orders
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique default 'N-' || floor(random() * 900000 + 100000)::text,
  user_id uuid references profiles(id) on delete set null,
  items jsonb not null,
  subtotal numeric(10,2) not null,
  shipping_cost numeric(10,2) default 0,
  total numeric(10,2) not null,
  status text default 'pending' check (status in ('pending','processing','shipped','delivered','cancelled','refunded')),
  shipping_address jsonb,
  billing_address jsonb,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Wishlist
create table if not exists wishlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);


-- ── 2. FUNCTIONS DEFINITIONS ──────────────────────────────────────────

-- Secure Admin Check Function
create or replace function public.is_admin()
returns boolean as $$
declare
  is_admin boolean;
begin
  select (role = 'admin') into is_admin from public.profiles where id = auth.uid();
  return coalesce(is_admin, false);
end;
$$ language plpgsql security definer set search_path = public;

-- Auto-update updated_at trigger function
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Auto-create profile on signup function
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;


-- ── 3. ROW LEVEL SECURITY (RLS) POLICIES ──────────────────────────────

-- Profiles Policies
alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);
create policy "Admin can view all profiles" on profiles for select using (public.is_admin());

-- Banners Policies
alter table banners enable row level security;
create policy "Public read banners" on banners for select using (true);
create policy "Admin manage banners" on banners for all using (public.is_admin());

-- Promo Messages Policies
alter table promo_messages enable row level security;
create policy "Public read promo" on promo_messages for select using (true);
create policy "Admin manage promo" on promo_messages for all using (public.is_admin());

-- Categories Policies
alter table categories enable row level security;
create policy "Public read categories" on categories for select using (true);
create policy "Admin manage categories" on categories for all using (public.is_admin());

-- Products Policies
alter table products enable row level security;
create policy "Public read products" on products for select using (true);
create policy "Admin manage products" on products for all using (public.is_admin());

-- Offers Policies
alter table offers enable row level security;
create policy "Public read offers" on offers for select using (true);
create policy "Admin manage offers" on offers for all using (public.is_admin());

-- Orders Policies
alter table orders enable row level security;
create policy "Users can view own orders" on orders for select using (auth.uid() = user_id);
create policy "Users can create orders" on orders for insert with check (auth.uid() = user_id);
create policy "Admin can view all orders" on orders for select using (public.is_admin());
create policy "Admin can update orders" on orders for update using (public.is_admin());

-- Wishlist Policies
alter table wishlist enable row level security;
create policy "Users manage own wishlist" on wishlist for all using (auth.uid() = user_id);


-- ── 4. TRIGGERS ───────────────────────────────────────────────────────

create trigger products_updated_at before update on products
  for each row execute function update_updated_at();
create trigger banners_updated_at before update on banners
  for each row execute function update_updated_at();
create trigger profiles_updated_at before update on profiles
  for each row execute function update_updated_at();
create trigger orders_updated_at before update on orders
  for each row execute function update_updated_at();

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();


-- ── 5. SEED DATA ───────────────────────────────────────────────────────

-- Promo messages
insert into promo_messages (text, link, sort_order) values
  ('Buy 1, Get 1 50% Off! — SHOP NOW', '/products', 1),
  ('Free Shipping on Orders over CHF 79', '/products', 2),
  ('Save 10% When You Pick Up In-Store!', '/products', 3);

-- Banners
insert into banners (title, subtitle, badge, cta_text, cta_link, cta2_text, cta2_link, bg_color, sort_order) values
  ('BUILD YOUR BEST BODY', 'Premium Swiss nutrition. Keto, protein & performance supplements delivered to your door.', 'New Drop 2025', 'SHOP NOW', '/products', 'VIEW KETO RANGE', '/products?cat=keto', '#080808', 1),
  ('KETO DONE DELICIOUSLY', 'Croissants, bars & snacks — only 2g net carbs. Taste the lifestyle.', 'Keto Collection', 'SHOP KETO', '/products?cat=keto', 'SEE ALL KETO', '/products?cat=keto', '#0d0d0d', 2),
  ('BUY 1 GET 1 FREE PROTEIN', 'Mix and match all whey flavours. This week only — don''t miss out.', 'Limited Deal', 'GRAB THE DEAL', '/products?cat=protein', 'VIEW ALL PROTEIN', '/products?cat=protein', '#0a0005', 3);

-- Categories
insert into categories (name, slug, abbr, bg_color, sort_order) values
  ('Protein', 'protein', 'PRO', '#1a3a6b', 1),
  ('Pre-Workout', 'pre-workout', 'PRE', '#0a0a1a', 2),
  ('Vitamins', 'vitamins', 'VIT', '#0a4a2a', 3),
  ('Weight Loss', 'weight-loss', 'FAT', '#c8102e', 4),
  ('Keto', 'keto', 'KET', '#3a1a6b', 5),
  ('Women''s Health', 'womens-health', 'WMN', '#6b1a3a', 6),
  ('Men''s Health', 'mens-health', 'MEN', '#1a4a1a', 7),
  ('Energy', 'energy', 'NRG', '#4a3a00', 8),
  ('Recovery', 'recovery', 'REC', '#003a4a', 9),
  ('Herbs & Naturals', 'herbs-naturals', 'HRB', '#1a3a1a', 10),
  ('Food & Snacks', 'food-snacks', 'SNK', '#4a2a00', 11),
  ('Sports Performance', 'sports-performance', 'SPT', '#2a2a4a', 12);
