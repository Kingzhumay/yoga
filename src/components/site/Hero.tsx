import { motion } from "motion/react";
import { Star, ArrowDown } from "lucide-react";
import { images, site } from "@/lib/site";
import { breathe, useMotionProfile } from "@/lib/motion";

export function Hero() {
  const profile = useMotionProfile();
  const mobile = profile === "mobile";
  const still = profile === "reduced";
  const d = (v: number) => (still ? 0 : mobile ? v * 0.6 : v);

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-cream pt-28 pb-16 sm:pt-32 lg:pt-40 lg:pb-24"
    >
      {/* diagonal geometric accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 -z-10 size-[26rem] rotate-45 rounded-[3rem] bg-secondary/70"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-28 bottom-10 -z-10 size-72 rotate-12 rounded-[3rem] border border-gold/40"
      />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: d(0.8), ease: breathe }}
            className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-card px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary"
          >
            <Star className="size-3.5 fill-gold text-gold" />
            5.0 · {site.reviewCount}+ Reviews · Uttam Nagar
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: d(1.1), ease: breathe, delay: d(0.1) }}
            className="mt-6 font-display text-[clamp(2.6rem,10vw,6.5rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.04em] text-primary"
          >
            Veda
            <br />
            Yoga
            <br />
            <span className="text-accent">Studio</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: d(1), ease: breathe, delay: d(0.2) }}
            className="mt-6 max-w-lg text-balance-tight text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            <span className="font-semibold text-foreground">Healthy Body · Mind · Soul.</span>{" "}
            Group, personal, aerial and therapeutic yoga in Jeevan Park, Uttam Nagar — guided by
            certified instructor Manish.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: d(0.9), ease: breathe, delay: d(0.3) }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="inline-flex min-h-12 items-center rounded-full bg-accent px-7 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-soft)]"
            >
              Book a Free Trial
            </motion.a>
            <motion.a
              href="#classes"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-primary/30 px-6 text-sm font-semibold text-primary"
            >
              Explore Classes <ArrowDown className="size-4" />
            </motion.a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: still ? 1 : 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: d(1.2), ease: breathe, delay: d(0.15) }}
          className="grid grid-cols-2 gap-3 sm:gap-4"
        >
          <img
            src={images.scorpion}
            alt="Veda Yoga Studio instructor holding a scorpion pose outdoors at sunset"
            width={750}
            height={1080}
            fetchPriority="high"
            decoding="async"
            className="col-span-1 h-full w-full rounded-[1.75rem] object-cover shadow-[var(--shadow-lift)]"
          />
          <div className="grid gap-3 sm:gap-4">
            <img
              src={images.wheel}
              alt="Students using yoga wheels and blocks during a side-bend sequence at Veda Yoga Studio"
              width={1200}
              height={1600}
              loading="lazy"
              decoding="async"
              className="h-full w-full rounded-[1.75rem] object-cover shadow-[var(--shadow-soft)]"
            />
            <div className="rounded-[1.75rem] bg-veda p-5 text-primary-foreground">
              <p className="font-display text-3xl font-bold">Since 2024</p>
              <p className="mt-1 text-sm opacity-85">Boutique studio, small batches</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
