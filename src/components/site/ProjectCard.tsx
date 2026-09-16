import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/cms";
import { trackEvent } from "@/lib/analytics";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex flex-col border border-border bg-card">
      {project.image_url ? (
        <img
          src={project.image_url}
          alt={`${project.name} — ${project.sector ?? "project"}`}
          loading="lazy"
          className="aspect-[16/10] w-full object-cover"
        />
      ) : (
        <div className="aspect-[16/10] w-full bg-sand" aria-hidden="true" />
      )}

      <div className="flex flex-1 flex-col p-7">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {project.sector ? <span className="text-accent">{project.sector}</span> : null}
          {project.year ? <span>{project.year}</span> : null}
        </div>
        <h3 className="mt-4 font-display text-2xl font-medium tracking-tight">{project.name}</h3>
        {project.client ? (
          <p className="mt-1 text-sm text-muted-foreground">{project.client}</p>
        ) : null}
        <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        {project.services.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {project.services.map((service) => (
              <span
                key={service}
                className="rounded-full bg-sand px-3 py-1 text-[11px] text-muted-foreground"
              >
                {service}
              </span>
            ))}
          </div>
        ) : null}

        {project.impact ? (
          <p className="mt-5 border-t border-border pt-4 text-sm leading-relaxed">
            <span className="eyebrow mr-2">Impact</span>
            {project.impact}
          </p>
        ) : null}

        {project.case_study_url ? (
          <a
            href={project.case_study_url}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent("project_view", { project: project.slug })}
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium hover:text-accent"
          >
            Read the case study
            <ArrowUpRight className="size-4" />
          </a>
        ) : null}
      </div>
    </article>
  );
}
