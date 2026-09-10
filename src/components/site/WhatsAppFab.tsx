import { motion } from "motion/react";
import { MessageCircle } from "lucide-react";
import { waLink } from "@/lib/site";

export function WhatsAppFab() {
  return (
    <motion.a
      href={waLink("Hi Veda Yoga Studio, I'd like to know about your yoga batches.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Veda Yoga Studio on WhatsApp"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8, duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      className="fixed bottom-5 right-5 z-50 grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_18px_40px_-16px_rgba(0,0,0,0.6)]"
    >
      <MessageCircle className="size-7" aria-hidden />
    </motion.a>
  );
}
