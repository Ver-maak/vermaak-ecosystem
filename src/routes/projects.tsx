import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { ProjectCard } from "@/components/site/ProjectCard";
import { StatsSection } from "@/components/site/StatsSection";
import { PartnerLogo } from "@/components/site/PartnerLogo";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CTASection } from "@/components/site/CTASection";
import { projectsQuery, partnersQuery } from "@/lib/cms";
import { cn } from "@/lib/utils";

const TITLE = "Projects | Selected Work by Vermaak";
const DESCRIPTION =
  "Selected Vermaak work across technology, consulting, training, events, creative and research — with clients, services, results and case studies.";

const FILTERS = ["All", "Technology", "Consulting", "Training", "Events", "Creative", "Research"];

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: "https://vermaak-ecosystem.lovable.app/projects" },
    ],
    links: [{ rel: "canonical", href: "https://vermaak-ecosystem.lovable.app/projects" }],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { data: projects } = useQuery(projectsQuery);
  const { data: partners } = useQuery(partnersQuery);
  const [filter, setFilter] = useState("All");

  const list = (projects ?? []).filter((project) => {
    if (filter === "All") return true;
    const haystack = [project.sector ?? "", ...project.services].join(" ").toLowerCase();
    return haystack.includes(filter.toLowerCase());
  });

  return (
    <SiteLayout>
      <header className="border-b border-border">
        <div className="shell py-20 lg:py-28">
          <Reveal>
            <p className="eyebrow">Selected work</p>
            <h1 className="display-xl mt-7 max-w-4xl">
              Projects that left capability behind
              <span className="text-accent">.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              A selection of programmes, platforms and partnerships delivered across the continent.
            </p>
          </Reveal>
        </div>
      </header>

      <section className="shell py-16 lg:py-24">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects">
          {FILTERS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              aria-pressed={filter === option}
              className={cn(
                "rounded-full border px-5 py-2 text-[11px] uppercase tracking-[0.18em] transition-colors",
                filter === option
                  ? "border-ink bg-ink text-ink-foreground"
                  : "border-border text-muted-foreground hover:border-accent hover:text-accent",
              )}
            >
              {option}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <p className="mt-16 text-muted-foreground">No projects in this category yet.</p>
        ) : (
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {list.map((project, index) => (
              <Reveal key={project.id} delay={index * 60}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <StatsSection tone="ink" />

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

      <CTASection />
    </SiteLayout>
  );
}
