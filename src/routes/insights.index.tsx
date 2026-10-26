import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { InsightCard } from "@/components/site/InsightCard";
import { NewsletterSection } from "@/components/site/NewsletterSection";
import { insightsQuery } from "@/lib/cms";
import { cn } from "@/lib/utils";

const TITLE = "Insights | Ideas on Africa's Creative & Digital Economy — Vermaak";
const DESCRIPTION =
  "Articles, research notes and perspectives from Vermaak on technology, talent, the creative economy and digital transformation in Africa.";

export const Route = createFileRoute("/insights/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: "https://vermaak-ecosystem.lovable.app/insights" },
    ],
    links: [{ rel: "canonical", href: "https://vermaak-ecosystem.lovable.app/insights" }],
  }),
  component: InsightsPage,
});

function InsightsPage() {
  const { data: insights } = useQuery(insightsQuery);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const published = (insights ?? []).filter((item) => item.published);
  const categories = ["All", ...Array.from(new Set(published.map((i) => i.category).filter(Boolean) as string[]))];
  const q = query.trim().toLowerCase();
  const list = published.filter((item) => {
    if (category !== "All" && item.category !== category) return false;
    if (!q) return true;
    return [item.title, item.excerpt ?? "", item.author ?? "", ...item.tags].join(" ").toLowerCase().includes(q);
  });

  return (
    <SiteLayout>
      <header className="border-b border-border">
        <div className="shell py-20 lg:py-28">
          <Reveal>
            <p className="eyebrow">Insights</p>
            <h1 className="display-xl mt-7 max-w-4xl">
              Thinking from the work<span className="text-accent">.</span>
            </h1>
          </Reveal>
        </div>
      </header>

      <section className="shell py-16 lg:py-24">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {categories.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setCategory(option)}
                aria-pressed={category === option}
                className={cn(
                  "rounded-full border px-5 py-2 text-[11px] uppercase tracking-[0.18em] transition-colors",
                  category === option
                    ? "border-ink bg-ink text-ink-foreground"
                    : "border-border text-muted-foreground hover:border-accent hover:text-accent",
                )}
              >
                {option}
              </button>
            ))}
          </div>
          <label className="relative block w-full lg:w-80">
            <span className="sr-only">Search insights</span>
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search articles"
              className="w-full rounded-full border border-input bg-card py-3 pl-11 pr-4 text-sm outline-none focus:border-accent"
            />
          </label>
        </div>

        {list.length === 0 ? (
          <p className="mt-16 text-muted-foreground">No articles match your search.</p>
        ) : (
          <div className="mt-14 grid gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {list.map((insight, index) => (
              <Reveal key={insight.id} delay={index * 50}>
                <InsightCard insight={insight} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <NewsletterSection />
    </SiteLayout>
  );
}
