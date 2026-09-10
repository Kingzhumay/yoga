import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Users,
  User,
  Flower2,
  Wind,
  CircleDot,
  Heart,
  Sparkles,
  Sun,
  Moon,
  Dumbbell,
  Baby,
  Waves,
  HeartPulse,
  type LucideIcon,
} from "lucide-react";
import { Reveal, RevealItem } from "./Reveal";
import { waLink } from "@/lib/site";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

// Icon choices available for a class in the admin panel. Keep this list in
// sync with the <select> options in src/routes/admin/index.tsx — any name
// picked there must exist here, or it silently falls back to Users below.
export const CLASS_ICON_NAMES = [
  "Users",
  "User",
  "Flower2",
  "Wind",
  "CircleDot",
  "Heart",
  "Sparkles",
  "Sun",
  "Moon",
  "Dumbbell",
  "Baby",
  "Waves",
  "HeartPulse",
] as const;

// Static fallback — used if Supabase isn't configured yet, or a fetch fails.
// The site must NEVER break or show blank content just because the
// admin backend is unreachable.
const fallbackClasses = [
  {
    icon: "Users",
    title: "Group Yoga",
    text: "Mixed morning and evening batches — asana, pranayama and relaxation in a small group.",
    meta: "60 min · All levels",
  },
  {
    icon: "User",
    title: "Personal / 1-on-1 Yoga",
    text: "A private plan built around your body, injuries and goals, at the studio or at home.",
    meta: "60 min · Custom plan",
  },
  {
    icon: "Flower2",
    title: "Yoga for Women",
    text: "Women-only batches covering hormonal balance, prenatal, postnatal and weight care.",
    meta: "60 min · Women only",
  },
  {
    icon: "Wind",
    title: "Aerial Yoga",
    text: "Hammock-supported inversions that decompress the spine and build core control.",
    meta: "60 min · Beginner friendly",
  },
  {
    icon: "CircleDot",
    title: "Yoga Wheel Therapy",
    text: "Wheel and prop-assisted backbends for posture correction and desk-job back pain.",
    meta: "45 min · Therapeutic",
  },
];

const iconMap: Record<string, LucideIcon> = {
  Users,
  User,
  Flower2,
  Wind,
  CircleDot,
  Heart,
  Sparkles,
  Sun,
  Moon,
  Dumbbell,
  Baby,
  Waves,
  HeartPulse,
};

type ClassItem = { icon: string; title: string; text: string; meta: string; image?: string | null };

export function Classes() {
  const [classes, setClasses] = useState<ClassItem[]>(fallbackClasses);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return; // keep fallback content

    let cancelled = false;
    supabase
      .from("classes")
      .select("title, description, meta, icon, image_url")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data, error }) => {
        if (cancelled || error || !data || data.length === 0) return; // keep fallback on any failure
        setClasses(
          data.map((d) => ({
            icon: d.icon,
            title: d.title,
            text: d.description,
            meta: d.meta,
            image: d.image_url,
          })),
        );
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="classes" className="bg-secondary/50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <RevealItem className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              Classes &amp; services
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-primary sm:text-4xl lg:text-5xl">
              Five ways to practise with us
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Every format is taught by a certified instructor with hands-on correction.
            </p>
          </RevealItem>

          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((c) => {
              const Icon = iconMap[c.icon] ?? Users;
              return (
                <RevealItem as="li" key={c.title}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex h-full flex-col rounded-[1.5rem] surface-card p-6"
                  >
                    {c.image ? (
                      <img
                        src={c.image}
                        alt=""
                        className="h-40 w-full rounded-xl object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="size-6" aria-hidden />
                      </span>
                    )}
                    <h3 className="mt-5 font-display text-xl font-bold text-primary">{c.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {c.text}
                    </p>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                      {c.meta}
                    </p>
                    <a
                      href={waLink(`Hi Veda Yoga Studio, I'd like to know more about ${c.title}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex min-h-12 items-center text-sm font-semibold text-accent transition-colors hover:text-primary"
                    >
                      Enquire on WhatsApp →
                    </a>
                  </motion.div>
                </RevealItem>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
