import { useEffect } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

import { SiteLayout } from "@/components/site/SiteLayout";
import { InsightCard } from "@/components/site/InsightCard";
import { insightsQuery, type Insight } from "@/lib/cms";
import { trackEvent } from "@/lib/analytics";
import type { Database } from "@/integrations/supabase/types";

async function fetchInsight(slug: string): Promise<Insight> {
  const url = import.meta.env["VITE_SUPABASE_URL"] as string;
  const key = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string;
  const client = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
  });
  const { data, error } = await client
    .from("insights")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw notFound();
  return data;
}

export const Route = createFileRoute("/insights/$slug")({
  loader: async ({ params }) => ({ insight: await fetchInsight(params.slug) }),
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "Article not found — Vermaak" }, { name: "robots", content: "noindex" }] };
    }
    const { insight } = loaderData;
    const title = `${insight.title} — Vermaak Insights`;
    const description = insight.excerpt ?? "An article from Vermaak Insights.";
    const url = `https://vermaak-ecosystem.lovable.app/insights/${params.slug}`;
    const image = insight.image_url?.startsWith("https://") ? insight.image_url : null;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        ...(image
          ? [
              { property: "og:image", content: image },
              { name: "twitter:image", content: image },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: insight.title,
            datePublished: insight.published_at,
            author: insight.author ? { "@type": "Person", name: insight.author } : undefined,
            image: image ?? undefined,
            publisher: { "@type": "Organization", name: "Vermaak" },
          }),
        },
      ],
    };
  },
  notFoundComponent: ArticleNotFound,
  errorComponent: ArticleError,
  component: ArticlePage,
});

function ArticleNotFound() {
  return (
    <SiteLayout>
      <div className="shell py-32">
        <h1 className="display-lg">This article isn't available.</h1>
        <Link to="/insights" className="mt-8 inline-flex items-center gap-2 text-sm hover:text-accent">
          <ArrowLeft className="size-4" /> Back to insights
        </Link>
      </div>
    </SiteLayout>
  );
}

function ArticleError() {
  return (
    <SiteLayout>
      <div className="shell py-32">
        <h1 className="display-lg">This article didn't load.</h1>
        <Link to="/insights" className="mt-8 inline-flex items-center gap-2 text-sm hover:text-accent">
          <ArrowLeft className="size-4" /> Back to insights
        </Link>
      </div>
    </SiteLayout>
  );
}

function ArticlePage() {
  const { insight } = Route.useLoaderData();
  const { data: all } = useQuery(insightsQuery);

  useEffect(() => {
    trackEvent("insight_view", { insight: insight.slug });
  }, [insight.slug]);

  const related = (all ?? [])
    .filter((item) => item.published && item.id !== insight.id)
    .filter((item) => item.category === insight.category || item.tags.some((t) => insight.tags.includes(t)))
    .slice(0, 3);

  const paragraphs = (insight.content ?? "").split(/\n{2,}/).filter(Boolean);

  return (
    <SiteLayout>
      <article>
        <header className="shell max-w-4xl py-16 lg:py-24">
          <Link to="/insights" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent">
            <ArrowLeft className="size-4" /> Insights
          </Link>
          <div className="mt-10 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            {insight.category ? <span className="text-accent">{insight.category}</span> : null}
            <time dateTime={insight.published_at}>
              {new Date(insight.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </time>
            {insight.author ? <span>{insight.author}</span> : null}
          </div>
          <h1 className="display-lg mt-6">{insight.title}</h1>
          {insight.excerpt ? (
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{insight.excerpt}</p>
          ) : null}
        </header>

        {insight.image_url ? (
          <div className="shell">
            <img src={insight.image_url} alt={insight.title} className="aspect-[21/9] w-full object-cover" />
          </div>
        ) : null}

        <div className="shell max-w-3xl py-16 lg:py-20">
          <div className="space-y-6 text-[1.075rem] leading-[1.8]">
            {paragraphs.map((paragraph, index) =>
              paragraph.startsWith("## ") ? (
                <h2 key={index} className="pt-6 font-display text-2xl font-medium tracking-tight">
                  {paragraph.slice(3)}
                </h2>
              ) : (
                <p key={index}>{paragraph}</p>
              ),
            )}
          </div>
          {insight.tags.length > 0 ? (
            <div className="mt-12 flex flex-wrap gap-2 border-t border-border pt-8">
              {insight.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-sand px-3 py-1 text-xs text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </article>

      {related.length > 0 ? (
        <section className="border-t border-border bg-sand/40">
          <div className="shell py-20">
            <p className="eyebrow">Related articles</p>
            <div className="mt-10 grid gap-10 md:grid-cols-3">
              {related.map((item) => (
                <InsightCard key={item.id} insight={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </SiteLayout>
  );
}
