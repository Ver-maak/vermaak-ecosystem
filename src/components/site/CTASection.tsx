import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export function CTASection({
  eyebrow = "Work with us",
  title = "Let's build something together.",
  body = "Whether you need a partner for a programme, a platform to build, or a team to train, start a conversation with Vermaak.",
  ctaLabel = "Start a Conversation",
  to = "/contact",
}: {
  eyebrow?: string;
  title?: string;
  body?: string;
  ctaLabel?: string;
  to?: "/contact" | "/ecosystem" | "/services";
}) {
  return (
    <section className="bg-ink text-ink-foreground">
      <div className="shell flex flex-col justify-between gap-10 py-24 lg:flex-row lg:items-center">
        <div className="max-w-2xl">
          <p className="eyebrow text-ink-foreground/45">{eyebrow}</p>
          <h2 className="display-lg mt-5">{title}</h2>
          <p className="mt-6 max-w-lg leading-relaxed text-ink-foreground/60">{body}</p>
        </div>
        <Link
          to={to}
          onClick={() => trackEvent("cta_click", { cta: ctaLabel, place: "cta_section" })}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-medium text-accent-foreground transition-transform hover:-translate-y-0.5"
        >
          {ctaLabel}
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
