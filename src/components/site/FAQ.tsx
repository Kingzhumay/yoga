import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus } from "lucide-react";
import { Reveal, RevealItem } from "./Reveal";

export const faqs = [
  {
    q: "Where exactly is Veda Yoga Studio located?",
    a: "We are at C-24, Jeevan Park, Uttam Nagar, New Delhi 110059 — a short walk from Uttam Nagar East metro station, with easy parking on the lane.",
  },
  {
    q: "Do you offer a free trial class?",
    a: "Yes. Your first class is free. Share your name and number in the enquiry form or on WhatsApp and we will place you in the batch that fits your timing.",
  },
  {
    q: "What are your batch timings?",
    a: "Morning and evening batches run Monday to Sunday, 6:00 AM to 8:00 PM. Personal one-on-one sessions can be scheduled outside these hours on request.",
  },
  {
    q: "I am a complete beginner. Is that okay?",
    a: "Absolutely. Batches are small and every posture is taught step by step with hands-on correction, so beginners practise safely from day one.",
  },
  {
    q: "Do you have women-only batches?",
    a: "Yes. Dedicated women-only batches cover general fitness, hormonal balance, prenatal, postnatal and weight care.",
  },
  {
    q: "Do you teach yoga at home?",
    a: "Yes, personal home sessions are available in and around Uttam Nagar, Jeevan Park, Vikaspuri and Janakpuri. Ask us on WhatsApp for the schedule and fee.",
  },
  {
    q: "What should I bring to my first class?",
    a: "Comfortable clothing, a water bottle and an empty stomach (two hours after a meal). Mats and props including aerial hammocks and yoga wheels are provided.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal>
          <RevealItem className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">FAQ</p>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-primary sm:text-4xl lg:text-5xl">
              Questions before your first mat
            </h2>
          </RevealItem>

          <ul className="mt-10 space-y-3">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <RevealItem as="li" key={f.q}>
                  <div className="overflow-hidden rounded-[1.25rem] surface-card">
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-secondary/60"
                    >
                      <span className="font-display text-base font-semibold text-primary sm:text-lg">
                        {f.q}
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.28, ease: "easeOut" }}
                        className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"
                      >
                        <Plus className="size-4" aria-hidden />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
                        >
                          <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                            {f.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </RevealItem>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
