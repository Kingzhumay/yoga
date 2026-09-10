import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Loader2, LogOut, Plus, Save, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import type { Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { CLASS_ICON_NAMES } from "@/components/site/Classes";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

// ---------- Types ----------
type CategoryRow = { id: string; name: string; slug: string; sort_order: number };

type ClassRow = {
  id: string;
  title: string;
  description: string;
  meta: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
  image_url: string | null;
  category_id: string | null;
};

type OfferRow = {
  id: string;
  title: string;
  description: string | null;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
};

type TestimonialRow = {
  id: string;
  author_name: string;
  review_text: string;
  rating: number;
  source: string;
  is_active: boolean;
  sort_order: number;
};

type PageRow = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  body: string;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}

function newId() {
  // Only used as a stable React key for not-yet-saved rows.
  return Math.random().toString(36).slice(2);
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null | "loading">("loading");
  const [loading, setLoading] = useState(true);

  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [offers, setOffers] = useState<OfferRow[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialRow[]>([]);
  const [pages, setPages] = useState<PageRow[]>([]);

  // --- Auth guard ---
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setSession(null);
      return;
    }
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session === "loading") return;
    if (!session) {
      navigate({ to: "/admin/login" });
    }
  }, [session, navigate]);

  // --- Load data once authenticated ---
  useEffect(() => {
    if (!session || session === "loading" || !supabase) return;
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  async function loadData() {
    if (!supabase) return;
    setLoading(true);
    const [{ data: c, error: cErr }, { data: cat }, { data: o }, { data: t }, { data: p }] = await Promise.all([
      supabase.from("classes").select("*").order("sort_order"),
      supabase.from("categories").select("*").order("sort_order"),
      supabase.from("offers").select("*").order("created_at", { ascending: false }),
      supabase.from("testimonials").select("*").order("sort_order"),
      supabase.from("pages").select("*").order("sort_order"),
    ]);
    if (cErr) {
      // Most common cause: v2 migration (categories/testimonials/pages/image_url)
      // hasn't been run yet in Supabase. The classes/offers editor below still
      // works either way — extra tabs just show a helpful empty state.
      toast.error("Some tables are missing. Re-run supabase-schema.sql in Supabase → SQL Editor.");
    }
    setClasses((c as ClassRow[]) ?? []);
    setCategories((cat as CategoryRow[]) ?? []);
    setOffers((o as OfferRow[]) ?? []);
    setTestimonials((t as TestimonialRow[]) ?? []);
    setPages((p as PageRow[]) ?? []);
    setLoading(false);
  }

  async function signOut() {
    await supabase?.auth.signOut();
    navigate({ to: "/admin/login" });
  }

  // ================= Classes =================
  async function saveClass(row: ClassRow) {
    if (!supabase) return;
    const { error } = await supabase
      .from("classes")
      .update({
        title: row.title,
        description: row.description,
        meta: row.meta,
        icon: row.icon,
        image_url: row.image_url,
        category_id: row.category_id,
        is_active: row.is_active,
      })
      .eq("id", row.id);
    if (error) toast.error(error.message);
    else toast.success("Saved");
  }

  async function addClass(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!supabase) return;
    const form = new FormData(e.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    if (!title) return;
    const { error } = await supabase.from("classes").insert({
      title,
      description: String(form.get("description") ?? "").trim(),
      meta: String(form.get("meta") ?? "").trim() || "60 min",
      icon: String(form.get("icon") ?? "Users"),
      sort_order: classes.length + 1,
      is_active: true,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Class added");
    e.currentTarget.reset();
    void loadData();
  }

  async function deleteClass(id: string) {
    if (!supabase) return;
    if (!window.confirm("Delete this class? This can't be undone.")) return;
    const { error } = await supabase.from("classes").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Class deleted");
      void loadData();
    }
  }

  // ================= Categories =================
  async function addCategory(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!supabase) return;
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    if (!name) return;
    const { error } = await supabase.from("categories").insert({
      name,
      slug: slugify(name) || newId(),
      sort_order: categories.length + 1,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Category added");
    e.currentTarget.reset();
    void loadData();
  }

  async function renameCategory(row: CategoryRow) {
    if (!supabase) return;
    const { error } = await supabase.from("categories").update({ name: row.name }).eq("id", row.id);
    if (error) toast.error(error.message);
    else toast.success("Saved");
  }

  async function deleteCategory(id: string) {
    if (!supabase) return;
    if (!window.confirm("Delete this category? Classes using it will just become uncategorised.")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Category deleted");
      void loadData();
    }
  }

  // ================= Offers =================
  async function addOffer(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!supabase) return;
    const form = new FormData(e.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    if (!title) return;

    const { error } = await supabase.from("offers").insert({ title, description, is_active: true });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Offer added — now live on the site");
    e.currentTarget.reset();
    void loadData();
  }

  async function toggleOffer(id: string, is_active: boolean) {
    if (!supabase) return;
    const { error } = await supabase.from("offers").update({ is_active }).eq("id", id);
    if (error) toast.error(error.message);
    void loadData();
  }

  async function deleteOffer(id: string) {
    if (!supabase) return;
    const { error } = await supabase.from("offers").delete().eq("id", id);
    if (error) toast.error(error.message);
    void loadData();
  }

  // ================= Testimonials =================
  async function addTestimonial(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!supabase) return;
    const form = new FormData(e.currentTarget);
    const review_text = String(form.get("review_text") ?? "").trim();
    if (!review_text) return;
    const { error } = await supabase.from("testimonials").insert({
      author_name: String(form.get("author_name") ?? "").trim() || "Verified Google Review",
      review_text,
      rating: Number(form.get("rating") ?? 5),
      source: String(form.get("source") ?? "Google").trim() || "Google",
      sort_order: testimonials.length + 1,
      is_active: true,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Review added");
    e.currentTarget.reset();
    void loadData();
  }

  async function saveTestimonial(row: TestimonialRow) {
    if (!supabase) return;
    const { error } = await supabase
      .from("testimonials")
      .update({
        author_name: row.author_name,
        review_text: row.review_text,
        rating: row.rating,
        source: row.source,
        is_active: row.is_active,
      })
      .eq("id", row.id);
    if (error) toast.error(error.message);
    else toast.success("Saved");
  }

  async function deleteTestimonial(id: string) {
    if (!supabase) return;
    if (!window.confirm("Delete this review?")) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Review deleted");
      void loadData();
    }
  }

  // ================= Pages =================
  async function addPage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!supabase) return;
    const form = new FormData(e.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    if (!title) return;
    const slug = slugify(String(form.get("slug") ?? "") || title);
    if (!slug) {
      toast.error("Couldn't work out a URL for this page — try a simpler title.");
      return;
    }
    const { error } = await supabase.from("pages").insert({
      slug,
      title,
      subtitle: String(form.get("subtitle") ?? "").trim() || null,
      body: String(form.get("body") ?? "").trim(),
      sort_order: pages.length + 1,
      is_active: true,
    });
    if (error) {
      toast.error(error.message.includes("duplicate") ? "A page with that URL already exists." : error.message);
      return;
    }
    toast.success("Page created");
    e.currentTarget.reset();
    void loadData();
  }

  async function savePage(row: PageRow) {
    if (!supabase) return;
    const { error } = await supabase
      .from("pages")
      .update({
        title: row.title,
        subtitle: row.subtitle,
        body: row.body,
        image_url: row.image_url,
        is_active: row.is_active,
      })
      .eq("id", row.id);
    if (error) toast.error(error.message);
    else toast.success("Saved");
  }

  async function deletePage(id: string) {
    if (!supabase) return;
    if (!window.confirm("Delete this page? This can't be undone.")) return;
    const { error } = await supabase.from("pages").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Page deleted");
      void loadData();
    }
  }

  if (session === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!session) return null;

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Studio Admin</h1>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </div>

        <Tabs defaultValue="classes" className="mt-8">
          <TabsList className="flex h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
            <TabsTrigger value="classes" className="rounded-full border border-border data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              Classes
            </TabsTrigger>
            <TabsTrigger value="categories" className="rounded-full border border-border data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              Categories
            </TabsTrigger>
            <TabsTrigger value="offers" className="rounded-full border border-border data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              Offers &amp; Events
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="rounded-full border border-border data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              Reviews
            </TabsTrigger>
            <TabsTrigger value="pages" className="rounded-full border border-border data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              Pages
            </TabsTrigger>
          </TabsList>

          {/* ---- Classes ---- */}
          <TabsContent value="classes" className="mt-6">
            <p className="text-sm text-muted-foreground">
              Edit what shows on the homepage — including a photo for each class. Changes go live immediately.
            </p>

            <form onSubmit={addClass} className="mt-4 space-y-3 rounded-xl border border-dashed border-border p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Add a new class</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <input name="title" required placeholder="Title, e.g. Power Yoga" className="min-h-11 rounded-lg border border-border bg-background px-3 text-sm" />
                <input name="meta" placeholder='Meta, e.g. "45 min · All levels"' className="min-h-11 rounded-lg border border-border bg-background px-3 text-sm" />
              </div>
              <textarea name="description" rows={2} placeholder="Short description" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
              <div className="flex flex-wrap items-center gap-3">
                <label className="text-xs font-semibold text-muted-foreground">
                  Icon{" "}
                  <select name="icon" defaultValue="Users" className="ml-1 rounded-lg border border-border bg-background px-2 py-1.5 text-sm">
                    {CLASS_ICON_NAMES.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </label>
                <button type="submit" className="ml-auto inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground">
                  <Plus className="size-3.5" /> Add class
                </button>
              </div>
            </form>

            <div className="mt-4 space-y-4">
              {classes.map((c, i) => (
                <div key={c.id} className="rounded-xl border border-border p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground">Title</label>
                      <input
                        value={c.title}
                        onChange={(e) => {
                          const next = [...classes];
                          next[i] = { ...c, title: e.target.value };
                          setClasses(next);
                        }}
                        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground">
                        Meta (e.g. "60 min · All levels")
                      </label>
                      <input
                        value={c.meta}
                        onChange={(e) => {
                          const next = [...classes];
                          next[i] = { ...c, meta: e.target.value };
                          setClasses(next);
                        }}
                        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="text-xs font-semibold text-muted-foreground">Description</label>
                    <textarea
                      value={c.description}
                      onChange={(e) => {
                        const next = [...classes];
                        next[i] = { ...c, description: e.target.value };
                        setClasses(next);
                      }}
                      rows={2}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    />
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground">Category</label>
                      <select
                        value={c.category_id ?? ""}
                        onChange={(e) => {
                          const next = [...classes];
                          next[i] = { ...c, category_id: e.target.value || null };
                          setClasses(next);
                        }}
                        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                      >
                        <option value="">Uncategorised</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground">Icon (used if no photo)</label>
                      <select
                        value={c.icon}
                        onChange={(e) => {
                          const next = [...classes];
                          next[i] = { ...c, icon: e.target.value };
                          setClasses(next);
                        }}
                        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                      >
                        {CLASS_ICON_NAMES.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="text-xs font-semibold text-muted-foreground">Photo</label>
                    <div className="mt-1">
                      <ImageUploader
                        value={c.image_url}
                        aspectRatio={4 / 3}
                        aspectLabel="4:3 landscape"
                        folder="classes"
                        onChange={(url) => {
                          const next = [...classes];
                          next[i] = { ...c, image_url: url };
                          setClasses(next);
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={c.is_active}
                        onChange={(e) => {
                          const next = [...classes];
                          next[i] = { ...c, is_active: e.target.checked };
                          setClasses(next);
                        }}
                      />
                      Visible on site
                    </label>
                    <div className="flex items-center gap-2">
                      <button onClick={() => deleteClass(c.id)} aria-label="Delete class" className="grid size-8 place-items-center rounded-full text-destructive">
                        <Trash2 className="size-4" />
                      </button>
                      <button
                        onClick={() => saveClass(classes[i])}
                        className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground"
                      >
                        <Save className="size-3.5" /> Save
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {classes.length === 0 && <p className="text-sm text-muted-foreground">No classes yet — add one above.</p>}
            </div>
          </TabsContent>

          {/* ---- Categories ---- */}
          <TabsContent value="categories" className="mt-6">
            <p className="text-sm text-muted-foreground">
              Group classes into categories (e.g. Group Classes, Women Only). Assign a class to a category from the Classes tab.
            </p>

            <form onSubmit={addCategory} className="mt-4 flex flex-wrap gap-2 rounded-xl border border-dashed border-border p-4">
              <input name="name" required placeholder="New category name" className="min-w-[200px] flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm" />
              <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground">
                <Plus className="size-4" /> Add category
              </button>
            </form>

            <div className="mt-4 space-y-2">
              {categories.map((cat, i) => (
                <div key={cat.id} className="flex items-center gap-2 rounded-xl border border-border p-3">
                  <input
                    value={cat.name}
                    onChange={(e) => {
                      const next = [...categories];
                      next[i] = { ...cat, name: e.target.value };
                      setCategories(next);
                    }}
                    className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  />
                  <button onClick={() => renameCategory(categories[i])} className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground">
                    <Save className="size-3.5" /> Save
                  </button>
                  <button onClick={() => deleteCategory(cat.id)} aria-label="Delete category">
                    <Trash2 className="size-4 text-destructive" />
                  </button>
                </div>
              ))}
              {categories.length === 0 && <p className="text-sm text-muted-foreground">No categories yet.</p>}
            </div>
          </TabsContent>

          {/* ---- Offers / events ---- */}
          <TabsContent value="offers" className="mt-6">
            <p className="text-sm text-muted-foreground">
              Add a festival offer or workshop announcement — it shows as a banner on the homepage.
            </p>

            <form onSubmit={addOffer} className="mt-4 flex flex-wrap gap-2 rounded-xl border border-border p-4">
              <input
                name="title"
                required
                placeholder="e.g. Diwali Offer: 20% off annual membership"
                className="min-w-[240px] flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
              <input
                name="description"
                placeholder="Optional details"
                className="min-w-[200px] flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
              >
                <Plus className="size-4" /> Add
              </button>
            </form>

            <div className="mt-4 space-y-2">
              {offers.map((o) => (
                <div key={o.id} className="flex items-center justify-between rounded-xl border border-border p-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{o.title}</p>
                    {o.description && <p className="text-xs text-muted-foreground">{o.description}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 text-xs">
                      <input type="checkbox" checked={o.is_active} onChange={(e) => toggleOffer(o.id, e.target.checked)} />
                      Active
                    </label>
                    <button onClick={() => deleteOffer(o.id)} aria-label="Delete offer">
                      <Trash2 className="size-4 text-destructive" />
                    </button>
                  </div>
                </div>
              ))}
              {offers.length === 0 && <p className="text-sm text-muted-foreground">No offers yet.</p>}
            </div>
          </TabsContent>

          {/* ---- Testimonials / reviews ---- */}
          <TabsContent value="testimonials" className="mt-6">
            <p className="text-sm text-muted-foreground">
              These are the reviews shown in a rotating carousel on the homepage. No third-party widget or
              expiring API key involved — everything lives here.
            </p>

            <form onSubmit={addTestimonial} className="mt-4 space-y-3 rounded-xl border border-dashed border-border p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Add a review</p>
              <div className="grid gap-3 sm:grid-cols-3">
                <input name="author_name" placeholder="Reviewer name (optional)" className="min-h-11 rounded-lg border border-border bg-background px-3 text-sm sm:col-span-2" />
                <select name="rating" defaultValue="5" className="min-h-11 rounded-lg border border-border bg-background px-3 text-sm">
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} star{n === 1 ? "" : "s"}
                    </option>
                  ))}
                </select>
              </div>
              <textarea name="review_text" required rows={2} placeholder="Review text" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
              <div className="flex items-center gap-3">
                <input name="source" placeholder='Source (default "Google")' className="min-h-11 flex-1 rounded-lg border border-border bg-background px-3 text-sm" />
                <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground">
                  <Plus className="size-3.5" /> Add review
                </button>
              </div>
            </form>

            <div className="mt-4 space-y-3">
              {testimonials.map((t, i) => (
                <div key={t.id} className="rounded-xl border border-border p-4">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <input
                      value={t.author_name}
                      onChange={(e) => {
                        const next = [...testimonials];
                        next[i] = { ...t, author_name: e.target.value };
                        setTestimonials(next);
                      }}
                      className="rounded-lg border border-border bg-background px-3 py-2 text-sm sm:col-span-2"
                    />
                    <select
                      value={t.rating}
                      onChange={(e) => {
                        const next = [...testimonials];
                        next[i] = { ...t, rating: Number(e.target.value) };
                        setTestimonials(next);
                      }}
                      className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    >
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>
                          {n} star{n === 1 ? "" : "s"}
                        </option>
                      ))}
                    </select>
                  </div>
                  <textarea
                    value={t.review_text}
                    onChange={(e) => {
                      const next = [...testimonials];
                      next[i] = { ...t, review_text: e.target.value };
                      setTestimonials(next);
                    }}
                    rows={2}
                    className="mt-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  />
                  <div className="mt-3 flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={t.is_active}
                        onChange={(e) => {
                          const next = [...testimonials];
                          next[i] = { ...t, is_active: e.target.checked };
                          setTestimonials(next);
                        }}
                      />
                      Visible on site
                    </label>
                    <div className="flex items-center gap-2">
                      <button onClick={() => deleteTestimonial(t.id)} aria-label="Delete review" className="grid size-8 place-items-center rounded-full text-destructive">
                        <Trash2 className="size-4" />
                      </button>
                      <button
                        onClick={() => saveTestimonial(testimonials[i])}
                        className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground"
                      >
                        <Save className="size-3.5" /> Save
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {testimonials.length === 0 && <p className="text-sm text-muted-foreground">No reviews yet — add one above.</p>}
            </div>
          </TabsContent>

          {/* ---- Pages ---- */}
          <TabsContent value="pages" className="mt-6">
            <p className="text-sm text-muted-foreground">
              Create brand new pages — each one is published at <code>yourdomain.com/pages/&lt;url&gt;</code>.
            </p>

            <form onSubmit={addPage} className="mt-4 space-y-3 rounded-xl border border-dashed border-border p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Create a new page</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <input name="title" required placeholder="Page title, e.g. Diwali Workshop" className="min-h-11 rounded-lg border border-border bg-background px-3 text-sm" />
                <input name="slug" placeholder="URL (optional — auto-generated from title)" className="min-h-11 rounded-lg border border-border bg-background px-3 text-sm" />
              </div>
              <input name="subtitle" placeholder="Subtitle (optional)" className="min-h-11 w-full rounded-lg border border-border bg-background px-3 text-sm" />
              <textarea name="body" rows={4} placeholder="Page content — separate paragraphs with a blank line" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
              <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground">
                <Plus className="size-3.5" /> Create page
              </button>
            </form>

            <div className="mt-4 space-y-4">
              {pages.map((p, i) => (
                <div key={p.id} className="rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <input
                      value={p.title}
                      onChange={(e) => {
                        const next = [...pages];
                        next[i] = { ...p, title: e.target.value };
                        setPages(next);
                      }}
                      className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold"
                    />
                    <a
                      href={`/pages/${p.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-accent"
                    >
                      /pages/{p.slug} <ExternalLink className="size-3" />
                    </a>
                  </div>
                  <input
                    value={p.subtitle ?? ""}
                    onChange={(e) => {
                      const next = [...pages];
                      next[i] = { ...p, subtitle: e.target.value };
                      setPages(next);
                    }}
                    placeholder="Subtitle"
                    className="mt-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  />
                  <textarea
                    value={p.body}
                    onChange={(e) => {
                      const next = [...pages];
                      next[i] = { ...p, body: e.target.value };
                      setPages(next);
                    }}
                    rows={4}
                    className="mt-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  />
                  <div className="mt-3">
                    <label className="text-xs font-semibold text-muted-foreground">Photo</label>
                    <div className="mt-1">
                      <ImageUploader
                        value={p.image_url}
                        aspectRatio={16 / 9}
                        aspectLabel="16:9 wide"
                        folder="pages"
                        onChange={(url) => {
                          const next = [...pages];
                          next[i] = { ...p, image_url: url };
                          setPages(next);
                        }}
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={p.is_active}
                        onChange={(e) => {
                          const next = [...pages];
                          next[i] = { ...p, is_active: e.target.checked };
                          setPages(next);
                        }}
                      />
                      Published
                    </label>
                    <div className="flex items-center gap-2">
                      <button onClick={() => deletePage(p.id)} aria-label="Delete page" className="grid size-8 place-items-center rounded-full text-destructive">
                        <Trash2 className="size-4" />
                      </button>
                      <button
                        onClick={() => savePage(pages[i])}
                        className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground"
                      >
                        <Save className="size-3.5" /> Save
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {pages.length === 0 && <p className="text-sm text-muted-foreground">No pages yet — create one above.</p>}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
