import type { CardInput, CardResult } from "./types";

/**
 * AI service для генерации карточек товаров.
 *
 * Сейчас возвращает мок-ответ. Чтобы подключить реальный OpenAI / Lovable AI:
 * 1. Включите Lovable Cloud
 * 2. Создайте edge function (например, supabase/functions/generate-card)
 *    которая вызывает https://ai.gateway.lovable.dev/v1/chat/completions
 *    с моделью google/gemini-3-flash-preview и ключом LOVABLE_API_KEY
 * 3. Замените реализацию ниже на вызов supabase.functions.invoke('generate-card', { body: input })
 * 4. Используйте tool calling для возврата структурированного JSON по типу CardResult
 */

const STYLE_LABEL: Record<string, string> = {
  premium: "премиальный",
  minimalism: "минимализм",
  "mass market": "масс-маркет",
  kids: "детский",
  tech: "технологичный",
  wellness: "велнес",
  "home aesthetic": "home aesthetic",
};

export async function generateProductCard(input: CardInput): Promise<CardResult> {
  // Имитация задержки запроса к AI
  await new Promise((r) => setTimeout(r, 1400));

  const name = input.productName || "Товар";
  const styleLabel = STYLE_LABEL[input.style] ?? input.style;
  const mp = input.marketplace;

  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    input,
    competitorAnalysis: `На ${mp} большинство карточек в категории «${name}» выглядят однотипно: стандартные белые фоны, шаблонные заголовки с перечислением характеристик, инфографика с одинаковыми иконками. Конкуренты используют общие формулировки и не доносят ценность для конечного покупателя.`,
    competitorWeaknesses: [
      "Однотипные обложки без визуальной идентичности",
      "Заголовки перегружены ключевыми словами",
      "Нет lifestyle-сценариев использования",
      "Слабо раскрыты выгоды — только характеристики",
      "Отсутствуют ответы на возражения покупателя",
    ],
    positioningStrategy: `Отстройка через стиль «${styleLabel}» и фокус на аудитории «${input.audience || "целевой покупатель"}». Главное отличие — донесение ценности через эмоцию и сценарий использования, а не через сухие характеристики. Визуальный язык карточки выделяется в выдаче ${mp} за счёт чистой композиции и единой цветовой палитры.`,
    seoTitle: `${name} — ${styleLabel} | ${input.audience || "для всех"} | ${mp}`,
    shortDescription: `${name} в стиле ${styleLabel}. Создан для тех, кто ценит детали. Подходит для: ${input.audience || "широкой аудитории"}.`,
    fullDescription: `${name} — это не просто товар, а решение для ${input.audience || "вашей повседневной жизни"}.\n\nМы переосмыслили категорию: ${input.differentiators || "уникальный подход к качеству и дизайну"}.\n\nКлючевые характеристики:\n${input.features || "— премиальные материалы\n— продуманная эргономика\n— долговечность"}\n\nИдеально для ${input.audience || "тех, кто ценит качество"}. Доставка по всей России через ${mp}.`,
    advantages: [
      "Уникальный дизайн в выбранном стиле",
      "Премиальное качество материалов",
      "Продуманная эргономика",
      "Подходит как подарок",
      "Гарантия и поддержка",
    ],
    targetAudience: input.audience || "Покупатели, которые ищут качественный товар с продуманным дизайном и не готовы соглашаться на массовые шаблонные решения.",
    seoKeywords: [
      name.toLowerCase(),
      `${name.toLowerCase()} купить`,
      `${name.toLowerCase()} ${mp.toLowerCase()}`,
      `${name.toLowerCase()} ${styleLabel}`,
      "оригинальный дизайн",
      "премиум качество",
      "подарок",
      input.audience.toLowerCase() || "для дома",
    ].filter(Boolean),
    antiTemplate: `Не используйте: «лучший товар на рынке», «премиум качество по доступной цене», «идеальный подарок для всех». Эти формулировки обесценивают карточку и теряются среди конкурентов на ${mp}.`,
    infographicIdeas: [
      "Слайд 1: главный визуал товара + крупный заголовок выгоды",
      "Слайд 2: 3 ключевые характеристики с иконками",
      "Слайд 3: сравнение «до / после» использования",
      "Слайд 4: размеры и комплектация",
      "Слайд 5: отзыв-цитата довольного покупателя",
      "Слайд 6: сценарий использования в реальной жизни",
      "Слайд 7: гарантия и доставка",
    ],
    lifestylePhotoIdeas: [
      `${name} в естественной среде использования у целевой аудитории`,
      "Крупный план деталей и текстуры",
      "Сцена использования в утреннем свете",
      "Композиция с сопутствующими предметами",
      "Эмоциональный портрет довольного покупателя с товаром",
    ],
    aiPhotoPrompts: [
      `Professional product photography of ${name}, ${input.style} style, soft natural lighting, minimal background, shallow depth of field, editorial composition, 8k`,
      `Lifestyle shot of ${name} in modern interior, ${input.style} aesthetic, morning light through window, candid mood, photorealistic`,
      `Top-down flat lay of ${name} with complementary objects, clean white surface, ${input.style} style, magazine quality`,
      `Close-up macro shot of ${name} texture and details, dramatic lighting, premium feel`,
    ],
    reelsIdeas: [
      "Reels №1: «Распаковка за 15 секунд» — ASMR-звук, крупные планы",
      "Reels №2: «3 причины выбрать именно нас» — динамичные склейки",
      "Reels №3: «До и после» — трансформация / эффект использования",
      "Reels №4: «Один день с товаром» — сценарий из жизни ЦА",
      "Reels №5: «Чем мы отличаемся от конкурентов» — честное сравнение",
    ],
  };
}