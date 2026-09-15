/**
 * Analytics helpers. IDs are configurable through environment variables:
 *   VITE_GA_MEASUREMENT_ID, VITE_META_PIXEL_ID
 * Nothing loads and nothing is tracked when they are unset.
 */

export const GA_MEASUREMENT_ID = import.meta.env["VITE_GA_MEASUREMENT_ID"] as string | undefined;
export const META_PIXEL_ID = import.meta.env["VITE_META_PIXEL_ID"] as string | undefined;

type EventName =
  | "cta_click"
  | "venture_click"
  | "external_venture_click"
  | "contact_submit"
  | "newsletter_subscribe"
  | "insight_view"
  | "project_view";

export function trackEvent(name: EventName, params: Record<string, string | number> = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  };
  w.gtag?.("event", name, params);
  w.fbq?.("trackCustom", name, params);
}
