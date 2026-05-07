import { AI_CONFIG } from "./config";

/**
 * JSON Schema for the AI tool call. Matches CardResult fields the UI renders.
 * We use tool calling instead of "return JSON" for reliable structured output.
 */
export const CARD_TOOL = {
  type: "function" as const,
  function: {
    name: AI_CONFIG.toolName,
    description:
      "Возвращает полностью готовую карточку товара для маркетплейса со всеми текстами, SEO, идеями инфографики, фото и Reels.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        competitorAnalysis: {
          type: "string",
          description:
            "Развёрнутый анализ конкурентов в категории на выбранной площадке: как выглядят их карточки, какие приёмы используют, что общего.",
        },
        competitorWeaknesses: {
          type: "array",
          minItems: 4,
          items: { type: "string" },
          description: "Конкретные слабые места конкурентов, которые можно использовать для отстройки.",
        },
        positioningStrategy: {
          type: "string",
          description: "Стратегия позиционирования товара: как именно мы отстраиваемся, через что доносим ценность.",
        },
        seoTitle: {
          type: "string",
          description: "SEO-заголовок карточки (до 100 символов), оптимизированный под поиск площадки.",
        },
        shortDescription: {
          type: "string",
          description: "Короткое описание для превью / первого экрана (1–2 предложения).",
        },
        fullDescription: {
          type: "string",
          description: "Полное продающее описание со структурой, абзацами и эмоциональным крючком.",
        },
        advantages: {
          type: "array",
          minItems: 5,
          items: { type: "string" },
          description: "Ключевые преимущества товара, сформулированные через выгоду для покупателя.",
        },
        targetAudience: {
          type: "string",
          description: "Подробное описание целевой аудитории: кто это, какие у них боли, почему им подходит товар.",
        },
        seoKeywords: {
          type: "array",
          minItems: 8,
          items: { type: "string" },
          description: "Ключевые слова и поисковые запросы для SEO-оптимизации карточки.",
        },
        antiTemplate: {
          type: "string",
          description: "Какие шаблонные формулировки НЕ использовать в этой карточке и почему.",
        },
        infographicIdeas: {
          type: "array",
          minItems: 6,
          items: { type: "string" },
          description: "Идеи слайдов инфографики: что показать на каждом слайде карусели карточки.",
        },
        lifestylePhotoIdeas: {
          type: "array",
          minItems: 4,
          items: { type: "string" },
          description: "Идеи lifestyle-фотосъёмок товара в реальных сценариях использования.",
        },
        aiPhotoPrompts: {
          type: "array",
          minItems: 4,
          items: { type: "string" },
          description:
            "Готовые англоязычные промпты для генерации фото товара через AI (Midjourney / Nano Banana / DALL-E).",
        },
        reelsIdeas: {
          type: "array",
          minItems: 5,
          items: { type: "string" },
          description: "Идеи коротких видео (Reels / Shorts / VK Клипы) для продвижения товара.",
        },
      },
      required: [
        "competitorAnalysis",
        "competitorWeaknesses",
        "positioningStrategy",
        "seoTitle",
        "shortDescription",
        "fullDescription",
        "advantages",
        "targetAudience",
        "seoKeywords",
        "antiTemplate",
        "infographicIdeas",
        "lifestylePhotoIdeas",
        "aiPhotoPrompts",
        "reelsIdeas",
      ],
    },
  },
};