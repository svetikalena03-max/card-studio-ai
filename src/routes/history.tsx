import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteCard, getHistory } from "@/lib/ai/storage";
import type { CardResult } from "@/lib/ai/types";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [{ title: "История проектов — AI Marketplace Card Studio" }],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const [items, setItems] = useState<CardResult[]>([]);

  useEffect(() => {
    setItems(getHistory());
  }, []);

  const remove = (id: string) => {
    deleteCard(id);
    setItems(getHistory());
    toast.success("Карточка удалена");
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">История проектов</h1>
          <p className="mt-2 text-muted-foreground">
            Все ваши сгенерированные карточки.
          </p>
        </div>
        <Button asChild>
          <Link to="/generate">
            <Plus className="mr-2 h-4 w-4" />
            Новая карточка
          </Link>
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-16 text-center">
          <h2 className="text-lg font-medium">Пока ничего нет</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Создайте первую карточку, чтобы она появилась здесь.
          </p>
          <Button asChild className="mt-6">
            <Link to="/generate">Создать первую карточку</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((card) => (
            <div
              key={card.id}
              className="group relative rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-sm"
            >
              <Link
                to="/result/$id"
                params={{ id: card.id }}
                className="absolute inset-0 rounded-2xl"
                aria-label={card.input.productName}
              />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary" className="font-normal">
                  {card.input.marketplace}
                </Badge>
                <Badge variant="outline" className="font-normal">
                  {card.input.style}
                </Badge>
              </div>
              <h3 className="mt-3 line-clamp-2 font-medium text-foreground">
                {card.input.productName || "Без названия"}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {new Date(card.createdAt).toLocaleString("ru-RU")}
              </p>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  remove(card.id);
                }}
                className="absolute right-3 top-3 z-10 rounded-md p-2 text-muted-foreground opacity-0 transition hover:bg-secondary hover:text-destructive group-hover:opacity-100"
                aria-label="Удалить"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}