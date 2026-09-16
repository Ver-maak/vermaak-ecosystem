import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";

export function NewsletterSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!email) return;
    setBusy(true);
    const { error } = await supabase.from("newsletter_subscribers").insert({ name, email });
    setBusy(false);

    if (error) {
      toast.error(
        error.code === "23505" ? "You're already subscribed." : "Something went wrong. Please try again.",
      );
      return;
    }
    trackEvent("newsletter_subscribe");
    toast.success("You're on the list. Thank you.");
    setName("");
    setEmail("");
  }

  return (
    <section className="border-y border-border bg-sand/50">
      <div className="shell grid gap-10 py-20 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="eyebrow">Newsletter</p>
          <h2 className="display-lg mt-5">Stay connected with Vermaak.</h2>
          <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
            Get updates on new platforms, opportunities, insights, events and programmes from across
            the Vermaak ecosystem.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="lg:col-span-6 lg:pt-14">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="eyebrow">Name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                className="mt-2 w-full border border-input bg-card px-4 py-3 text-sm outline-none focus:border-accent"
              />
            </label>
            <label className="block">
              <span className="eyebrow">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@organisation.africa"
                className="mt-2 w-full border border-input bg-card px-4 py-3 text-sm outline-none focus:border-accent"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={busy}
            className="mt-5 inline-flex items-center rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-ink-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-60"
          >
            {busy ? "Subscribing…" : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
}
