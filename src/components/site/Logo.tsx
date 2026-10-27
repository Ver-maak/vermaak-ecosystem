import logo from "@/assets/vermaak-logo.png.asset.json";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return <img src={logo.url} alt="Vermaak" width={800} height={262} className={cn("h-9 w-auto", className)} />;
}
