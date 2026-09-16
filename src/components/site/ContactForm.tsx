import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";

const AREAS = [
  "Technology & product development",
  "Digital transformation",
  "Data & analytics",
  "Research & knowledge management",
  "Project & programme management",
  "Training & capacity development",
  "Creative economy advisory",
  "Events & experiences",
  "Organisational development",
  "Gender, inclusion & social impact",
  "Partnership or investment",
  "Something else",
];

const EMPTY = {
  name: "",
  organisation: "",
  email: "",
  phone: "",
  country: "",
  area_of_interest: "",
  message: "",
};

const FIELD =
  "mt-2 w-full border border-input bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-accent";

export function ContactForm() {
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);

  function set(key: keyof typeof EMPTY) {
    return (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((current) => ({ ...current, [key]: event.target.value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    const { error } = await supabase.from("contact_submissions").insert(form);
    setBusy(false);

    if (error) {
      toast.error("Your message didn't send. Please try again.");
      return;
    }
    trackEvent("contact_submit", { area: form.area_of_interest });
    toast.success("Thank you — we'll be in touch shortly.");
    setForm(EMPTY);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
      <label className="block">
        <span className="eyebrow">Name *</span>
        <input required value={form.name} onChange={set("name")} className={FIELD} />
      </label>
      <label className="block">
        <span className="eyebrow">Organisation</span>
        <input value={form.organisation} onChange={set("organisation")} className={FIELD} />
      </label>
      <label className="block">
        <span className="eyebrow">Email *</span>
        <input required type="email" value={form.email} onChange={set("email")} className={FIELD} />
      </label>
      <label className="block">
        <span className="eyebrow">Phone</span>
        <input value={form.phone} onChange={set("phone")} className={FIELD} />
      </label>
      <label className="block">
        <span className="eyebrow">Country</span>
        <input value={form.country} onChange={set("country")} className={FIELD} />
      </label>
      <label className="block">
        <span className="eyebrow">Area of interest</span>
        <select value={form.area_of_interest} onChange={set("area_of_interest")} className={FIELD}>
          <option value="">Select an area</option>
          {AREAS.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </label>
      <label className="block sm:col-span-2">
        <span className="eyebrow">Message *</span>
        <textarea
          required
          rows={6}
          value={form.message}
          onChange={set("message")}
          className={FIELD}
          placeholder="Tell us about the work you have in mind."
        />
      </label>
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center rounded-full bg-ink px-8 py-4 text-sm font-medium text-ink-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-60"
        >
          {busy ? "Sending…" : "Send Enquiry"}
        </button>
      </div>
    </form>
  );
}
