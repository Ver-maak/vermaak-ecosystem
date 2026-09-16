import { Link } from "@tanstack/react-router";
import type { Insight } from "@/lib/cms";

export function InsightCard({ insight }: { insight: Insight }) {
  return (
    <article className="group flex flex-col">
      <Link to="/insights/$slug" params={{ slug: insight.slug }} className="block">
        {insight.image_url ? (
          <img
            src={insight.image_url}
            alt={insight.title}
            loading="lazy"
            className="aspect-[16/10] w-full object-cover"
          />
        ) : (
          <div className="aspect-[16/10] w-full bg-sand" aria-hidden="true" />
        )}
      </Link>
      <div className="mt-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        {insight.category ? <span className="text-accent">{insight.category}</span> : null}
        <span>
          {new Date(insight.published_at).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>
      <h3 className="mt-3 font-display text-2xl font-medium leading-snug tracking-tight">
        <Link
          to="/insights/$slug"
          params={{ slug: insight.slug }}
          className="hover:text-accent"
        >
          {insight.title}
        </Link>
      </h3>
      {insight.excerpt ? (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{insight.excerpt}</p>
      ) : null}
      {insight.author ? (
        <p className="mt-4 text-xs text-muted-foreground">{insight.author}</p>
      ) : null}
    </article>
  );
}
