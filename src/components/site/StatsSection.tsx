import { useQuery } from "@tanstack/react-query";
import { statsQuery } from "@/lib/cms";
import { Reveal } from "./Reveal";

/** Impact numbers. Values come from the CMS, never hard-coded in the design. */
export function StatsSection({ tone = "paper" }: { tone?: "paper" | "ink" }) {
  const { data: stats } = useQuery(statsQuery);
  const ink = tone === "ink";

  if (!stats || stats.length === 0) return null;

  return (
    <section className={ink ? "bg-ink text-ink-foreground" : ""}>
      <div className="shell py-16 lg:py-20">
        <p className={`eyebrow mb-10 ${ink ? "text-ink-foreground/45" : ""}`}>Impact</p>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-5">
          {stats.map((stat, index) => (
            <Reveal key={stat.id} delay={index * 60}>
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <p className="font-display text-4xl font-medium tracking-tight lg:text-5xl">
                  {stat.value}
                  {stat.suffix ? <span className="text-accent">{stat.suffix}</span> : null}
                </p>
                <p
                  className={`mt-2 text-[11px] uppercase tracking-[0.18em] ${
                    ink ? "text-ink-foreground/55" : "text-muted-foreground"
                  }`}
                >
                  {stat.label}
                </p>
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
