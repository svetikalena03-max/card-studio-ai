import type { CardInput, CardResult } from "./types";

/**
 * Calls the server route /api/generate-card which proxies to the
 * Lovable AI Gateway (OpenAI-compatible). Never call AI providers from
 * the client — secrets stay on the server.
 *
 * Configuration lives in:
 *   - src/lib/ai/config.ts        (model / endpoint)
 *   - src/lib/ai/system-prompt.ts (system prompt)
 *   - src/lib/ai/schema.ts        (tool-calling schema)
 *   - src/routes/api/generate-card.ts (server handler)
 */
export async function generateProductCard(input: CardInput): Promise<CardResult> {
  const res = await fetch("/api/generate-card", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    let message = `Ошибка генерации (${res.status})`;
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }

  return (await res.json()) as CardResult;
}
