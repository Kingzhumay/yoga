import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Calculator } from "lucide-react";
import { waLink } from "@/lib/site";
import { Reveal, RevealItem } from "./Reveal";
import { cn } from "@/lib/utils";

const formats = [
  { id: "group", label: "Group Yoga", monthly: 1500 },
  { id: "women", label: "Yoga for Women", monthly: 1800 },
  { id: "aerial", label: "Aerial Yoga", monthly: 2500 },
  { id: "wheel", label: "Yoga Wheel Therapy", monthly: 2500 },
  { id: "personal", label: "Personal / 1-on-1", monthly: 6000 },
] as const;

const durations = [
  { id: 1, label: "1 month", discount: 0 },
  { id: 3, label: "3 months", discount: 0.05 },
  { id: 6, label: "6 months", discount: 0.1 },
  { id: 12, label: "12 months", discount: 0.15 },
] as const;

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function PriceCalculator() {
  const [format, setFormat] = useState<(typeof formats)[number]["id"]>("group");
  const [months, setMonths] = useState<(typeof durations)[number]["id"]>(3);
  const [homeVisit, setHomeVisit] = useState(false);

  const picked = formats.find((f) => f.id === format)!;
  const plan = durations.find((d) => d.id === months)!;

  const { base, saved, total } = useMemo(() => {
    const monthly = picked.monthly + (homeVisit ? 1000 : 0);
    const base = monthly * plan.id;
    const saved = Math.round(base * plan.discount);
    return { base, saved, total: base - saved };
  }, [picked, plan, homeVisit]);

  const message =
    `Hi Veda Yoga Studio, I used the fee calculator.\n` +
    `Class: ${picked.label}\nDuration: ${plan.label}` +
    `${homeVisit ? "\nHome visit: Yes" : ""}\nEstimate: ${inr.format(total)}\n` +
    `Please confirm the exact fee and batch timing.`;

  return (
    <section id="pricing" className="bg-secondary/50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <RevealItem className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              Fee calculator
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-primary sm:text-4xl lg:text-5xl">
              Estimate your monthly plan
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Indicative pricing only — final fees are confirmed on your first visit or call.
            </p>
          </RevealItem>

          <RevealItem className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[1.5rem] surface-card p-6 sm:p-8">
              <fieldset>
                <legend className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Choose a class
                </legend>
                <div className="mt-4 flex flex-wrap gap-2">
                  {formats.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFormat(f.id)}
                      aria-pressed={format === f.id}
                      className={cn(
                        "min-h-12 rounded-full border px-4 text-sm font-medium transition-colors",
                        format === f.id
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-foreground/80 hover:border-primary/40",
                      )}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="mt-8">
                <legend className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Duration
                </legend>
                <div className="mt-4 flex flex-wrap gap-2">
                  {durations.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setMonths(d.id)}
                      aria-pressed={months === d.id}
                      className={cn(
                        "min-h-12 rounded-full border px-4 text-sm font-medium transition-colors",
                        months === d.id
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-border bg-background text-foreground/80 hover:border-accent/40",
                      )}
                    >
                      {d.label}
                      {d.discount > 0 ? ` · ${Math.round(d.discount * 100)}% off` : ""}
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="mt-8 flex min-h-12 cursor-pointer items-center gap-3 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={homeVisit}
                  onChange={(e) => setHomeVisit(e.target.checked)}
                  className="size-5 accent-[var(--primary)]"
                />
                Add home visit (+ {inr.format(1000)}/month)
              </label>
            </div>

            <motion.div
              layout
              className="flex flex-col justify-between rounded-[1.5rem] bg-veda p-6 text-primary-foreground sm:p-8"
            >
              <div>
                <span className="grid size-12 place-items-center rounded-2xl bg-primary-foreground/15">
                  <Calculator className="size-6" aria-hidden />
                </span>
                <p className="mt-6 text-sm opacity-80">
                  {picked.label} · {plan.label}
                  {homeVisit ? " · home visit" : ""}
                </p>
                <p className="mt-2 font-display text-4xl font-bold sm:text-5xl">
                  {inr.format(total)}
                </p>
                {saved > 0 && (
                  <p className="mt-2 text-sm opacity-85">
                    <span className="line-through">{inr.format(base)}</span> · you save{" "}
                    {inr.format(saved)}
                  </p>
                )}
              </div>
              <a
                href={waLink(message)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-primary-foreground px-6 text-sm font-semibold text-primary transition-opacity hover:opacity-90"
              >
                Confirm on WhatsApp
              </a>
            </motion.div>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
}
