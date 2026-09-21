import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { ContactForm } from "@/components/site/ContactForm";
import { NewsletterSection } from "@/components/site/NewsletterSection";
import { settingsQuery, settingValue } from "@/lib/cms";

const TITLE = "Contact Vermaak | Let's Build Something Together";
const DESCRIPTION =
  "Talk to Vermaak about a programme, a platform, a partnership or training. Tell us what you have in mind and we'll come back to you.";

const SOCIALS = [
  { key: "social_linkedin", label: "LinkedIn" },
  { key: "social_instagram", label: "Instagram" },
  { key: "social_facebook", label: "Facebook" },
  { key: "social_x", label: "X" },
  { key: "social_youtube", label: "YouTube" },
];

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: "https://vermaak-ecosystem.lovable.app/contact" },
    ],
    links: [{ rel: "canonical", href: "https://vermaak-ecosystem.lovable.app/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { data: settings } = useQuery(settingsQuery);
  const map = settings?.map;

  return (
    <SiteLayout>
      <header className="border-b border-border">
        <div className="shell py-20 lg:py-28">
          <Reveal>
            <p className="eyebrow">Contact</p>
            <h1 className="display-xl mt-7 max-w-3xl">
              Let's build something together
              <span className="text-accent">.</span>
            </h1>
          </Reveal>
        </div>
      </header>

      <section className="shell grid gap-16 py-20 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-4">
          <Reveal>
            <p className="eyebrow">Reach us</p>
            <a
              href={`mailto:${settingValue(map, "contact_email")}`}
              className="mt-5 block font-display text-2xl tracking-tight hover:text-accent"
            >
              {settingValue(map, "contact_email")}
            </a>
            {settingValue(map, "contact_phone") ? (
              <p className="mt-3 text-muted-foreground">{settingValue(map, "contact_phone")}</p>
            ) : null}
            {settingValue(map, "contact_address") ? (
              <p className="mt-3 max-w-xs leading-relaxed text-muted-foreground">
                {settingValue(map, "contact_address")}
              </p>
            ) : null}

            <p className="eyebrow mt-12">Follow</p>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              {SOCIALS.map((social) => {
                const href = settingValue(map, social.key);
                if (!href) return null;
                return (
                  <a
                    key={social.key}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted-foreground hover:text-accent"
                  >
                    {social.label}
                  </a>
                );
              })}
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-8">
          <Reveal delay={80}>
            <ContactForm />
          </Reveal>
        </div>
      </section>

      <NewsletterSection />
    </SiteLayout>
  );
}
