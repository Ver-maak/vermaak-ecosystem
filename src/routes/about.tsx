import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import storyImage from "@/assets/about-story.jpg";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { TeamCard } from "@/components/site/TeamCard";
import { StatsSection } from "@/components/site/StatsSection";
import { CTASection } from "@/components/site/CTASection";
import { teamQuery, timelineQuery } from "@/lib/cms";

const TITLE = "About Vermaak | An African Creative & Digital Company";
const DESCRIPTION =
  "Who we are, what we do and where we're going: Vermaak's story, vision, mission and the values behind our ventures across Africa's creative and digital economy.";

const VALUES = [
  { title: "Creativity", body: "We treat imagination as infrastructure, not decoration." },
  { title: "Innovation", body: "We build what does not exist yet, and improve what does." },
  { title: "Inclusion", body: "Opportunity must reach people the old systems left out." },
  { title: "Excellence", body: "Work that stands up to scrutiny, from code to consulting." },
  { title: "Collaboration", body: "We move with partners, not around them." },
  { title: "Integrity", body: "We are plain about what we can do and what we cannot." },
  { title: "Impact", body: "We measure ourselves by what changes, not what we produce." },
];

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: "https://vermaak-ecosystem.lovable.app/about" },
    ],
    links: [{ rel: "canonical", href: "https://vermaak-ecosystem.lovable.app/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { data: team } = useQuery(teamQuery);
  const { data: timeline } = useQuery(timelineQuery);

  return (
    <SiteLayout>
      <header className="border-b border-border">
        <div className="shell py-20 lg:py-28">
          <Reveal>
            <p className="eyebrow">About Vermaak</p>
            <h1 className="display-xl mt-7 max-w-4xl">
              An African company building the infrastructure of creative and digital work
              <span className="text-accent">.</span>
            </h1>
          </Reveal>
        </div>
      </header>

      <section className="shell grid gap-12 py-24 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Reveal>
            <p className="eyebrow">Who we are</p>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Vermaak is an African creative-economy and digital-workforce company. We operate as an
              umbrella brand: a group of ventures that share one standard of craft, one set of values
              and one ambition — to build capability on the continent rather than import it.
            </p>
            <p className="eyebrow mt-12">What we do</p>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              We advise, we train and we build. That means digital transformation and technology
              products for institutions, research and programme delivery for partners, training and
              talent pipelines for young professionals, and platforms and experiences that serve
              Africa's creative sector.
            </p>
          </Reveal>
        </div>
        <div className="lg:col-span-6">
          <Reveal delay={100}>
            <img
              src={storyImage}
              alt="A Vermaak facilitator leading a training workshop"
              loading="lazy"
              width={1408}
              height={1008}
              className="aspect-[7/5] w-full object-cover"
            />
          </Reveal>
        </div>
      </section>

      {/* Vision & mission */}
      <section className="border-y border-border bg-sand/50">
        <div className="shell grid gap-px bg-border md:grid-cols-2">
          <div className="bg-sand/50 p-10 lg:p-16">
            <p className="eyebrow">Vision</p>
            <p className="mt-6 font-display text-3xl leading-snug tracking-tight">
              An Africa where creative and digital work is a credible, well-paid path — and where the
              platforms that enable it are built here.
            </p>
          </div>
          <div className="bg-sand/50 p-10 lg:p-16">
            <p className="eyebrow">Mission</p>
            <p className="mt-6 font-display text-3xl leading-snug tracking-tight">
              To build and operate ventures that grow skills, strengthen institutions and open
              markets for African creative and digital talent.
            </p>
          </div>
        </div>
      </section>

      <StatsSection />

      {/* Story / timeline */}
      {(timeline ?? []).length > 0 ? (
        <section className="shell py-24 lg:py-32">
          <SectionHeading eyebrow="Our story" title="How Vermaak grew." />
          <ol className="mt-14 divide-y divide-border border-t border-border">
            {(timeline ?? []).map((event, index) => (
              <Reveal as="li" key={event.id} delay={index * 50}>
                <div className="grid gap-4 py-10 lg:grid-cols-12">
                  <p className="font-display text-3xl tracking-tight text-accent lg:col-span-2">
                    {event.year}
                  </p>
                  <h3 className="font-display text-2xl font-medium tracking-tight lg:col-span-4">
                    {event.title}
                  </h3>
                  <p className="leading-relaxed text-muted-foreground lg:col-span-6">
                    {event.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </section>
      ) : null}

      {/* Values */}
      <section className="border-t border-border">
        <div className="shell py-24 lg:py-32">
          <SectionHeading eyebrow="Our values" title="Seven commitments we work by." />
          <div className="mt-14 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value, index) => (
              <Reveal key={value.title} delay={index * 50}>
                <div className="h-full bg-background p-8">
                  <p className="font-display text-xl font-medium tracking-tight">{value.title}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{value.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      {(team ?? []).length > 0 ? (
        <section className="shell border-t border-border py-24 lg:py-32">
          <SectionHeading eyebrow="Team" title="The people behind the ventures." />
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {(team ?? []).map((member, index) => (
              <Reveal key={member.id} delay={index * 60}>
                <TeamCard member={member} />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      <CTASection
        eyebrow="Work with us"
        title="Let's build something together."
        ctaLabel="Start a Conversation"
      />
    </SiteLayout>
  );
}
