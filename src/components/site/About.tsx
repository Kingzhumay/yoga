import { Star, Leaf, HeartPulse, Sparkles } from "lucide-react";
import { images, site } from "@/lib/site";
import { Reveal, RevealItem } from "./Reveal";

const pillars = [
  {
    icon: HeartPulse,
    title: "Body",
    text: "Strength, flexibility and pain-free movement through aligned asana practice.",
  },
  {
    icon: Leaf,
    title: "Mind",
    text: "Pranayama and meditation to steady breath, focus and everyday calm.",
  },
  {
    icon: Sparkles,
    title: "Soul",
    text: "Vedic roots — practice as ancient knowledge, not just exercise.",
  },
];

export function About() {
  return (
    <section id="about" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <RevealItem>
            <img
              src={images.aerial}
              alt="Aerial hammock group class at Veda Yoga Studio, Jeevan Park, Uttam Nagar, Delhi"
              width={750}
              height={525}
              loading="lazy"
              decoding="async"
              className="h-[420px] w-full rounded-[2rem] object-cover object-top shadow-[var(--shadow-soft)] sm:h-[520px]"
            />
          </RevealItem>

          <div>
            <RevealItem>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                About the studio
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-primary sm:text-4xl lg:text-5xl">
                Ancient practice, taught with modern care
              </h2>
            </RevealItem>

            <RevealItem>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                Veda Yoga Studio opened in {site.established} in Jeevan Park, Uttam Nagar as a
                boutique space for people who want real guidance — not a crowded gym floor. Batches
                stay small so every posture is corrected, every breath is guided, and beginners feel
                as welcome as advanced practitioners.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Men and women practise together in our mixed group classes, and women-only batches
                are available for those who prefer them. The studio is fully equipped with wall
                ropes, aerial hammocks, yoga wheels, blocks and belts.
              </p>
            </RevealItem>

            <RevealItem className="mt-8 inline-flex items-center gap-4 rounded-2xl surface-card px-5 py-4">
              <div className="flex" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-5 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-sm font-semibold">
                5.0 rating
                <span className="block font-normal text-muted-foreground">
                  {site.reviewCount}+ verified Justdial reviews
                </span>
              </p>
            </RevealItem>

            <ul className="mt-8 grid gap-4 sm:grid-cols-3">
              {pillars.map((p) => (
                <RevealItem as="li" key={p.title} className="rounded-2xl surface-card p-5">
                  <p.icon className="size-6 text-accent" aria-hidden />
                  <h3 className="mt-3 font-display text-lg font-bold text-primary">{p.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
                </RevealItem>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
