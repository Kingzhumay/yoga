import { motion } from "motion/react";
import { images } from "@/lib/site";
import { Reveal, RevealItem } from "./Reveal";

const shots = [
  {
    src: images.wheel,
    alt: "Group class using yoga wheels and blocks during a side-bend sequence at Veda Yoga Studio",
    w: 1200,
    h: 1600,
    span: "sm:row-span-2",
  },
  {
    src: images.aerial,
    alt: "Aerial hammock group class practising standing and reclined postures together",
    w: 750,
    h: 525,
    span: "",
  },
  {
    src: images.instructor,
    alt: "Veda Yoga Studio founder speaking at the International Day of Yoga event",
    w: 750,
    h: 1068,
    span: "",
  },
  {
    src: images.groupPhoto,
    alt: "Veda Yoga Studio students at the International Day of Yoga celebration",
    w: 750,
    h: 1068,
    span: "sm:col-span-2",
  },
];

export function Gallery() {
  return (
    <section id="gallery" className="bg-secondary/50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <RevealItem className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Gallery</p>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-primary sm:text-4xl lg:text-5xl">
              Inside the studio
            </h2>
          </RevealItem>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {shots.map((s) => (
              <RevealItem key={s.src} className={s.span}>
                <motion.figure
                  whileHover={{ scale: 1.015 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="h-full overflow-hidden rounded-[1.5rem] surface-card"
                >
                  <img
                    src={s.src}
                    alt={s.alt}
                    width={s.w}
                    height={s.h}
                    loading="lazy"
                    decoding="async"
                    className="h-64 w-full object-cover sm:h-full sm:min-h-64"
                  />
                </motion.figure>
              </RevealItem>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
