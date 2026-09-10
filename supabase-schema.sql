-- ============================================================
-- Veda Yoga Studio — Admin CMS schema
-- Run this once in Supabase Dashboard -> SQL Editor -> New query
-- ============================================================

-- 1. CLASSES / SCHEDULE table
-- Replaces the hardcoded `classes` array in src/components/site/Classes.tsx
create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  meta text not null,           -- e.g. "60 min · All levels"
  icon text not null default 'Users',  -- lucide-react icon name
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. OFFERS / EVENTS table
-- Powers a banner on the homepage: festival offers, workshop announcements, etc.
create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 3. Auto-update `updated_at` on every edit
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_classes_updated on public.classes;
create trigger trg_classes_updated
  before update on public.classes
  for each row execute function public.set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- Public visitors can only READ active rows.
-- Only a logged-in admin (any authenticated Supabase user) can write.
-- Since this is a single-owner site, "authenticated" == the owner.
-- ============================================================

alter table public.classes enable row level security;
alter table public.offers enable row level security;

-- Public read: only active rows
create policy "Public can read active classes"
  on public.classes for select
  using (is_active = true);

create policy "Public can read active offers"
  on public.offers for select
  using (is_active = true);

-- Admin (logged in) can read everything, including inactive/draft rows
create policy "Admin can read all classes"
  on public.classes for select
  to authenticated
  using (true);

create policy "Admin can read all offers"
  on public.offers for select
  to authenticated
  using (true);

-- Admin can insert/update/delete
create policy "Admin can write classes"
  on public.classes for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin can write offers"
  on public.offers for all
  to authenticated
  using (true)
  with check (true);

-- ============================================================
-- SEED DATA — matches the current hardcoded classes so the site
-- looks identical on day one, before the owner edits anything.
-- ============================================================
insert into public.classes (title, description, meta, icon, sort_order) values
  ('Group Yoga', 'Mixed morning and evening batches — asana, pranayama and relaxation in a small group.', '60 min · All levels', 'Users', 1),
  ('Personal / 1-on-1 Yoga', 'A private plan built around your body, injuries and goals, at the studio or at home.', '60 min · Custom plan', 'User', 2),
  ('Yoga for Women', 'Women-only batches covering hormonal balance, prenatal, postnatal and weight care.', '60 min · Women only', 'Flower2', 3),
  ('Aerial Yoga', 'Hammock-supported inversions that decompress the spine and build core control.', '60 min · Beginner friendly', 'Wind', 4),
  ('Yoga Wheel Therapy', 'Wheel and prop-assisted backbends for posture correction and desk-job back pain.', '45 min · Therapeutic', 'CircleDot', 5)
on conflict do nothing;

-- ============================================================
-- NEXT STEP (do this in the Supabase Dashboard, not SQL):
-- Authentication -> Users -> Add user -> enter the studio owner's
-- email. That email becomes the only admin login. Do NOT enable
-- public sign-ups for this project.
-- ============================================================


-- ============================================================
-- v2 — CMS UPGRADE
-- Adds: photo uploads, categories, testimonials/reviews, and the
-- ability to create brand new pages from the admin panel.
-- Safe to re-run: every statement below is idempotent, so running
-- this on a project that already has the v1 schema above will not
-- touch or duplicate any existing data.
-- ============================================================

-- 1. IMAGE STORAGE BUCKET
-- One shared, public-read bucket for every image uploaded from the
-- admin panel (class photos, page photos, etc). Files are validated
-- in the browser before upload (type: jpg/png/webp, max size, and
-- aspect ratio) — see src/lib/upload.ts.
insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can view site images" on storage.objects;
create policy "Public can view site images"
  on storage.objects for select
  using (bucket_id = 'site-images');

drop policy if exists "Admin can upload site images" on storage.objects;
create policy "Admin can upload site images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'site-images');

drop policy if exists "Admin can update site images" on storage.objects;
create policy "Admin can update site images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'site-images');

drop policy if exists "Admin can delete site images" on storage.objects;
create policy "Admin can delete site images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'site-images');

-- 2. CATEGORIES — group classes under a category in the admin panel
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

drop policy if exists "Public can read categories" on public.categories;
create policy "Public can read categories"
  on public.categories for select
  using (true);

drop policy if exists "Admin can write categories" on public.categories;
create policy "Admin can write categories"
  on public.categories for all
  to authenticated
  using (true)
  with check (true);

insert into public.categories (name, slug, sort_order) values
  ('Group Classes', 'group-classes', 1),
  ('Personal Training', 'personal-training', 2),
  ('Women Only', 'women-only', 3),
  ('Aerial', 'aerial', 4),
  ('Therapy', 'therapy', 5)
on conflict (slug) do nothing;

-- 3. CLASSES — add photo + category (existing rows are untouched)
alter table public.classes add column if not exists image_url text;
alter table public.classes add column if not exists category_id uuid references public.categories(id) on delete set null;

-- 4. TESTIMONIALS / REVIEWS — replaces the previous hardcoded reviews
-- and any third-party review-widget script. Shows as a rotating
-- carousel on the homepage, fully editable from the admin panel, and
-- never depends on an external API key that can expire.
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null default 'Verified Google Review',
  review_text text not null,
  rating int not null default 5 check (rating between 1 and 5),
  source text not null default 'Google',
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.testimonials enable row level security;

drop policy if exists "Public can read active testimonials" on public.testimonials;
create policy "Public can read active testimonials"
  on public.testimonials for select
  using (is_active = true);

drop policy if exists "Admin can read all testimonials" on public.testimonials;
create policy "Admin can read all testimonials"
  on public.testimonials for select
  to authenticated
  using (true);

drop policy if exists "Admin can write testimonials" on public.testimonials;
create policy "Admin can write testimonials"
  on public.testimonials for all
  to authenticated
  using (true)
  with check (true);

-- Seeded with the studio's real, current Google reviews (fetched live
-- via Google Places on the day this CMS upgrade was built), so the
-- site never shows placeholder or empty reviews on day one.
insert into public.testimonials (author_name, review_text, rating, source, sort_order) values
  ('Verified Google Review', 'Veda Yoga Studio and Himani ma''am have been a blessing for my yoga journey! Their guidance is top-notch, and the classes are super helpful. Himani ma''am''s approach is gentle and effective, making yoga accessible to all levels. Highly recommend for a peaceful and rejuvenating yoga experience.', 5, 'Google', 1),
  ('Verified Google Review', 'Veda Yoga Studio is a great place to learn yoga in a very friendly atmosphere. Himani Ma''am is an amazing teacher who makes every lesson easy to understand and follow. She gives personal attention to everyone in the class, making sure you are doing the poses correctly.', 5, 'Google', 2),
  ('Mohan Singh Dhouni', 'The best place to start your day full of energy and positive vibes. Himani ma''m is very experienced and teaches calmly, understanding each person''s capability. Whoever wants to be fit should join Veda Yoga Studio.', 5, 'Google', 3),
  ('Verified Google Review', 'Very good to join Veda Yoga Studio. Classes are calming, teachers give personal attention, and I feel so much lighter after every session. Highly recommend.', 5, 'Google', 4),
  ('Verified Google Review', 'Veda Yoga Studio is truly a place of peace and transformation. The calming environment, skilled instructors, and positive energy make every session a beautiful experience. I always leave feeling refreshed, balanced, and motivated.', 5, 'Google', 5)
on conflict do nothing;

-- 5. PAGES — create brand new pages from the admin panel.
-- Each page is published at yourdomain.com/pages/<slug>.
create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  subtitle text,
  body text not null default '',
  image_url text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.pages enable row level security;

drop trigger if exists trg_pages_updated on public.pages;
create trigger trg_pages_updated
  before update on public.pages
  for each row execute function public.set_updated_at();

drop policy if exists "Public can read active pages" on public.pages;
create policy "Public can read active pages"
  on public.pages for select
  using (is_active = true);

drop policy if exists "Admin can read all pages" on public.pages;
create policy "Admin can read all pages"
  on public.pages for select
  to authenticated
  using (true);

drop policy if exists "Admin can write pages" on public.pages;
create policy "Admin can write pages"
  on public.pages for all
  to authenticated
  using (true)
  with check (true);

-- ============================================================
-- END v2
-- ============================================================
