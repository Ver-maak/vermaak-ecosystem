import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { VentureCard } from "@/components/site/VentureCard";
import { StatusBadge } from "@/components/site/StatusBadge";
import { venturesQuery } from "@/lib/cms";

const TITLE = "The Vermaak Ecosystem | Ventures Across Africa's Digital Economy";
const DESCRIPTION =
  "One ecosystem. Multiple platforms. A shared ambition. Explore Vermaak's ventures across learning, consulting, events, creative work and digital products.";

export const Route = createFileRoute("/ecosystem")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: "https://vermaak-ecosystem.lovable.app/ecosystem" },
    ],
    links: [{ rel: "canonical", href: "https://vermaak-ecosystem.lovable.app/ecosystem" }],
  }),
  component: EcosystemPage,
});

function EcosystemPage() {
  const { data: ventures } = useQuery(venturesQuery);
  const list = ventures ?? [];

  return (
    <SiteLayout>
      <header className="border-b border-border">
        <div className="shell py-20 lg:py-28">
          <Reveal>
            <p className="eyebrow">The Vermaak ecosystem</p>
            <h1 className="display-xl mt-7 max-w-4xl">
              One ecosystem. Multiple platforms. A shared ambition
              <span className="text-accent">.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Each Vermaak venture serves a distinct audience and runs on its own subdomain. Some are
              live and trading, some are being built, and some are still ahead of us — the status on
              every card tells you exactly where it stands.
            </p>
          </Reveal>

          <div className="mt-12 flex flex-wrap gap-3">
            <StatusBadge status="active" />
            <StatusBadge status="developing" />
            <StatusBadge status="coming_soon" />
          </div>
        </div>
      </header>

      <section className="shell py-20 lg:py-24">
        <div className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
          {list.map((venture, index) => (
            <VentureCard key={venture.id} venture={venture} index={index} />
          ))}
        </div>
      </section>

      {/* Detail strip */}
      <section className="border-t border-border bg-sand/40">
        <div className="shell divide-y divide-border py-8">
          {list.map((venture) => (
            <Reveal key={venture.id} className="grid gap-8 py-14 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <StatusBadge status={venture.status} />
                <h2 className="mt-5 font-display text-3xl font-medium tracking-tight">
                  {venture.name}
                </h2>
                {venture.url ? (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {venture.url.replace(/^https?:\/\//, "")}
                  </p>
                ) : null}
              </div>
              <div className="lg:col-span-8">
                <p className="leading-relaxed text-muted-foreground">
                  {venture.full_description ?? venture.short_description}
                </p>
                {venture.categories.length > 0 ? (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {venture.categories.map((category) => (
                      <span
                        key={category}
                        className="rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* More is coming */}
      <section className="bg-ink text-ink-foreground">
        <div className="shell flex flex-col justify-between gap-10 py-24 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="eyebrow text-ink-foreground/45">The next ventures</p>
            <h2 className="display-lg mt-5">More is coming.</h2>
            <p className="mt-6 max-w-lg leading-relaxed text-ink-foreground/60">
              The ecosystem is designed to grow. New platforms join it as the market, the talent and
              the partnerships line up — and each one is added the same way: with a clear audience
              and a reason to exist.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-medium text-accent-foreground transition-transform hover:-translate-y-0.5"
          >
            Partner With Us
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
