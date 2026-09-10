import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { waLink } from "@/lib/site";

type Offer = { id: string; title: string; description: string | null };

export function OfferBanner() {
  const [offer, setOffer] = useState<Offer | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    supabase
      .from("offers")
      .select("id, title, description")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) setOffer(data[0] as Offer);
      });
  }, []);

  if (!offer || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="overflow-hidden bg-accent text-accent-foreground"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 text-sm sm:px-6">
          <a
            href={waLink(`Hi! I saw the offer "${offer.title}" on your website.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-medium"
          >
            <Sparkles className="size-4 shrink-0" aria-hidden />
            <span>
              {offer.title}
              {offer.description ? ` — ${offer.description}` : ""}
            </span>
          </a>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
            className="shrink-0 rounded-full p-1 hover:bg-black/10"
          >
            <X className="size-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
