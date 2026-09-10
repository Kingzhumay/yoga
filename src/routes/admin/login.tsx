import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

// --- Brute-force shield: 5 failed attempts = 15 minute lock ---
// Matches the pattern used across the studio's other admin panels.
// This is a client-side deterrent (Supabase Auth itself also rate-limits
// on its end) — good enough for a single-owner small-business site.
const LOCK_KEY = "veda_admin_lock";
const ATTEMPTS_KEY = "veda_admin_attempts";
const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

function getLockRemaining(): number {
  const until = Number(localStorage.getItem(LOCK_KEY) ?? 0);
  return Math.max(0, until - Date.now());
}

function registerFailedAttempt() {
  const attempts = Number(localStorage.getItem(ATTEMPTS_KEY) ?? 0) + 1;
  localStorage.setItem(ATTEMPTS_KEY, String(attempts));
  if (attempts >= MAX_ATTEMPTS) {
    localStorage.setItem(LOCK_KEY, String(Date.now() + LOCK_MINUTES * 60_000));
    localStorage.setItem(ATTEMPTS_KEY, "0");
  }
}

function clearAttempts() {
  localStorage.setItem(ATTEMPTS_KEY, "0");
  localStorage.removeItem(LOCK_KEY);
}

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const remaining = getLockRemaining();
    if (remaining > 0) {
      toast.error(`Too many attempts. Try again in ${Math.ceil(remaining / 60_000)} min.`);
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      toast.error("Admin panel isn't connected yet. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
      return;
    }

    setSending(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });
    setSending(false);

    if (error) {
      registerFailedAttempt();
      toast.error(error.message);
      return;
    }

    clearAttempts();
    setSent(true);
    toast.success("Check your email for the login link.");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm rounded-2xl surface-card p-8"
      >
        <h1 className="text-xl font-bold text-primary">Veda Yoga Studio — Admin</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to edit classes, schedule and offers.
        </p>

        {sent ? (
          <p className="mt-6 text-sm text-foreground">
            A login link was sent to <strong>{email}</strong>. Open it on this device to continue.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-semibold">
                Owner email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@vedayoga.in"
                className="mt-2 min-h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-accent"
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground disabled:opacity-70"
            >
              {sending ? <Loader2 className="size-4 animate-spin" /> : <Mail className="size-4" />}
              {sending ? "Sending link…" : "Send login link"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
