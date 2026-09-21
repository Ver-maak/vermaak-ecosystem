import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { CTASection } from "@/components/site/CTASection";
import { servicesQuery } from "@/lib/cms";

const TITLE = "Services | Vermaak Advisory, Technology & Training";
const DESCRIPTION =
  "Digital transformation, technology and product development, data and analytics, research, programme management, training, creative economy advisory, events, organisational development, and inclusion.";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: "https://vermaak-ecosystem.lovable.app/services" },
    ],
    links: [{ rel: "canonical", href: "https://vermaak-ecosystem.lovable.app/services" }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { data: services } = useQuery(servicesQuery);

  return (
    <SiteLayout>
      <header className="border-b border-border">
        <div className="shell py-20 lg:py-28">
          <Reveal>
            <p className="eyebrow">Services</p>
            <h1 className="display-xl mt-7 max-w-4xl">
              Advisory depth, with the ability to build it ourselves
              <span className="text-accent">.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              We work across ten practice areas. Most engagements combine several — strategy that
              ends in a working platform, research that ends in trained people.
            </p>
          </Reveal>
        </div>
      </header>

      <section className="shell py-16 lg:py-24">
        <div className="divide-y divide-border border-y border-border">
          {(services ?? []).map((service, index) => (
            <Reveal key={service.id} delay={index * 40}>
              <article className="grid gap-8 py-14 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <span className="eyebrow text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="mt-4 font-display text-3xl font-medium tracking-tight">
                    {service.title}
                  </h2>
                </div>
                <div className="lg:col-span-8">
                  <p className="max-w-2xl leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>

                  <div className="mt-8 grid gap-8 sm:grid-cols-2">
                    {service.capabilities.length > 0 ? (
                      <div>
                        <p className="eyebrow">Capabilities</p>
                        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                          {service.capabilities.map((item) => (
                            <li key={item} className="flex gap-3">
                              <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    {service.deliverables.length > 0 ? (
                      <div>
                        <p className="eyebrow">Deliverables</p>
                        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                          {service.deliverables.map((item) => (
                            <li key={item} className="flex gap-3">
                              <span className="mt-2 size-1 shrink-0 rounded-full bg-foreground/30" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>

                  <Link
                    to="/contact"
                    className="mt-9 inline-flex items-center gap-2 text-sm font-medium hover:text-accent"
                  >
                    Discuss a Project
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <CTASection ctaLabel="Discuss a Project" />
    </SiteLayout>
  );
}
