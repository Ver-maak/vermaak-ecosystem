import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, ArrowUpRight, Loader2, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { recommendForGoals, type Recommendation } from "@/lib/recommend.functions";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/match")({
  head: () => ({
    meta: [
      { title: "Find Your Fit | Vermaak" },
      {
        name: "description",
        content:
          "Tell us your goals and get tailored recommendations for Vermaak ventures, services and programmes.",
      },
      { property: "og:title", content: "Find Your Fit | Vermaak" },
      {
        property: "og:description",
        content: "Share your goals and discover the Vermaak ventures and services built for you.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/match" }],
  }),
  component: MatchPage,
});

const AUDIENCES = ["Entrepreneur", "Creative", "Organisation", "Community"] as const;

function MatchPage() {
  const recommend = useServerFn(recommendForGoals);
  const [audience, setAudience] = useState<(typeof AUDIENCES)[number]>("Entrepreneur");
  const [goals, setGoals] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ summary: string; recommendations: Recommendation[] } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (goals.trim().length < 10) {
      setError("Tell us a little more about your goals (at least 10 characters).");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    trackEvent("cta_click", { cta: "get_recommendations", place: "match" });
    try {
      const res = await recommend({ data: { audience, goals } });
      if ("error" in res && res.error) setError(res.error);
      else if ("recommendations" in res) setResult({ summary: res.summary, recommendations: res.recommendations });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteLayout>
      <section className="shell py-20 lg:py-28">
        <p className="eyebrow text-accent">Find your fit</p>
        <h1 className="display-lg mt-5 max-w-3xl">Tell us where you're headed. We'll show you how Vermaak can help.</h1>
        <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">
          Share your goals and get recommendations for the Vermaak ventures, services and programmes most relevant to you.
        </p>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <form onSubmit={onSubmit} className="space-y-8">
            <fieldset>
              <legend className="text-sm font-medium">I am a…</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {AUDIENCES.map((a) => (
                  <button
                    key={a}
                    type="button"
                    aria-pressed={audience === a}
                    onClick={() => setAudience(a)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm transition-colors",
                      audience === a
                        ? "border-ink bg-ink text-ink-foreground"
                        : "border-border hover:border-foreground",
                    )}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </fieldset>
            <div>
              <label htmlFor="goals" className="text-sm font-medium">
                Your goals
              </label>
              <textarea
                id="goals"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                rows={7}
                maxLength={2000}
                placeholder="e.g. I run a small design studio in Kampala and want to train my team in digital tools and reach clients across East Africa."
                className="mt-3 w-full rounded-2xl border border-border bg-card p-4 text-sm leading-relaxed outline-none focus:border-accent"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-accent-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              {loading ? "Finding your matches…" : "Get recommendations"}
            </button>
            {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
          </form>

          <div aria-live="polite" className="rounded-3xl border border-border bg-card p-8">
            {!result && !loading ? (
              <p className="text-sm text-muted-foreground">Your recommendations will appear here.</p>
            ) : null}
            {loading ? (
              <div className="space-y-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />
                ))}
              </div>
            ) : null}
            {result ? (
              <div>
                <p className="leading-relaxed">{result.summary}</p>
                <ul className="mt-8 space-y-4">
                  {result.recommendations.map((r) => (
                    <li key={r.kind + r.slug} className="rounded-2xl border border-border p-5">
                      <p className="eyebrow text-muted-foreground">{r.kind === "venture" ? "Venture" : r.kind === "service" ? "Service" : "Tailored programme"}</p>
                      <h2 className="mt-2 font-display text-2xl font-medium">{r.name}</h2>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.reason}</p>
                      <p className="mt-3 text-sm font-medium">Next step: {r.next_step}</p>
                      <div className="mt-4">
                        {r.url ? (
                          <a
                            href={r.url}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => trackEvent("external_venture_click", { venture: r.slug })}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent"
                          >
                            Visit {r.name} <ArrowUpRight className="size-4" />
                          </a>
                        ) : (
                          <Link
                            to={r.kind === "venture" ? "/ecosystem" : r.kind === "service" ? "/services" : "/contact"}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent"
                          >
                            Learn more <ArrowRight className="size-4" />
                          </Link>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-ink-foreground"
                >
                  Talk to our team <ArrowRight className="size-4" />
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
