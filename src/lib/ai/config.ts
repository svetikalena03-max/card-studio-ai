/**
 * AI configuration. Single source of truth for the model, endpoint and
 * tool name used to generate marketplace product cards.
 *
 * The Lovable AI Gateway exposes an OpenAI-compatible Chat Completions API,
 * so swapping for OpenAI later only requires changing `endpoint` and the
 * `Authorization` header in the server route.
 */
export const AI_CONFIG = {
  endpoint: "https://ai.gateway.lovable.dev/v1/chat/completions",
  model: "google/gemini-3-flash-preview",
  temperature: 0.8,
  toolName: "return_marketplace_card",
} as const;