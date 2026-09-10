import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Phone, Instagram, Youtube } from "lucide-react";
import { site } from "@/lib/site";
import vedaMark from "@/assets/veda-mark-themed.png";
import vedaMarkBrand from "@/assets/veda-mark.png";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { label: "About", href: "#about" },
  { label: "Classes", href: "#classes" },
  { label: "Timings", href: "#location" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500",
        scrolled
          ? "bg-background/85 shadow-[0_10px_30px_-24px_rgba(0,0,0,0.5)] backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6 lg:py-4">
        <a href="#top" className="flex min-w-0 items-center gap-3">
          <img
            src={vedaMark}
            alt=""
            aria-hidden
            width={44}
            height={44}
            className="size-11 shrink-0 object-contain dark:hidden"
          />
          <img
            src={vedaMarkBrand}
            alt=""
            aria-hidden
            width={44}
            height={44}
            className="hidden size-11 shrink-0 object-contain dark:block"
          />
          <span className="min-w-0">
            <span className="block truncate font-display text-base font-bold tracking-tight sm:text-lg">
              Veda Yoga Studio
            </span>
            <span className="hidden truncate text-[11px] uppercase tracking-[0.18em] text-muted-foreground min-[420px]:block sm:tracking-[0.22em]">
              {site.tagline}
            </span>
          </span>
        </a>

        <div className="flex items-center gap-1 sm:gap-2">
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {links.map((l) => (
              <motion.a
                key={l.href}
                href={l.href}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="rounded-full px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
              >
                {l.label}
              </motion.a>
            ))}
          </nav>

          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hidden size-12 place-items-center rounded-full text-foreground/70 transition-colors hover:text-accent sm:grid"
          >
            <Instagram className="size-5" />
          </a>
          <a
            href={site.youtube}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="hidden size-12 place-items-center rounded-full text-foreground/70 transition-colors hover:text-accent sm:grid"
          >
            <Youtube className="size-5" />
          </a>

          <ThemeToggle />

          <motion.a
            href={`tel:+91${site.phonePrimary}`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground"
          >
            <Phone className="size-4" />
            <span className="hidden sm:inline">{site.phonePrimary}</span>
            <span className="sr-only sm:hidden">Call {site.phonePrimary}</span>
          </motion.a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="grid size-12 place-items-center rounded-full text-foreground lg:hidden"
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
            className="overflow-hidden border-t border-border bg-background/95 backdrop-blur-md lg:hidden"
          >
            <ul className="mx-auto max-w-7xl px-4 py-2 sm:px-6">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-12 items-center border-b border-border/60 text-base font-medium last:border-b-0"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
