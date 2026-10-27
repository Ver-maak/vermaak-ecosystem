import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import heroImage from "@/assets/hero-vermaak.jpg";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { VentureCard } from "@/components/site/VentureCard";
import { ProjectCard } from "@/components/site/ProjectCard";
import { InsightCard } from "@/components/site/InsightCard";
import { PartnerLogo } from "@/components/site/PartnerLogo";
import { StatsSection } from "@/components/site/StatsSection";
import { AreasOfWork } from "@/components/site/AreasOfWork";
import { CTASection } from "@/components/site/CTASection";
import { NewsletterSection } from "@/components/site/NewsletterSection";
import { venturesQuery, projectsQuery, insightsQuery, partnersQuery } from "@/lib/cms";
import { trackEvent } from "@/lib/analytics";

const TITLE = "Vermaak | Building Africa's Creative & Digital Future";
const DESCRIPTION =
  "Vermaak is a technology company building talent, markets and systems for Africa’s digital and creative economy. We help entrepreneurs, creatives and organisations turn ideas into opportunities.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: "https://vermaak-ecosystem.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://vermaak-ecosystem.lovable.app/" }],
  }),
  component: Home,
});

function Home() {
  const { data: ventures } = useQuery(venturesQuery);
  const { data: projects } = useQuery(projectsQuery);
  const { data: insights } = useQuery(insightsQuery);
  const { data: partners } = useQuery(partnersQuery);

  const featuredVentures = (ventures ?? []).slice(0, 3);
  const featuredProjects = (projects ?? []).filter((p) => p.featured).slice(0, 3);
  const latestInsights = (insights ?? []).filter((i) => i.published).slice(0, 3);

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="shell grid gap-14 pt-16 pb-20 lg:grid-cols-12 lg:pt-24 lg:pb-28">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow">African creative economy &amp; digital workforce</p>
              <h1 className="display-xl mt-7">
                Building Africa's Creative and Digital Future
                <span className="text-accent">.</span>
              </h1>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
                Vermaak is a technology company building talent, markets and systems for Africa’s digital and creative economy. Our work brings together technology, creativity and entrepreneurship to make innovation more accessible and create lasting economic opportunities.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  to="/ecosystem"
                  onClick={() => trackEvent("cta_click", { cta: "Explore Our Ecosystem", place: "hero" })}
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 text-sm font-medium text-ink-foreground transition-transform hover:-translate-y-0.5"
                >
                  Explore Our Ecosystem
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  to="/contact"
                  onClick={() => trackEvent("cta_click", { cta: "Work With Vermaak", place: "hero" })}
                  className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-8 py-4 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
                >
                  Work With Vermaak
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={120} className="relative">
              <img
                src={heroImage}
                alt="Creative and technology professionals collaborating in a Vermaak studio"
                width={1920}
                height={1200}
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="absolute -bottom-6 -left-6 hidden bg-accent px-6 py-5 text-accent-foreground lg:block">
                <p className="font-display text-2xl font-medium tracking-tight">
                  {(ventures ?? []).length || 6} ventures
                </p>
                <p className="text-xs uppercase tracking-[0.18em] opacity-80">One ecosystem</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* What is Vermaak */}
      <section className="shell grid gap-12 py-24 lg:grid-cols-12 lg:py-32">
        <div className="lg:col-span-4">
          <p className="eyebrow">What is Vermaak?</p>
        </div>
        <div className="lg:col-span-8">
          <Reveal>
            <p className="font-display text-3xl leading-[1.25] tracking-tight lg:text-[2.6rem]">
              Vermaak is a technology company building talent, markets and systems for Africa’s digital and creative economy.
            </p>
            <p className="mt-7 max-w-2xl leading-relaxed text-muted-foreground">
              Vermaak works with governments, development partners, corporates, universities, NGOs
              and creative professionals. We combine advisory depth with the ability to build and
              run the technology ourselves — which is why our work outlives the programmes that
              start it.
            </p>
            <Link
              to="/about"
              className="mt-9 inline-flex items-center gap-2 text-sm font-medium hover:text-accent"
            >
              Learn More About Vermaak
              <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      <StatsSection tone="ink" />

      {/* Ecosystem preview */}
      <section className="shell py-24 lg:py-32">
        <SectionHeading
          eyebrow="The Vermaak ecosystem"
          title="One ecosystem. Multiple platforms. A shared ambition."
          subtitle="Each venture stands on its own and strengthens the others. They are not equally mature — and we say so."
          action={
            <Link to="/ecosystem" className="inline-flex items-center gap-2 text-sm font-medium hover:text-accent">
              See all ventures
              <ArrowUpRight className="size-4" />
            </Link>
          }
        />
        <div className="mt-14 grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
          {featuredVentures.map((venture, index) => (
            <VentureCard key={venture.id} venture={venture} index={index} />
          ))}
        </div>
      </section>

      <AreasOfWork />

      {/* Selected work */}
      {featuredProjects.length > 0 ? (
        <section className="border-t border-border bg-sand/40">
          <div className="shell py-24 lg:py-32">
            <SectionHeading
              eyebrow="Selected work"
              title="Work that leaves capability behind."
              action={
                <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-medium hover:text-accent">
                  All projects
                  <ArrowUpRight className="size-4" />
                </Link>
              }
            />
            <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project, index) => (
                <Reveal key={project.id} delay={index * 70}>
                  <ProjectCard project={project} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Partners */}
      {(partners ?? []).length > 0 ? (
        <section className="shell py-24">
          <SectionHeading eyebrow="Partners" title="Who we build with." />
          <div className="mt-12 grid grid-cols-2 gap-px bg-border sm:grid-cols-3 lg:grid-cols-5">
            {(partners ?? []).map((partner) => (
              <PartnerLogo key={partner.id} partner={partner} />
            ))}
          </div>
        </section>
      ) : null}

      {/* Insights */}
      {latestInsights.length > 0 ? (
        <section className="shell border-t border-border py-24 lg:py-32">
          <SectionHeading
            eyebrow="Insights"
            title="Thinking from the work."
            action={
              <Link to="/insights" className="inline-flex items-center gap-2 text-sm font-medium hover:text-accent">
                All insights
                <ArrowUpRight className="size-4" />
              </Link>
            }
          />
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {latestInsights.map((insight, index) => (
              <Reveal key={insight.id} delay={index * 70}>
                <InsightCard insight={insight} />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      <NewsletterSection />
      <CTASection />
    </SiteLayout>
  );
}
