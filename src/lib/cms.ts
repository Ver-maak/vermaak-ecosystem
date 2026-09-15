import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Venture = Tables<"ventures">;
export type Project = Tables<"projects">;
export type Insight = Tables<"insights">;
export type Partner = Tables<"partners">;
export type TeamMember = Tables<"team_members">;
export type Stat = Tables<"stats">;
export type TimelineEvent = Tables<"timeline_events">;
export type Service = Tables<"services">;
export type SiteSetting = Tables<"site_settings">;

export type VentureStatus = Venture["status"];

export const STATUS_LABEL: Record<VentureStatus, string> = {
  active: "Active",
  developing: "Developing",
  coming_soon: "Coming soon",
};

function unwrap<T>(result: { data: T | null; error: { message: string } | null }): T {
  if (result.error) throw new Error(result.error.message);
  return (result.data ?? []) as T;
}

export const venturesQuery = queryOptions({
  queryKey: ["ventures"],
  queryFn: async () =>
    unwrap<Venture[]>(
      await supabase.from("ventures").select("*").order("display_order", { ascending: true }),
    ),
});

export const projectsQuery = queryOptions({
  queryKey: ["projects"],
  queryFn: async () =>
    unwrap<Project[]>(
      await supabase.from("projects").select("*").order("display_order", { ascending: true }),
    ),
});

export const insightsQuery = queryOptions({
  queryKey: ["insights"],
  queryFn: async () =>
    unwrap<Insight[]>(
      await supabase.from("insights").select("*").order("published_at", { ascending: false }),
    ),
});

export const partnersQuery = queryOptions({
  queryKey: ["partners"],
  queryFn: async () =>
    unwrap<Partner[]>(
      await supabase.from("partners").select("*").order("display_order", { ascending: true }),
    ),
});

export const teamQuery = queryOptions({
  queryKey: ["team_members"],
  queryFn: async () =>
    unwrap<TeamMember[]>(
      await supabase.from("team_members").select("*").order("display_order", { ascending: true }),
    ),
});

export const statsQuery = queryOptions({
  queryKey: ["stats"],
  queryFn: async () =>
    unwrap<Stat[]>(
      await supabase.from("stats").select("*").order("display_order", { ascending: true }),
    ),
});

export const timelineQuery = queryOptions({
  queryKey: ["timeline_events"],
  queryFn: async () =>
    unwrap<TimelineEvent[]>(
      await supabase.from("timeline_events").select("*").order("display_order", { ascending: true }),
    ),
});

export const servicesQuery = queryOptions({
  queryKey: ["services"],
  queryFn: async () =>
    unwrap<Service[]>(
      await supabase.from("services").select("*").order("display_order", { ascending: true }),
    ),
});

export const settingsQuery = queryOptions({
  queryKey: ["site_settings"],
  queryFn: async () => {
    const rows = unwrap<SiteSetting[]>(await supabase.from("site_settings").select("*"));
    const map: Record<string, string> = {};
    for (const row of rows) map[row.key] = row.value ?? "";
    return { rows, map };
  },
});

/** Defaults used before the CMS values load, so nothing renders empty. */
export const SETTING_FALLBACKS: Record<string, string> = {
  contact_email: "hello@vermaak.africa",
  footer_tagline: "Building Africa's Creative and Digital Future.",
};

export function settingValue(
  map: Record<string, string> | undefined,
  key: string,
  fallback = "",
): string {
  const value = map?.[key];
  if (value) return value;
  return SETTING_FALLBACKS[key] ?? fallback;
}
