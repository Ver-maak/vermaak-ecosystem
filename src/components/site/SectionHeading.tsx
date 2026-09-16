import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <Reveal
      className={cn("flex flex-wrap items-end justify-between gap-6", className)}
    >
      <div className="max-w-3xl">
        {eyebrow ? <p className="eyebrow mb-5">{eyebrow}</p> : null}
        <h2 className="display-lg">{title}</h2>
        {subtitle ? (
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </Reveal>
  );
}
