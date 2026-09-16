import { Linkedin } from "lucide-react";
import type { TeamMember } from "@/lib/cms";

export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article className="flex flex-col">
      {member.photo_url ? (
        <img
          src={member.photo_url}
          alt={member.name}
          loading="lazy"
          className="aspect-[4/5] w-full object-cover"
        />
      ) : (
        <div className="aspect-[4/5] w-full bg-sand" aria-hidden="true" />
      )}
      <h3 className="mt-5 font-display text-xl font-medium tracking-tight">{member.name}</h3>
      {member.position ? <p className="text-sm text-accent">{member.position}</p> : null}
      {member.bio ? (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
      ) : null}
      {member.linkedin_url ? (
        <a
          href={member.linkedin_url}
          target="_blank"
          rel="noreferrer"
          aria-label={`${member.name} on LinkedIn`}
          className="mt-4 inline-flex size-9 items-center justify-center rounded-full border border-border hover:text-accent"
        >
          <Linkedin className="size-4" />
        </a>
      ) : null}
    </article>
  );
}
