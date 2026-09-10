# Veda Yoga Studio — Admin Panel Setup

## One-time setup (do this once, ~15 minutes)

### 1. Create a free Supabase project
1. Go to https://supabase.com → sign up free → "New Project"
2. Wait ~2 minutes for it to provision
3. Go to **Project Settings → API** and copy the "Project URL" and the "anon public" key

### 2. Run the database setup
1. In Supabase, go to **SQL Editor → New Query**
2. Open `supabase-schema.sql` from this project, copy everything, paste it in, click **Run**
3. This creates the tables and pre-fills them with the current classes

### 3. Add yourself as the admin
1. In Supabase, go to **Authentication → Users → Add User**
2. Enter your own email address (this is the ONLY login that will work)
3. Do NOT enable public sign-ups anywhere in the project

### 4. Connect the website to Supabase
1. Copy `.env.example` to a new file named `.env`
2. Paste in your Project URL and anon key from step 1
3. Also set these same two values as Environment Variables in your
   Cloudflare Pages dashboard (Settings → Environment Variables) —
   local `.env` only works for testing on your own computer

### 5. Set up the Google Sheets sync (optional but recommended)
Follow Chapter 34 of the agency guide (Apps Script webhook), then paste
the webhook URL into `src/lib/site.ts` → `endpoints.googleSheetsWebhook`.

---

## Daily use — how to edit your website

1. Go to **yourdomain.com/admin**
2. Enter your email → check your inbox → click the login link
3. **Classes**: edit any class's title, description, timing text, category, or photo → click Save.
   You can also add brand new classes or delete old ones from this tab.
4. **Categories**: create/rename/delete groupings (e.g. "Women Only", "Aerial") to organise your classes.
5. **Offers & Events**: type an offer title (e.g. "Diwali Offer: 20% off") → click Add
   — it appears instantly as a banner at the top of your website.
   To remove an offer, uncheck "Active" or click the trash icon.
6. **Reviews**: the rotating testimonials on your homepage are fully editable here —
   add, edit, hide, or delete reviews. No third-party review widget or API key required.
7. **Pages**: create brand new pages (e.g. a workshop announcement, a detailed policy page).
   Each one is published instantly at `yourdomain.com/pages/<url>`.
8. **Photos**: anywhere you see "Upload image", pick a JPG, PNG or WEBP file up to 4MB.
   The admin panel checks the file type, size, and proportions before uploading, and tells
   you right away if something doesn't fit.
9. Changes are live immediately — no need to wait, no need to contact your developer.

## v2 upgrade — one extra step if your site was set up before this update

If you already ran `supabase-schema.sql` once before, just open it again, copy the whole
file (it now includes a "v2 — CMS UPGRADE" section at the bottom), and run it again in
Supabase → SQL Editor → New Query. It's written to be safe to re-run: it only adds the new
photo/category/review/page tables and the image storage bucket, and never touches or
duplicates your existing classes or offers.

---

## If something looks wrong
- If the site shows the OLD content and doesn't reflect your edit, refresh the page (Ctrl+R / Cmd+R)
- If you can't log in, check that you're using the exact email added in Supabase Authentication
- If the admin panel won't load at all, the website will still work fine for visitors —
  the public site never depends on the admin panel being available
