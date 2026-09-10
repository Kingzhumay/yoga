import { Instagram, Youtube, BadgeCheck } from "lucide-react";
import { images, site } from "@/lib/site";
import { Reveal, RevealItem } from "./Reveal";

const credentials = [
  "Certified yoga instructor (Hatha, Ashtanga & Vinyasa)",
  "Aerial yoga & yoga wheel therapy trained",
  "Therapeutic yoga for back pain, thyroid & PCOS",
  "Leads International Yoga Day sessions in Delhi",
];

export function Instructor() {
  return (
    <section id="instructor" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <RevealItem>
            <img
              src={images.instructor}
              alt="Manish, founder and lead instructor of Veda Yoga Studio, speaking at an International Yoga Day event"
              width={750}
              height={1080}
              loading="lazy"
              decoding="async"
              className="h-[440px] w-full rounded-[2rem] object-cover object-top shadow-[var(--shadow-lift)] sm:h-[540px]"
            />
          </RevealItem>

          <div>
            <RevealItem>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                Your instructor
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-primary sm:text-4xl lg:text-5xl">
                Manish — founder &amp; lead teacher
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                Manish founded Veda Yoga Studio to bring disciplined, traditional practice to Uttam
                Nagar with modern anatomy-aware teaching. He works closely with beginners, seniors
                and people recovering from desk-job pain, and also teaches advanced arm balances and
                inversions for students who want to go further.
              </p>
            </RevealItem>

            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {credentials.map((c) => (
                <RevealItem as="li" key={c} className="flex gap-3 rounded-2xl surface-card p-4">
                  <BadgeCheck className="mt-0.5 size-5 shrink-0 text-gold" aria-hidden />
                  <span className="text-sm leading-relaxed">{c}</span>
                </RevealItem>
              ))}
            </ul>

            <RevealItem className="mt-7 flex flex-wrap gap-3">
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                <Instagram className="size-4" /> {site.instagramHandle}
              </a>
              <a
                href={site.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-primary/30 px-5 text-sm font-semibold text-primary transition-transform hover:-translate-y-0.5"
              >
                <Youtube className="size-4" /> {site.youtubeHandle}
              </a>
            </RevealItem>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
