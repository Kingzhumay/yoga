import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { site, endpoints, waLink } from "@/lib/site";
import { Reveal, RevealItem } from "./Reveal";

const interests = [
  "Group Yoga",
  "Personal / 1-on-1 Yoga",
  "Yoga for Women",
  "Aerial Yoga",
  "Yoga Wheel Therapy",
];

const fieldClass =
  "mt-2 min-h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent";

export function Contact() {
  const [sending, setSending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot: bots fill hidden fields, humans never see them.
    if (String(data.get("company") ?? "").trim() !== "") return;

    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const interest = String(data.get("interest") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name || !/^[0-9+\s-]{10,15}$/.test(phone)) {
      toast.error("Please enter your name and a valid phone number.");
      return;
    }

    setSending(true);
    const payload = {
      access_key: endpoints.web3formsKey,
      subject: `New enquiry — ${name} (${interest})`,
      from_name: "Veda Yoga Studio Website",
      name,
      phone,
      interest,
      message,
    };

    try {
      if (endpoints.web3formsKey && !endpoints.web3formsKey.startsWith("REPLACE_")) {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`Web3Forms responded ${res.status}`);
      }

      if (endpoints.googleSheetsWebhook) {
        // Fire-and-forget sheet sync; never blocks the visitor.
        void fetch(endpoints.googleSheetsWebhook, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, submittedAt: new Date().toISOString() }),
        }).catch(() => undefined);
      }

      toast.success("Thanks! We'll call you back shortly.");
      form.reset();
    } catch {
      toast.error("Couldn't send the form. Opening WhatsApp instead.");
    } finally {
      setSending(false);
      const wa = waLink(
        `Hi Veda Yoga Studio!\nName: ${name}\nPhone: ${phone}\nInterest: ${interest}` +
          (message ? `\nMessage: ${message}` : ""),
      );
      window.open(wa, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <section id="contact" className="bg-secondary/50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <RevealItem>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                Contact
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-primary sm:text-4xl lg:text-5xl">
                Book your free trial class
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Share your details and we'll call you back with the right batch. Your enquiry also
                opens on WhatsApp so nothing gets lost.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                <li>{site.address.full}</li>
                <li>{site.hours}</li>
                <li>
                  {site.phonePrimary} · {site.phoneSecondary}
                </li>
              </ul>
            </RevealItem>

            <RevealItem>
              <form
                onSubmit={handleSubmit}
                className="rounded-[1.5rem] surface-card p-6 sm:p-8"
                noValidate
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="text-sm font-semibold">
                      Your name
                    </label>
                    <input
                      id="name"
                      name="name"
                      required
                      autoComplete="name"
                      placeholder="Manisha Rani"
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="text-sm font-semibold">
                      Phone number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="98765 43210"
                      className={fieldClass}
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label htmlFor="interest" className="text-sm font-semibold">
                    Interested in
                  </label>
                  <select
                    id="interest"
                    name="interest"
                    defaultValue={interests[0]}
                    className={fieldClass}
                  >
                    {interests.map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-5">
                  <label htmlFor="message" className="text-sm font-semibold">
                    Anything we should know? (optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Back pain, preferred timing, home visit…"
                    className={`${fieldClass} py-3`}
                  />
                </div>

                <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <label htmlFor="company">Company</label>
                  <input id="company" name="company" tabIndex={-1} autoComplete="off" />
                </div>

                <motion.button
                  type="submit"
                  disabled={sending}
                  whileHover={{ scale: sending ? 1 : 1.02 }}
                  whileTap={{ scale: sending ? 1 : 0.98 }}
                  className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground disabled:opacity-70 sm:w-auto"
                >
                  {sending ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                  ) : (
                    <Send className="size-4" aria-hidden />
                  )}
                  {sending ? "Sending…" : "Send enquiry"}
                </motion.button>
                <p className="mt-3 text-xs text-muted-foreground">
                  We only use your number to reply about classes.
                </p>
              </form>
            </RevealItem>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
