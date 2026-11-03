import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  audience: z.enum(["Entrepreneur", "Creative", "Organisation", "Community"]),
  goals: z.string().trim().min(10).max(2000),
});

export type Recommendation = {
  kind: "venture" | "service" | "programme";
  slug: string;
  name: string;
  reason: string;
  next_step: string;
  url: string | null;
};

const Result = z.object({
  summary: z.string(),
  recommendations: z
    .array(
      z.object({
        kind: z.enum(["venture", "service", "programme"]),
        slug: z.string(),
        name: z.string().optional(),
        reason: z.string(),
        next_step: z.string(),
      }),
    )
    .max(6),
});

export const recommendForGoals = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { error: "The recommendation service isn't configured yet." };

    const { supabase } = await import("@/integrations/supabase/client");
    const [{ data: ventures }, { data: services }] = await Promise.all([
      supabase.from("ventures").select("slug,name,short_description,categories,status,url"),
      supabase.from("services").select("slug,title,description,capabilities"),
    ]);
    const catalog = {
      ventures: (ventures ?? []).map((v) => ({
        slug: v.slug,
        name: v.name,
        description: v.short_description,
        categories: v.categories,
        status: v.status,
      })),
      services: (services ?? []).map((s) => ({
        slug: s.slug,
        name: s.title,
        description: s.description,
        capabilities: s.capabilities,
      })),
    };

    const { createOpenAI } = await import("@ai-sdk/openai");
    const { streamText } = await import("ai");
    const provider = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey,
      headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    });

    try {
      const result = streamText({
        model: provider.responses("openai/gpt-6-astra"),
        system:
          "You are Vermaak's advisor. Vermaak is a technology company building talent, markets and systems for Africa's digital and creative economy. Recommend 2-5 relevant offerings. Use the provided catalog first (exact slugs; prefer active ventures and say so if a venture is 'coming_soon' or 'developing'). You are NOT limited to the catalog: also draw on your broad knowledge of digital transformation, skills development, business support, market access, creative economy programmes, funding readiness and best practices from other sources, and frame these as tailored programmes Vermaak can offer or co-design (kind 'programme', a short kebab-case slug, and a 'name'). Reply with ONLY a JSON object: {\"summary\": string, \"recommendations\": [{\"kind\": \"venture\"|\"service\"|\"programme\", \"slug\": string, \"name\"?: string, \"reason\": string (1-2 sentences, addressed to the user), \"next_step\": string (short action)}]}.",
        messages: [
          {
            role: "user",
            content: `Catalog:\n${JSON.stringify(catalog)}\n\nI am a(n) ${data.audience}. My goals:\n${data.goals}`,
          },
        ],
        maxRetries: 0,
        providerOptions: {
          openai: {
            store: false,
            forceReasoning: true,
            reasoningEffort: "low",
            include: ["reasoning.encrypted_content"],
          },
        },
      });
      const text = await result.text;
      const match = text.match(/\{[\s\S]*\}/);
      const parsed = Result.parse(JSON.parse(match ? match[0] : text));

      const recommendations: Recommendation[] = [];
      for (const r of parsed.recommendations) {
        if (r.kind === "programme") {
          recommendations.push({ ...r, name: r.name ?? r.slug, url: null });
        } else if (r.kind === "venture") {
          const v = (ventures ?? []).find((x) => x.slug === r.slug);
          if (v) recommendations.push({ ...r, name: v.name, url: v.status === "coming_soon" ? null : v.url });
        } else {
          const s = (services ?? []).find((x) => x.slug === r.slug);
          if (s) recommendations.push({ ...r, name: s.title, url: null });
        }
      }
      return { summary: parsed.summary, recommendations };
    } catch (err) {
      console.error("recommendForGoals failed", err);
      const status = (err as { statusCode?: number })?.statusCode;
      if (status === 429) return { error: "We're getting a lot of requests. Please try again in a minute." };
      if (status === 402 || status === 403)
        return { error: "Recommendations are temporarily unavailable. Please contact us directly." };
      return { error: "We couldn't generate recommendations right now. Please try again." };
    }
  });
