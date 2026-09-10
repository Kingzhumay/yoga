import { createFileRoute, Link } from "@tanstack/react-router";
import { site } from "@/lib/site";

export const Route = createFileRoute("/$")({
  head: () => ({
    meta: [
      { title: "Page not found — Veda Yoga Studio" },
      { name: "robots", content: "noindex" },
      { name: "description", content: "This page doesn't exist at Veda Yoga Studio." },
      { property: "og:title", content: "Page not found — Veda Yoga Studio" },
      { property: "og:description", content: "This page doesn't exist at Veda Yoga Studio." },
    ],
  }),
  component: NotFound,
});

function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-20">
      <div className="max-w-md text-center">
        <p className="font-display text-7xl font-bold text-primary">404</p>
        <h1 className="mt-4 font-display text-2xl font-bold text-foreground">
          This posture doesn't exist
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you're looking for has moved or was never here. Let's take you back to the mat.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex min-h-12 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground"
          >
            Back to home
          </Link>
          <a
            href={`tel:+91${site.phonePrimary}`}
            className="inline-flex min-h-12 items-center rounded-full border border-border px-6 text-sm font-semibold text-primary"
          >
            Call {site.phonePrimary}
          </a>
        </div>
      </div>
    </main>
  );
}
