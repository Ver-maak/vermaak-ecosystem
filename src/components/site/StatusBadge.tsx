import { STATUS_LABEL, type VentureStatus } from "@/lib/cms";
import { cn } from "@/lib/utils";

const STYLES: Record<VentureStatus, string> = {
  active: "bg-ink text-ink-foreground",
  developing: "bg-accent/15 text-accent border border-accent/40",
  coming_soon: "border border-dashed border-foreground/35 text-muted-foreground",
};

export function StatusBadge({ status, className }: { status: VentureStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em]",
        STYLES[status],
        className,
      )}
    >
      {status === "developing" ? <span className="size-1.5 rounded-full bg-accent" /> : null}
      {STATUS_LABEL[status]}
    </span>
  );
}
