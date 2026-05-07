import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { AI_CONFIG } from "@/lib/ai/config";
import { CARD_TOOL } from "@/lib/ai/schema";
import { SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import type { CardResult } from "@/lib/ai/types";

const InputSchema = z.object({
  productName: z.string().min(1).max(200),
  marketplace: z.enum(["Wildberries", "Ozon", "Яндекс Маркет", "Lamoda", "Другое"]),
  audience: z.string().max(500).default(""),
  features: z.string().max(2000).default(""),
  differentiators: z.string().max(2000).default(""),
  competitorLinks: z.string().max(2000).default(""),
  style: z.enum(["premium", "minimalism", "mass market", "kids", "tech", "wellness", "home aesthetic"]),
  notes: z.string().max(1000).default(""),
});

function buildUserPrompt(input: z.infer<typeof InputSchema>): string {
  return [
    `Маркетплейс: ${input.marketplace}`,
    `Товар: ${input.productName}`,
    `Желаемый стиль: ${input.style}`,
    `Целевая аудитория: ${input.audience || "(не указана — определи сама)"}`,
    `Характеристики: ${input.features || "(не указаны)"}`,
    `Отличия от конкурентов: ${input.differentiators || "(не указаны — придумай возможные)"}`,
    `Ссылки на конкурентов: ${input.competitorLinks || "(не указаны)"}`,
    `Дополнительные пожелания: ${input.notes || "(нет)"}`,
    "",
    "Сгенерируй полностью готовую карточку товара через инструмент return_marketplace_card.",
  ].join("\n");
}

export const Route = createFileRoute("/api/generate-card")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) {
          return Response.json(
            { error: "AI не настроен: LOVABLE_API_KEY отсутствует" },
            { status: 500 },
          );
        }

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Некорректный JSON" }, { status: 400 });
        }

        const parsed = InputSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            { error: "Неверные данные формы", details: parsed.error.issues },
            { status: 400 },
          );
        }
        const input = parsed.data;

        let upstream: Response;
        try {
          upstream = await fetch(AI_CONFIG.endpoint, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: AI_CONFIG.model,
              temperature: AI_CONFIG.temperature,
              messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: buildUserPrompt(input) },
              ],
              tools: [CARD_TOOL],
              tool_choice: { type: "function", function: { name: AI_CONFIG.toolName } },
            }),
          });
        } catch (e) {
          console.error("AI gateway request failed:", e);
          return Response.json({ error: "Не удалось связаться с AI-сервисом" }, { status: 502 });
        }

        if (upstream.status === 429) {
          return Response.json(
            { error: "Слишком много запросов. Попробуйте через минуту." },
            { status: 429 },
          );
        }
        if (upstream.status === 402) {
          return Response.json(
            { error: "Закончились AI-кредиты. Пополните баланс в настройках workspace." },
            { status: 402 },
          );
        }
        if (!upstream.ok) {
          const text = await upstream.text();
          console.error("AI gateway error:", upstream.status, text);
          return Response.json({ error: "Ошибка AI-сервиса" }, { status: 500 });
        }

        const completion = await upstream.json();
        const toolCall = completion?.choices?.[0]?.message?.tool_calls?.[0];
        const argsRaw = toolCall?.function?.arguments;
        if (!argsRaw) {
          console.error("AI gateway: no tool call in response", completion);
          return Response.json({ error: "AI не вернул структурированный результат" }, { status: 500 });
        }

        let args: Omit<CardResult, "id" | "createdAt" | "input">;
        try {
          args = typeof argsRaw === "string" ? JSON.parse(argsRaw) : argsRaw;
        } catch (e) {
          console.error("AI gateway: cannot parse tool arguments", argsRaw, e);
          return Response.json({ error: "AI вернул некорректный JSON" }, { status: 500 });
        }

        const result: CardResult = {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          input,
          ...args,
        };

        return Response.json(result);
      },
    },
  },
});