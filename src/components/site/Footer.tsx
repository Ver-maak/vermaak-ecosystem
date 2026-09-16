import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { settingsQuery, settingValue, venturesQuery } from "@/lib/cms";
import { trackEvent } from "@/lib/analytics";

const SITE_LINKS = [
  { to: "/about", label: "About" },
  { to: "/ecosystem", label: "Ecosystem" },
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/insights", label: "Insights" },
  { to: "/contact", label: "Contact" },
] as const;

const SOCIALS = [
  { key: "social_linkedin", label: "LinkedIn" },
  { key: "social_instagram", label: "Instagram" },
  { key: "social_facebook", label: "Facebook" },
  { key: "social_x", label: "X" },
  { key: "social_youtube", label: "YouTube" },
];

export function Footer() {
  const { data: settings } = useQuery(settingsQuery);
  const { data: ventures } = useQuery(venturesQuery);
  const map = settings?.map;

  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="shell py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-display text-4xl font-semibold tracking-tight">
              Vermaak<span className="text-accent">.</span>
            </p>
            <p className="mt-5 max-w-xs leading-relaxed text-ink-foreground/60">
              {settingValue(map, "footer_tagline")}
            </p>
            <a
              href={`mailto:${settingValue(map, "contact_email")}`}
              className="mt-6 inline-block text-sm text-ink-foreground/80 underline underline-offset-4 hover:text-accent"
            >
              {settingValue(map, "contact_email")}
            </a>
            {settingValue(map, "contact_address") ? (
              <p className="mt-2 text-sm text-ink-foreground/50">
                {settingValue(map, "contact_address")}
              </p>
            ) : null}
          </div>

          <div className="lg:col-span-3">
            <p className="eyebrow mb-5 text-ink-foreground/45">Explore</p>
            <ul className="space-y-3 text-sm">
              {SITE_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-ink-foreground/75 hover:text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <p className="eyebrow mb-5 text-ink-foreground/45">Ventures</p>
            <ul className="space-y-3 text-sm">
              {(ventures ?? []).map((venture) =>
                venture.url ? (
                  <li key={venture.id}>
                    <a
                      href={venture.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() =>
                        trackEvent("external_venture_click", { venture: venture.slug, place: "footer" })
                      }
                      className="text-ink-foreground/75 hover:text-accent"
                    >
                      {venture.name}
                    </a>
                  </li>
                ) : (
                  <li key={venture.id}>
                    <Link
                      to="/ecosystem"
                      hash={venture.slug}
                      className="text-ink-foreground/75 hover:text-accent"
                    >
                      {venture.name}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-ink-foreground/15 pt-8 text-xs text-ink-foreground/50">
          <p>© Vermaak {new Date().getFullYear()}. All rights reserved.</p>
          <div className="flex flex-wrap gap-6">
            {SOCIALS.map((social) => {
              const href = settingValue(map, social.key);
              if (!href) return null;
              return (
                <a
                  key={social.key}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-accent"
                >
                  {social.label}
                </a>
              );
            })}
            <Link to="/admin" className="hover:text-accent">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
