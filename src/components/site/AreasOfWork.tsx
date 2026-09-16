import { Cpu, Users, Lightbulb, Palette, LayoutGrid, Sparkles } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

/** Brand constants — the six areas that define what Vermaak does. */
const AREAS = [
  {
    icon: Cpu,
    title: "Technology",
    body: "Digital platforms, software products and technology systems built for African organisations and markets.",
  },
  {
    icon: Users,
    title: "Talent",
    body: "Training, capacity development and a digital workforce pipeline that connects skills to real opportunity.",
  },
  {
    icon: Lightbulb,
    title: "Consulting",
    body: "Advisory, research and programme delivery for governments, development partners and enterprises.",
  },
  {
    icon: Palette,
    title: "Creative Economy",
    body: "Support for creators, cultural institutions and the businesses growing Africa's creative sector.",
  },
  {
    icon: LayoutGrid,
    title: "Digital Products",
    body: "Owned platforms and tools that scale beyond a single project and serve entire industries.",
  },
  {
    icon: Sparkles,
    title: "Experiences",
    body: "Events, convenings and experiences that bring people, ideas and opportunity into one room.",
  },
];

export function AreasOfWork() {
  return (
    <section className="shell py-24 lg:py-32">
      <SectionHeading
        eyebrow="Our areas of work"
        title="Six connected areas, one ambition."
        subtitle="Vermaak works where technology, talent and creativity meet — building capability and infrastructure that lasts."
      />

      <div className="mt-16 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
        {AREAS.map((area, index) => (
          <Reveal key={area.title} delay={index * 60}>
            <div className="group h-full bg-background p-8 transition-colors hover:bg-sand/70">
              <area.icon
                className="size-6 text-accent transition-transform duration-300 group-hover:-translate-y-1"
                strokeWidth={1.5}
              />
              <h3 className="mt-6 font-display text-2xl font-medium tracking-tight">{area.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{area.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
