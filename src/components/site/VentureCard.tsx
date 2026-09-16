import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Venture } from "@/lib/cms";
import { StatusBadge } from "./StatusBadge";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function VentureCard({ venture, index }: { venture: Venture; index: number }) {
  const comingSoon = venture.status === "coming_soon";
  const external = Boolean(venture.url) && !comingSoon;

  return (
    <article
      id={venture.slug}
      className={cn(
        "group flex scroll-mt-28 flex-col p-8 transition-colors",
        comingSoon ? "bg-sand/60" : "bg-card hover:bg-sand/70",
      )}
    >
      <div className="mb-6 flex items-center justify-between gap-3">
        <StatusBadge status={venture.status} />
        <span className="text-xs text-muted-foreground">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <h3 className="font-display text-3xl font-medium tracking-tight">{venture.name}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        {venture.short_description}
      </p>

      {venture.categories.length > 0 ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {venture.categories.slice(0, 4).map((category) => (
            <span
              key={category}
              className="rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground"
            >
              {category}
            </span>
          ))}
        </div>
      ) : null}

      {external ? (
        <a
          href={venture.url ?? "#"}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackEvent("external_venture_click", { venture: venture.slug })}
          className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium hover:text-accent"
        >
          {venture.cta_label ?? `Visit ${venture.name}`}
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </a>
      ) : (
        <a
          href="/contact"
          onClick={() => trackEvent("venture_click", { venture: venture.slug })}
          className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-accent"
        >
          {venture.cta_label ?? "Start a conversation"}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </a>
      )}
    </article>
  );
}
