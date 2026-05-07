import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Target, Image as ImageIcon, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Index,
});

const features = [
  {
    icon: Target,
    title: "Отстройка от конкурентов",
    desc: "Анализ слабых мест конкурентов и стратегия позиционирования вашего товара.",
  },
  {
    icon: Sparkles,
    title: "SEO для маркетплейсов",
    desc: "Готовые названия, описания и ключи под Wildberries, Ozon, Lamoda и Яндекс Маркет.",
  },
  {
    icon: ImageIcon,
    title: "Идеи инфографики и фото",
    desc: "Готовые сценарии для слайдов карточки и промты для AI-фотографий.",
  },
  {
    icon: Video,
    title: "Контент для Reels",
    desc: "Сценарии короткого видео, которое продаёт товар без бюджета на продакшен.",
  },
];

function Index() {
  return (
    <div>
      <section className="mx-auto max-w-4xl px-6 pt-24 pb-20 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" />
          AI-инструмент для продавцов маркетплейсов
        </div>
        <h1 className="text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
          AI Marketplace
          <br />
          <span className="text-muted-foreground">Card Studio</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Создавайте карточки товаров, которые отличаются от конкурентов на Wildberries,
          Ozon, Яндекс Маркете и Lamoda.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="h-12 px-6 text-base">
            <Link to="/generate">
              Создать карточку
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 px-6 text-base">
            <Link to="/history">История проектов</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-sm"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <f.icon className="h-5 w-5 text-foreground" />
              </span>
              <h3 className="mt-4 font-medium text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
