import { useEffect, useState } from "react";
import { Logo } from "@/components/site/Logo";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Content manager — Vermaak" },
      { name: "description", content: "Manage Vermaak website content." },
      { property: "og:title", content: "Content manager — Vermaak" },
      { property: "og:description", content: "Manage Vermaak website content." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type FieldType = "text" | "textarea" | "number" | "boolean" | "list" | "date" | "select";
type Field = { name: string; label: string; type?: FieldType; options?: string[]; required?: boolean };
type Collection = {
  table: string;
  label: string;
  key?: string;
  order?: { column: string; ascending: boolean };
  titleField: string;
  fields: Field[];
  readOnly?: boolean;
  queryKey: string;
};

const COLLECTIONS: Collection[] = [
  {
    table: "ventures", label: "Ventures", titleField: "name", queryKey: "ventures",
    order: { column: "display_order", ascending: true },
    fields: [
      { name: "name", label: "Name", required: true },
      { name: "slug", label: "Slug", required: true },
      { name: "status", label: "Status", type: "select", options: ["active", "developing", "coming_soon"] },
      { name: "short_description", label: "Short description", type: "textarea" },
      { name: "full_description", label: "Full description", type: "textarea" },
      { name: "categories", label: "Categories (comma separated)", type: "list" },
      { name: "category", label: "Primary category" },
      { name: "url", label: "Website URL" },
      { name: "cta_label", label: "Button label" },
      { name: "logo_url", label: "Logo URL" },
      { name: "cover_image_url", label: "Cover image URL" },
      { name: "featured", label: "Featured", type: "boolean" },
      { name: "display_order", label: "Display order", type: "number" },
    ],
  },
  {
    table: "projects", label: "Projects", titleField: "name", queryKey: "projects",
    order: { column: "display_order", ascending: true },
    fields: [
      { name: "name", label: "Name", required: true },
      { name: "slug", label: "Slug", required: true },
      { name: "client", label: "Client" },
      { name: "sector", label: "Sector (Technology, Consulting, Training, Events, Creative, Research)" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "image_url", label: "Image URL" },
      { name: "services", label: "Services (comma separated)", type: "list" },
      { name: "year", label: "Year", type: "number" },
      { name: "impact", label: "Results / impact", type: "textarea" },
      { name: "case_study_url", label: "Case study link" },
      { name: "featured", label: "Featured on homepage", type: "boolean" },
      { name: "display_order", label: "Display order", type: "number" },
    ],
  },
  {
    table: "insights", label: "Insights", titleField: "title", queryKey: "insights",
    order: { column: "published_at", ascending: false },
    fields: [
      { name: "title", label: "Title", required: true },
      { name: "slug", label: "Slug", required: true },
      { name: "author", label: "Author" },
      { name: "published_at", label: "Date", type: "date" },
      { name: "category", label: "Category" },
      { name: "image_url", label: "Featured image URL" },
      { name: "excerpt", label: "Excerpt", type: "textarea" },
      { name: "content", label: "Content (blank line between paragraphs, ## for headings)", type: "textarea" },
      { name: "tags", label: "Tags (comma separated)", type: "list" },
      { name: "featured", label: "Featured", type: "boolean" },
      { name: "published", label: "Published", type: "boolean" },
    ],
  },
  {
    table: "partners", label: "Partners", titleField: "name", queryKey: "partners",
    order: { column: "display_order", ascending: true },
    fields: [
      { name: "name", label: "Organisation", required: true },
      { name: "logo_url", label: "Logo URL" },
      { name: "website_url", label: "Website" },
      { name: "category", label: "Category" },
      { name: "display_order", label: "Display order", type: "number" },
    ],
  },
  {
    table: "team_members", label: "Team", titleField: "name", queryKey: "team_members",
    order: { column: "display_order", ascending: true },
    fields: [
      { name: "name", label: "Name", required: true },
      { name: "position", label: "Position" },
      { name: "bio", label: "Bio", type: "textarea" },
      { name: "photo_url", label: "Photo URL" },
      { name: "linkedin_url", label: "LinkedIn" },
      { name: "display_order", label: "Display order", type: "number" },
    ],
  },
  {
    table: "stats", label: "Impact stats", titleField: "label", queryKey: "stats",
    order: { column: "display_order", ascending: true },
    fields: [
      { name: "label", label: "Label", required: true },
      { name: "value", label: "Value", required: true },
      { name: "suffix", label: "Suffix (e.g. +)" },
      { name: "display_order", label: "Display order", type: "number" },
    ],
  },
  {
    table: "services", label: "Services", titleField: "title", queryKey: "services",
    order: { column: "display_order", ascending: true },
    fields: [
      { name: "title", label: "Title", required: true },
      { name: "slug", label: "Slug", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "capabilities", label: "Capabilities (comma separated)", type: "list" },
      { name: "deliverables", label: "Deliverables (comma separated)", type: "list" },
      { name: "display_order", label: "Display order", type: "number" },
    ],
  },
  {
    table: "timeline_events", label: "Timeline", titleField: "title", queryKey: "timeline_events",
    order: { column: "display_order", ascending: true },
    fields: [
      { name: "year", label: "Year", required: true },
      { name: "title", label: "Title", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "display_order", label: "Display order", type: "number" },
    ],
  },
  {
    table: "site_settings", label: "Site settings", titleField: "key", key: "key", queryKey: "site_settings",
    order: { column: "key", ascending: true },
    fields: [
      { name: "key", label: "Key", required: true },
      { name: "label", label: "Label" },
      { name: "value", label: "Value", type: "textarea" },
    ],
  },
  {
    table: "contact_submissions", label: "Enquiries", titleField: "name", readOnly: true, queryKey: "contact_submissions",
    order: { column: "created_at", ascending: false },
    fields: [
      { name: "name", label: "Name" }, { name: "organisation", label: "Organisation" },
      { name: "email", label: "Email" }, { name: "phone", label: "Phone" },
      { name: "country", label: "Country" }, { name: "area_of_interest", label: "Area" },
      { name: "message", label: "Message" }, { name: "created_at", label: "Received" },
    ],
  },
  {
    table: "newsletter_subscribers", label: "Subscribers", titleField: "email", readOnly: true, queryKey: "newsletter_subscribers",
    order: { column: "created_at", ascending: false },
    fields: [
      { name: "name", label: "Name" }, { name: "email", label: "Email" }, { name: "created_at", label: "Subscribed" },
    ],
  },
];

type Row = Record<string, unknown>;

function AdminPage() {
  const { user, isEditor, loading } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState(COLLECTIONS[0]!.table);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>;
  }

  if (!isEditor) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="font-display text-2xl">You don't have editing access yet.</h1>
        <p className="max-w-sm text-sm text-muted-foreground">Ask an administrator to give your account editor rights.</p>
        <button onClick={() => supabase.auth.signOut()} className="text-sm underline">Sign out</button>
      </div>
    );
  }

  const collection = COLLECTIONS.find((c) => c.table === active) ?? COLLECTIONS[0]!;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="shell flex items-center justify-between py-5">
          <Link to="/" className="font-display text-2xl font-semibold tracking-tight">
            <Logo className="h-8" /> <span className="text-sm font-normal text-muted-foreground">Content</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-muted-foreground sm:inline">{user.email}</span>
            <button onClick={() => supabase.auth.signOut()} className="hover:text-accent">Sign out</button>
          </div>
        </div>
      </header>
      <div className="shell grid gap-10 py-10 lg:grid-cols-[220px_1fr]">
        <nav className="flex flex-wrap gap-2 lg:flex-col">
          {COLLECTIONS.map((c) => (
            <button
              key={c.table}
              onClick={() => setActive(c.table)}
              className={cn(
                "rounded-md px-4 py-2 text-left text-sm transition-colors",
                active === c.table ? "bg-ink text-ink-foreground" : "hover:bg-sand",
              )}
            >
              {c.label}
            </button>
          ))}
        </nav>
        <CollectionManager key={collection.table} collection={collection} />
      </div>
    </div>
  );
}

function CollectionManager({ collection }: { collection: Collection }) {
  const queryClient = useQueryClient();
  const keyField = collection.key ?? "id";
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Row | null>(null);
  const [isNew, setIsNew] = useState(false);

  async function load() {
    // Table names come from the fixed COLLECTIONS list above.
    const table = supabase.from(collection.table as "ventures");
    let query = table.select("*");
    if (collection.order) query = query.order(collection.order.column as "name", { ascending: collection.order.ascending });
    const { data, error } = await query;
    if (error) { toast.error(error.message); return; }
    setRows((data ?? []) as Row[]);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection.table]);

  async function save(values: Row) {
    const table = supabase.from(collection.table as "ventures");
    const payload = values as never;
    const { error } = isNew
      ? await table.insert(payload)
      : await table.update(payload).eq(keyField as "id", editing![keyField] as string);
    if (error) { toast.error(error.message); return; }
    toast.success("Saved");
    setEditing(null);
    queryClient.invalidateQueries({ queryKey: [collection.queryKey] });
    load();
  }

  async function remove(row: Row) {
    if (!confirm(`Delete "${String(row[collection.titleField] ?? "")}"?`)) return;
    const { error } = await supabase.from(collection.table as "ventures").delete().eq(keyField as "id", row[keyField] as string);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    queryClient.invalidateQueries({ queryKey: [collection.queryKey] });
    load();
  }

  return (
    <section>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-medium tracking-tight">{collection.label}</h1>
        {!collection.readOnly ? (
          <button
            onClick={() => { setIsNew(true); setEditing({}); }}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm text-ink-foreground hover:bg-accent"
          >
            <Plus className="size-4" /> Add
          </button>
        ) : null}
      </div>

      <div className="mt-8 divide-y divide-border border border-border bg-card">
        {rows.length === 0 ? <p className="p-6 text-sm text-muted-foreground">Nothing here yet.</p> : null}
        {rows.map((row) => (
          <div key={String(row[keyField])} className="flex items-start justify-between gap-4 p-5">
            <div className="min-w-0">
              <p className="font-medium">{String(row[collection.titleField] ?? "Untitled")}</p>
              {collection.readOnly ? (
                <dl className="mt-2 grid gap-1 text-sm text-muted-foreground">
                  {collection.fields.filter((f) => f.name !== collection.titleField && row[f.name]).map((f) => (
                    <div key={f.name}><dt className="inline font-medium text-foreground">{f.label}: </dt><dd className="inline whitespace-pre-wrap">{String(row[f.name])}</dd></div>
                  ))}
                </dl>
              ) : (
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {"status" in row ? String(row["status"]).replace("_", " ") : String(row[collection.fields[1]?.name ?? ""] ?? "")}
                </p>
              )}
            </div>
            <div className="flex shrink-0 gap-2">
              {!collection.readOnly ? (
                <button aria-label="Edit" onClick={() => { setIsNew(false); setEditing(row); }} className="rounded-md p-2 hover:bg-sand">
                  <Pencil className="size-4" />
                </button>
              ) : null}
              <button aria-label="Delete" onClick={() => remove(row)} className="rounded-md p-2 text-destructive hover:bg-sand">
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing ? (
        <EditDialog
          collection={collection}
          initial={editing}
          onCancel={() => setEditing(null)}
          onSave={save}
        />
      ) : null}
    </section>
  );
}

function EditDialog({
  collection, initial, onCancel, onSave,
}: { collection: Collection; initial: Row; onCancel: () => void; onSave: (values: Row) => void }) {
  const [values, setValues] = useState<Row>(() => {
    const v: Row = {};
    for (const f of collection.fields) {
      const raw = initial[f.name];
      v[f.name] = f.type === "list" ? ((raw as string[] | undefined) ?? []).join(", ")
        : f.type === "boolean" ? Boolean(raw ?? (f.name === "published"))
        : raw ?? "";
    }
    return v;
  });

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const out: Row = {};
    for (const f of collection.fields) {
      const raw = values[f.name];
      if (f.type === "list") out[f.name] = String(raw).split(",").map((s) => s.trim()).filter(Boolean);
      else if (f.type === "number") out[f.name] = raw === "" ? (f.name === "display_order" ? 0 : null) : Number(raw);
      else if (f.type === "boolean") out[f.name] = Boolean(raw);
      else if (f.type === "date") { if (raw) out[f.name] = raw; }
      else out[f.name] = raw === "" ? null : raw;
    }
    onSave(out);
  }

  const input = "mt-1.5 w-full border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-accent";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-foreground/40 p-4">
      <form onSubmit={submit} className="my-10 w-full max-w-2xl bg-card p-8 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">{initial[collection.titleField] ? "Edit" : "New"} {collection.label.toLowerCase()}</h2>
          <button type="button" onClick={onCancel} aria-label="Close"><X className="size-5" /></button>
        </div>
        <div className="mt-6 grid gap-4">
          {collection.fields.map((f) => (
            <label key={f.name} className={f.type === "boolean" ? "flex items-center gap-3" : "block"}>
              {f.type === "boolean" ? (
                <input type="checkbox" checked={Boolean(values[f.name])} onChange={(e) => setValues({ ...values, [f.name]: e.target.checked })} />
              ) : null}
              <span className="text-sm font-medium">{f.label}{f.required ? " *" : ""}</span>
              {f.type === "textarea" ? (
                <textarea rows={f.name === "content" ? 12 : 4} required={f.required} value={String(values[f.name] ?? "")} onChange={(e) => setValues({ ...values, [f.name]: e.target.value })} className={input} />
              ) : f.type === "select" ? (
                <select value={String(values[f.name] || f.options![0])} onChange={(e) => setValues({ ...values, [f.name]: e.target.value })} className={input}>
                  {f.options!.map((o) => <option key={o} value={o}>{o.replace("_", " ")}</option>)}
                </select>
              ) : f.type === "boolean" ? null : (
                <input
                  type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
                  required={f.required}
                  value={String(values[f.name] ?? "")}
                  onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
                  className={input}
                />
              )}
            </label>
          ))}
        </div>
        <div className="mt-8 flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="rounded-full px-5 py-2.5 text-sm hover:bg-sand">Cancel</button>
          <button type="submit" className="rounded-full bg-ink px-6 py-2.5 text-sm text-ink-foreground hover:bg-accent">Save</button>
        </div>
      </form>
    </div>
  );
}
