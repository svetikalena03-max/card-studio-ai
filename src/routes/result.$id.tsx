import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Copy,
  Download,
  Plus,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { getCard, formatCardAsText } from "@/lib/ai/storage";
import type { CardResult } from "@/lib/ai/types";

export const Route = createFileRoute("/result/$id")({
  head: () => ({
    meta: [{ title: "Результат — AI Marketplace Card Studio" }],
  }),
  component: ResultPage,
});

function ResultPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState<CardResult | null | undefined>(undefined);

  useEffect(() => {
    setCard(getCard(id) ?? null);
  }, [id]);

  if (card === undefined) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16 text-muted-foreground">
        Загрузка...
      </div>
    );
  }

  if (card === null) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold">Карточка не найдена</h1>
        <p className="mt-2 text-muted-foreground">
          Возможно, она была удалена или ссылка устарела.
        </p>
        <Button asChild className="mt-6">
          <Link to="/generate">Создать новую</Link>
        </Button>
      </div>
    );
  }

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} скопировано`);
  };

  const download = () => {
    const blob = new Blob([formatCardAsText(card)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${card.input.productName || "card"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <Link
        to="/history"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        К истории
      </Link>

      <div className="mt-4 rounded-2xl border border-border bg-card p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary">{card.input.marketplace}</Badge>
              <Badge variant="outline">{card.input.style}</Badge>
              <span>{new Date(card.createdAt).toLocaleString("ru-RU")}</span>
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              {card.input.productName}
            </h1>
            {card.input.audience && (
              <p className="mt-2 text-muted-foreground">
                Аудитория: {card.input.audience}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => copy(formatCardAsText(card), "Всё")}
            >
              <Copy className="mr-2 h-4 w-4" />
              Скопировать всё
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                copy(
                  [
                    card.seoTitle,
                    "",
                    card.seoKeywords.join(", "),
                  ].join("\n"),
                  "SEO",
                )
              }
            >
              <Copy className="mr-2 h-4 w-4" />
              SEO
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                copy(card.infographicIdeas.join("\n"), "Тексты для инфографики")
              }
            >
              <Copy className="mr-2 h-4 w-4" />
              Инфографика
            </Button>
            <Button variant="outline" size="sm" onClick={download}>
              <Download className="mr-2 h-4 w-4" />
              Скачать
            </Button>
            <Button size="sm" onClick={() => navigate({ to: "/generate" })}>
              <Plus className="mr-2 h-4 w-4" />
              Новая карточка
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="analysis" className="mt-8">
        <TabsList className="bg-secondary/60">
          <TabsTrigger value="analysis">Анализ</TabsTrigger>
          <TabsTrigger value="texts">Тексты</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="infographic">Инфографика</TabsTrigger>
          <TabsTrigger value="photo">Фото</TabsTrigger>
          <TabsTrigger value="reels">Reels</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-4 pt-6">
          <Section title="Анализ конкурентов">
            <p className="text-foreground/90 leading-relaxed whitespace-pre-line">
              {card.competitorAnalysis}
            </p>
          </Section>
          <Section title="Слабые места конкурентов">
            <BulletList items={card.competitorWeaknesses} />
          </Section>
          <Section title="Стратегия отстройки">
            <p className="text-foreground/90 leading-relaxed whitespace-pre-line">
              {card.positioningStrategy}
            </p>
          </Section>
        </TabsContent>

        <TabsContent value="texts" className="space-y-4 pt-6">
          <Section title="SEO-название" copyable={card.seoTitle}>
            <p className="font-medium">{card.seoTitle}</p>
          </Section>
          <Section title="Короткое описание" copyable={card.shortDescription}>
            <p className="text-foreground/90">{card.shortDescription}</p>
          </Section>
          <Section title="Полное описание" copyable={card.fullDescription}>
            <p className="whitespace-pre-line text-foreground/90 leading-relaxed">
              {card.fullDescription}
            </p>
          </Section>
          <Section title="Преимущества">
            <BulletList items={card.advantages} />
          </Section>
          <Section title="Для кого товар">
            <p className="text-foreground/90">{card.targetAudience}</p>
          </Section>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4 pt-6">
          <Section title="SEO-ключи" copyable={card.seoKeywords.join(", ")}>
            <div className="flex flex-wrap gap-2">
              {card.seoKeywords.map((k) => (
                <Badge key={k} variant="secondary" className="font-normal">
                  {k}
                </Badge>
              ))}
            </div>
          </Section>
          <Section title="Антишаблон">
            <p className="text-foreground/90 leading-relaxed">{card.antiTemplate}</p>
          </Section>
        </TabsContent>

        <TabsContent value="infographic" className="space-y-4 pt-6">
          <Section
            title="Идеи инфографики"
            copyable={card.infographicIdeas.join("\n")}
          >
            <BulletList items={card.infographicIdeas} />
          </Section>
        </TabsContent>

        <TabsContent value="photo" className="space-y-4 pt-6">
          <Section title="Идеи lifestyle-фото">
            <BulletList items={card.lifestylePhotoIdeas} />
          </Section>
          <Section
            title="Промты для AI-фото"
            copyable={card.aiPhotoPrompts.join("\n\n")}
          >
            <div className="space-y-3">
              {card.aiPhotoPrompts.map((p, i) => (
                <div
                  key={i}
                  className="rounded-lg bg-secondary/60 p-4 text-sm font-mono leading-relaxed text-foreground/90"
                >
                  {p}
                </div>
              ))}
            </div>
          </Section>
        </TabsContent>

        <TabsContent value="reels" className="space-y-4 pt-6">
          <Section title="Идеи Reels" copyable={card.reelsIdeas.join("\n")}>
            <BulletList items={card.reelsIdeas} />
          </Section>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Section({
  title,
  children,
  copyable,
}: {
  title: string;
  children: React.ReactNode;
  copyable?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" />
          {title}
        </h2>
        {copyable && (
          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-2 text-muted-foreground"
            onClick={() => {
              navigator.clipboard.writeText(copyable);
              toast.success(`${title} скопировано`);
            }}
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
      {children}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-foreground/90">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}