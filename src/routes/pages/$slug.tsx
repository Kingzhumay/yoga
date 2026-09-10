import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const Route = createFileRoute("/pages/$slug")({
  head: () => ({
    meta: [{ name: "robots", content: "index, follow" }],
  }),
  component: CustomPage,
});

type PageData = {
  title: string;
  subtitle: string | null;
  body: string;
  image_url: string | null;
};

function CustomPage() {
  const { slug } = Route.useParams();
  const [page, setPage] = useState<PageData | null | "loading" | "not-configured">("loading");

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setPage("not-configured");
      return;
    }
    let cancelled = false;
    setPage("loading");
    supabase
      .from("pages")
      .select("title, subtitle, body, image_url")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        setPage((data as PageData) ?? null);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (page === "loading") {
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (page === null || page === "not-configured") {
    return (
      <main className="grid min-h-screen place-items-center bg-background px-4 py-20">
        <div className="max-w-md text-center">
          <h1 className="font-display text-2xl font-bold text-foreground">Page not found</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            This page doesn't exist, or isn't published yet.
          </p>
          <Link to="/" className="mt-6 inline-flex min-h-12 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground">
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  const paragraphs = page.body.split(/\n{2,}/).filter(Boolean);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pb-24 pt-28">
        <article className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="font-display text-3xl font-bold leading-tight text-primary sm:text-4xl">
            {page.title}
          </h1>
          {page.subtitle && <p className="mt-3 text-lg text-muted-foreground">{page.subtitle}</p>}
          {page.image_url && (
            <img
              src={page.image_url}
              alt=""
              className="mt-8 w-full rounded-[1.5rem] object-cover"
              loading="lazy"
            />
          )}
          <div className="mt-8 space-y-5 text-base leading-relaxed text-foreground/85">
            {paragraphs.length > 0 ? (
              paragraphs.map((para, i) => <p key={i}>{para}</p>)
            ) : (
              <p className="text-muted-foreground">This page doesn't have any content yet.</p>
            )}
          </div>
        </article>
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
