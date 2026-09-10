import { MapPin, Clock, Phone, Navigation } from "lucide-react";
import { site, mapEmbedSrc, mapLink } from "@/lib/site";
import { Reveal, RevealItem } from "./Reveal";

const timings = [
  { day: "Monday – Friday", morning: "6:00 – 9:00 AM", evening: "5:00 – 8:00 PM" },
  { day: "Saturday", morning: "6:00 – 9:00 AM", evening: "5:00 – 7:00 PM" },
  { day: "Sunday", morning: "7:00 – 9:00 AM", evening: "By appointment" },
];

export function Location() {
  return (
    <section id="location" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <RevealItem className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              Timings &amp; location
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-primary sm:text-4xl lg:text-5xl">
              Find us in Jeevan Park, Uttam Nagar
            </h2>
          </RevealItem>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <RevealItem className="flex flex-col gap-5">
              <div className="rounded-[1.5rem] surface-card p-6">
                <h3 className="flex items-center gap-2 font-display text-lg font-bold text-primary">
                  <Clock className="size-5 text-accent" aria-hidden /> Batch timings
                </h3>
                <ul className="mt-4 divide-y divide-border">
                  {timings.map((t) => (
                    <li key={t.day} className="grid gap-1 py-3 sm:grid-cols-[1fr_auto]">
                      <span className="text-sm font-semibold">{t.day}</span>
                      <span className="text-sm text-muted-foreground sm:text-right">
                        {t.morning} · {t.evening}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-muted-foreground">
                  Batch slots fill up fast — call ahead to reserve your mat.
                </p>
              </div>

              <div className="rounded-[1.5rem] surface-card p-6">
                <h3 className="flex items-center gap-2 font-display text-lg font-bold text-primary">
                  <MapPin className="size-5 text-accent" aria-hidden /> Studio address
                </h3>
                <address className="mt-3 not-italic text-sm leading-relaxed text-muted-foreground">
                  {site.address.street}
                  <br />
                  {site.address.city} – {site.address.postalCode}
                </address>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href={mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
                  >
                    <Navigation className="size-4" aria-hidden /> Get directions
                  </a>
                  <a
                    href={`tel:+91${site.phonePrimary}`}
                    className="inline-flex min-h-12 items-center gap-2 rounded-full border border-border px-5 text-sm font-semibold text-primary"
                  >
                    <Phone className="size-4" aria-hidden /> {site.phonePrimary}
                  </a>
                </div>
              </div>
            </RevealItem>

            <RevealItem>
              <div className="h-full overflow-hidden rounded-[1.5rem] surface-card">
                <iframe
                  title="Map showing Veda Yoga Studio in Jeevan Park, Uttam Nagar, New Delhi"
                  src={mapEmbedSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-[22rem] w-full border-0 lg:h-full lg:min-h-[28rem]"
                />
              </div>
            </RevealItem>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
