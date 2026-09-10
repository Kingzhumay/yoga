import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Star, Quote } from "lucide-react";
import { site } from "@/lib/site";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Reveal, RevealItem } from "./Reveal";

type ReviewItem = { name: string; role: string; text: string; rating: number };

// Static fallback — the site must never show a blank testimonials section
// just because Supabase is unreachable or not configured yet.
const fallbackReviews: ReviewItem[] = [
  {
    name: "Pooja Sharma",
    role: "Jeevan Park",
    text: "Manish sir har posture personally correct karate hain. Six months mein meri lower-back pain almost gayab ho gayi.",
    rating: 5,
  },
  {
    name: "Ankit Verma",
    role: "Uttam Nagar",
    text: "Morning batch ka maahaul bahut shaant hai. Breathing sessions ke baad pura din energy rehti hai.",
    rating: 5,
  },
  {
    name: "Ritika Jain",
    role: "Bindapur",
    text: "Women-only batch ki wajah se main comfortable feel karti hoon. Aerial yoga ekdum alag experience hai.",
    rating: 5,
  },
  {
    name: "Sourabh Gupta",
    role: "Dwarka Mor",
    text: "Desk job ki stiffness ke liye yoga wheel therapy join ki thi — posture visibly improve hua hai.",
    rating: 5,
  },
];

const PAGE_SIZE = 4;
const ROTATE_MS = 7000;

export function Testimonials() {
  const [reviews, setReviews] = useState<ReviewItem[]>(fallbackReviews);
  const [page, setPage] = useState(0);

  // --- Load reviews from the admin-editable testimonials table ---
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return; // keep fallback content

    let cancelled = false;
    supabase
      .from("testimonials")
      .select("author_name, review_text, rating, source")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data, error }) => {
        if (cancelled || error || !data || data.length === 0) return; // keep fallback on any failure
        setReviews(
          data.map((d) => ({
            name: d.author_name,
            role: d.source,
            text: d.review_text,
            rating: d.rating,
          })),
        );
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const pageCount = Math.max(1, Math.ceil(reviews.length / PAGE_SIZE));

  // --- Auto-rotate through pages of reviews, like a review-widget carousel ---
  useEffect(() => {
    if (pageCount <= 1) return;
    const id = setInterval(() => setPage((p) => (p + 1) % pageCount), ROTATE_MS);
    return () => clearInterval(id);
  }, [pageCount]);

  const visible = reviews.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <section id="testimonials" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <RevealItem className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              Testimonials
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-primary sm:text-4xl lg:text-5xl">
              A {site.rating.toFixed(1)} rated neighbourhood studio
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Students from Uttam Nagar, Jeevan Park and Dwarka Mor practise with us every day.
            </p>
          </RevealItem>

          <div className="relative mt-10 min-h-[220px]">
            <AnimatePresence mode="wait">
              <motion.ul
                key={page}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="grid gap-5 sm:grid-cols-2"
              >
                {visible.map((r, i) => (
                  <li key={`${page}-${i}`}>
                    <figure className="flex h-full flex-col rounded-[1.5rem] surface-card p-6">
                      <Quote className="size-7 text-gold" aria-hidden />
                      <blockquote className="mt-4 flex-1 text-base leading-relaxed text-foreground/85">
                        {r.text}
                      </blockquote>
                      <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
                        <figcaption>
                          <span className="block font-display font-bold text-primary">{r.name}</span>
                          <span className="block text-xs uppercase tracking-[0.16em] text-muted-foreground">
                            {r.role}
                          </span>
                        </figcaption>
                        <span className="flex items-center gap-0.5" aria-label={`${r.rating} out of 5 stars`}>
                          {Array.from({ length: 5 }).map((_, s) => (
                            <Star
                              key={s}
                              className={s < r.rating ? "size-4 fill-gold text-gold" : "size-4 text-border"}
                              aria-hidden
                            />
                          ))}
                        </span>
                      </div>
                    </figure>
                  </li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>

          {pageCount > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              {Array.from({ length: pageCount }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Show reviews page ${i + 1}`}
                  onClick={() => setPage(i)}
                  className={
                    i === page
                      ? "h-2 w-6 rounded-full bg-accent transition-all"
                      : "h-2 w-2 rounded-full bg-border transition-all"
                  }
                />
              ))}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
