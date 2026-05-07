import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateProductCard } from "@/lib/ai/openai-service";
import { saveCard } from "@/lib/ai/storage";
import type { CardInput, CardStyle, Marketplace } from "@/lib/ai/types";
import { AILoader } from "@/components/ai-loader";

export const Route = createFileRoute("/generate")({
  head: () => ({
    meta: [
      { title: "Создать карточку — AI Marketplace Card Studio" },
      {
        name: "description",
        content: "Заполните форму, чтобы AI сгенерировал карточку товара для маркетплейса.",
      },
    ],
  }),
  component: GeneratePage,
});

const MARKETPLACES: Marketplace[] = [
  "Wildberries",
  "Ozon",
  "Яндекс Маркет",
  "Lamoda",
  "Другое",
];

const STYLES: CardStyle[] = [
  "premium",
  "minimalism",
  "mass market",
  "kids",
  "tech",
  "wellness",
  "home aesthetic",
];

function GeneratePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<CardInput>({
    productName: "",
    marketplace: "Wildberries",
    audience: "",
    features: "",
    differentiators: "",
    competitorLinks: "",
    style: "premium",
    notes: "",
  });

  const update = <K extends keyof CardInput>(key: K, value: CardInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.productName.trim()) {
      toast.error("Укажите название товара");
      return;
    }
    setLoading(true);
    try {
      const result = await generateProductCard(form);
      saveCard(result);
      toast.success("Карточка готова");
      navigate({ to: "/result/$id", params: { id: result.id } });
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Не удалось сгенерировать карточку");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <AILoader open={loading} />
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">Создать карточку товара</h1>
        <p className="mt-2 text-muted-foreground">
          Расскажите о товаре — AI подготовит контент, SEO и идеи визуала.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-border bg-card p-8 space-y-6"
      >
        <div className="space-y-2">
          <Label htmlFor="productName">Название товара</Label>
          <Input
            id="productName"
            placeholder="Например, увлажнитель воздуха"
            value={form.productName}
            onChange={(e) => update("productName", e.target.value)}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Маркетплейс</Label>
            <Select
              value={form.marketplace}
              onValueChange={(v) => update("marketplace", v as Marketplace)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MARKETPLACES.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Желаемый стиль</Label>
            <Select
              value={form.style}
              onValueChange={(v) => update("style", v as CardStyle)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STYLES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="audience">Целевая аудитория</Label>
          <Input
            id="audience"
            placeholder="Например, молодые мамы 25–35 лет"
            value={form.audience}
            onChange={(e) => update("audience", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="features">Характеристики товара</Label>
          <Textarea
            id="features"
            rows={4}
            placeholder="Материал, размер, цвет, особенности..."
            value={form.features}
            onChange={(e) => update("features", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="differentiators">Отличия от конкурентов</Label>
          <Textarea
            id="differentiators"
            rows={3}
            placeholder="Чем ваш товар лучше / уникальнее"
            value={form.differentiators}
            onChange={(e) => update("differentiators", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="competitorLinks">Ссылки на конкурентов</Label>
          <Textarea
            id="competitorLinks"
            rows={3}
            placeholder="Каждая ссылка с новой строки"
            value={form.competitorLinks}
            onChange={(e) => update("competitorLinks", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Дополнительные пожелания</Label>
          <Textarea
            id="notes"
            rows={3}
            placeholder="Тон голоса, акценты, ограничения"
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" size="lg" disabled={loading} className="h-12 px-6">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Генерируем...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Сгенерировать карточку
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}