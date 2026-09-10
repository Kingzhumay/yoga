import { Instagram, Youtube, Phone, MapPin } from "lucide-react";
import vedaMark from "@/assets/veda-mark-light.png";
import { site, mapLink } from "@/lib/site";

const links = [
  { label: "About", href: "#about" },
  { label: "Classes", href: "#classes" },
  { label: "Pricing", href: "#pricing" },
  { label: "Timings", href: "#location" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  return (
    <footer className="bg-veda text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-3">
        <div>
          <img
            src={vedaMark}
            alt={`${site.name} logo`}
            width={56}
            height={56}
            loading="lazy"
            className="mb-3 size-14 object-contain"
          />
          <p className="font-display text-2xl font-bold">{site.name}</p>
          <p className="mt-2 text-sm opacity-80">
            {site.tagline} · Est. {site.established}
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="grid size-12 place-items-center rounded-full bg-primary-foreground/12 transition-colors hover:bg-primary-foreground/25"
            >
              <Instagram className="size-5" aria-hidden />
            </a>
            <a
              href={site.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="grid size-12 place-items-center rounded-full bg-primary-foreground/12 transition-colors hover:bg-primary-foreground/25"
            >
              <Youtube className="size-5" aria-hidden />
            </a>
          </div>
        </div>

        <nav aria-label="Footer">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-70">Explore</p>
          <ul className="mt-4 grid grid-cols-2 gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="inline-flex min-h-12 items-center text-sm opacity-85 transition-opacity hover:opacity-100"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-70">Reach us</p>
          <ul className="mt-4 space-y-2 text-sm opacity-90">
            <li>
              <a
                href={mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-start gap-2"
              >
                <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden /> {site.address.full}
              </a>
            </li>
            <li>
              <a href={`tel:+91${site.phonePrimary}`} className="inline-flex items-center gap-2">
                <Phone className="size-4" aria-hidden /> {site.phonePrimary}
              </a>
            </li>
            <li>
              <a href={`tel:+91${site.phoneSecondary}`} className="inline-flex items-center gap-2">
                <Phone className="size-4" aria-hidden /> {site.phoneSecondary}
              </a>
            </li>
            <li className="pt-1">{site.hours}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/15">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs opacity-70 sm:px-6">
          © {new Date().getFullYear()} {site.name}, Uttam Nagar, New Delhi. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
