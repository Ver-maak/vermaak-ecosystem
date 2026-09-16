import type { Partner } from "@/lib/cms";

export function PartnerLogo({ partner }: { partner: Partner }) {
  const content = partner.logo_url ? (
    <img
      src={partner.logo_url}
      alt={partner.name}
      loading="lazy"
      className="max-h-10 w-auto opacity-70 transition-opacity hover:opacity-100"
    />
  ) : (
    <span className="text-center font-display text-base text-muted-foreground">{partner.name}</span>
  );

  return (
    <div className="flex h-24 items-center justify-center border border-border bg-card px-6">
      {partner.website_url ? (
        <a href={partner.website_url} target="_blank" rel="noreferrer" className="hover:text-accent">
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
}
