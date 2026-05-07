export type Marketplace =
  | "Wildberries"
  | "Ozon"
  | "Яндекс Маркет"
  | "Lamoda"
  | "Другое";

export type CardStyle =
  | "premium"
  | "minimalism"
  | "mass market"
  | "kids"
  | "tech"
  | "wellness"
  | "home aesthetic";

export interface CardInput {
  productName: string;
  marketplace: Marketplace;
  audience: string;
  features: string;
  differentiators: string;
  competitorLinks: string;
  style: CardStyle;
  notes: string;
}

export interface CardResult {
  id: string;
  createdAt: string;
  input: CardInput;
  competitorAnalysis: string;
  competitorWeaknesses: string[];
  positioningStrategy: string;
  seoTitle: string;
  shortDescription: string;
  fullDescription: string;
  advantages: string[];
  targetAudience: string;
  seoKeywords: string[];
  antiTemplate: string;
  infographicIdeas: string[];
  lifestylePhotoIdeas: string[];
  aiPhotoPrompts: string[];
  reelsIdeas: string[];
}