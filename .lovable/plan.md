# Подключение AI генерации (Lovable AI Gateway)

Используем **Lovable AI Gateway** (совместим с OpenAI API) — `LOVABLE_API_KEY` уже доступен в серверном рантайме после включения Lovable Cloud. Это безопаснее, чем класть OpenAI ключ на клиент, и не требует от пользователя настраивать ключи. Если позже захочется именно OpenAI — точку входа меняем в одном месте.

## Что будет сделано

### 1. Конфиг и system prompt (отдельные файлы)

- `src/lib/ai/config.ts` — модель (`google/gemini-3-flash-preview` по умолчанию), endpoint, температура, имя tool-функции.
- `src/lib/ai/system-prompt.ts` — большой system prompt «AI creative studio assistant для маркетплейсов» (Wildberries / Ozon / Я.Маркет / Lamoda): задачи, тон, ограничения, антишаблоны, требования к структуре ответа.
- `src/lib/ai/schema.ts` — JSON Schema для tool calling, точно соответствующая `CardResult` (анализ конкурентов, слабости, позиционирование, SEO title, краткое/полное описание, преимущества, ЦА, ключевики, антишаблон, идеи инфографики, lifestyle-фото, AI-фото prompts, Reels).

### 2. Серверная функция (TanStack server route)

- `src/routes/api/generate-card.ts` — POST endpoint:
  - валидирует body через zod (поля `CardInput`),
  - читает `process.env.LOVABLE_API_KEY` (никогда не отдаётся клиенту),
  - вызывает `https://ai.gateway.lovable.dev/v1/chat/completions` с system prompt + user prompt + `tools` + `tool_choice` для строго структурированного JSON,
  - парсит `tool_calls[0].function.arguments`, мерджит с `id`, `createdAt`, `input` → возвращает готовый `CardResult`,
  - корректно обрабатывает `429` (rate limit) и `402` (нет кредитов) с понятными сообщениями.

### 3. Замена мока

- `src/lib/ai/openai-service.ts` — `generateProductCard(input)` теперь делает `fetch('/api/generate-card', { method: 'POST', body: JSON.stringify(input) })`, кидает осмысленные ошибки, типизированно возвращает `CardResult`. Мок-реализация удаляется.
- `src/routes/generate.tsx` — без изменений логики, но `toast.error` показывает текст ошибки от сервера (rate limit / payment required / общая ошибка).

### 4. Подготовка инфраструктуры

- Включить **Lovable Cloud**, чтобы `LOVABLE_API_KEY` был доступен серверной функции (ничего настраивать пользователю не нужно — ключ выдаётся автоматически).
- Никаких ключей в коде, никаких ключей на клиенте.

## Технические детали

- Модель: `google/gemini-3-flash-preview` (быстрая, дешёвая, хорошее качество для генерации карточек). Меняется одной строкой в `config.ts`.
- Структурированный вывод — через **tool calling** (надёжнее, чем просить «верни JSON»).
- Streaming не нужен (форма ждёт полный результат, потом редирект на `/result/$id`).
- localStorage история и UI результата уже работают — менять не нужно.

## Почему не прямой OpenAI

Прямое подключение OpenAI потребовало бы у пользователя свой `OPENAI_API_KEY` и edge-функцию вокруг него. Lovable AI Gateway даёт OpenAI-совместимый API (`/v1/chat/completions`, tool calling, те же поля) без настройки ключей и с возможностью переключать модели (включая `openai/gpt-5-mini` и др.) через один параметр. Если потребуется именно OpenAI — меняем `endpoint` + `Authorization` в `config.ts`/server route, остальной код остаётся.
