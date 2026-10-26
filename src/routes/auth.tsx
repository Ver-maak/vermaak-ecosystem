import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Vermaak" },
      { name: "description", content: "Sign in to manage Vermaak website content." },
      { property: "og:title", content: "Sign in — Vermaak" },
      { property: "og:description", content: "Sign in to manage Vermaak website content." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return toast.error(error.message);
      navigate({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin`, data: { full_name: name } },
      });
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success("Check your email to confirm your account.");
      setMode("signin");
    }
  }

  const field = "mt-2 w-full border border-input bg-card px-4 py-3 text-sm outline-none focus:border-accent";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="font-display text-3xl font-semibold tracking-tight">
          Vermaak<span className="text-accent">.</span>
        </Link>
        <h1 className="mt-10 font-display text-2xl font-medium">
          {mode === "signin" ? "Sign in to manage content" : "Create an account"}
        </h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {mode === "signup" ? (
            <label className="block">
              <span className="eyebrow">Full name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} className={field} />
            </label>
          ) : null}
          <label className="block">
            <span className="eyebrow">Email</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
          </label>
          <label className="block">
            <span className="eyebrow">Password</span>
            <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className={field} />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-ink-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-60"
          >
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>
        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6 text-sm text-muted-foreground hover:text-accent"
        >
          {mode === "signin" ? "No account yet? Create one" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
