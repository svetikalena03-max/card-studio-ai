import type { CardResult } from "./types";

const KEY = "ai-card-studio:history";

export function getHistory(): CardResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CardResult[];
  } catch {
    return [];
  }
}

export function saveCard(card: CardResult) {
  if (typeof window === "undefined") return;
  const all = getHistory();
  const next = [card, ...all.filter((c) => c.id !== card.id)];
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function getCard(id: string): CardResult | undefined {
  return getHistory().find((c) => c.id === id);
}

export function deleteCard(id: string) {
  if (typeof window === "undefined") return;
  const next = getHistory().filter((c) => c.id !== id);
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function formatCardAsText(card: CardResult): string {
  const i = card.input;
  return [
    `# ${i.productName}`,
    `Маркетплейс: ${i.marketplace} | Стиль: ${i.style}`,
    `Дата: ${new Date(card.createdAt).toLocaleString("ru-RU")}`,
    "",
    "## Анализ конкурентов",
    card.competitorAnalysis,
    "",
    "## Слабые места конкурентов",
    ...card.competitorWeaknesses.map((x) => `— ${x}`),
    "",
    "## Стратегия отстройки",
    card.positioningStrategy,
    "",
    "## SEO-название",
    card.seoTitle,
    "",
    "## Короткое описание",
    card.shortDescription,
    "",
    "## Полное описание",
    card.fullDescription,
    "",
    "## Преимущества",
    ...card.advantages.map((x) => `— ${x}`),
    "",
    "## Для кого товар",
    card.targetAudience,
    "",
    "## SEO-ключи",
    card.seoKeywords.join(", "),
    "",
    "## Антишаблон",
    card.antiTemplate,
    "",
    "## Идеи инфографики",
    ...card.infographicIdeas.map((x) => `— ${x}`),
    "",
    "## Идеи lifestyle-фото",
    ...card.lifestylePhotoIdeas.map((x) => `— ${x}`),
    "",
    "## Промты для AI-фото",
    ...card.aiPhotoPrompts.map((x) => `— ${x}`),
    "",
    "## Идеи Reels",
    ...card.reelsIdeas.map((x) => `— ${x}`),
  ].join("\n");
}