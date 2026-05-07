import { useEffect, useState } from "react";
import { Check, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  "Анализируем конкурентов",
  "Ищем слабые места рынка",
  "Формируем SEO-стратегию",
  "Создаём позиционирование",
  "Генерируем инфографику",
  "Создаём lifestyle-концепцию",
  "Формируем идеи Reels",
];

const STEP_INTERVAL = 2200;

export function AILoader({ open }: { open: boolean }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!open) {
      setActive(0);
      return;
    }
    const id = setInterval(() => {
      setActive((i) => (i < STEPS.length - 1 ? i + 1 : i));
    }, STEP_INTERVAL);
    return () => clearInterval(id);
  }, [open]);

  if (!open) return null;

  const progress = Math.min(100, ((active + 1) / STEPS.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6 animate-fade-in">
      <div className="absolute inset-0 bg-background/70 backdrop-blur-xl" />

      <div
        className={cn(
          "relative w-full max-w-md rounded-3xl border border-white/40 dark:border-white/10",
          "bg-white/70 dark:bg-white/5 backdrop-blur-2xl",
          "shadow-[0_20px_80px_-20px_rgba(0,0,0,0.25)] p-8 animate-scale-in",
        )}
      >
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-5">
            <div className="absolute inset-0 rounded-full bg-foreground/10 blur-2xl animate-pulse" />
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground text-background shadow-lg">
              <Sparkles className="h-6 w-6 animate-pulse" />
            </div>
          </div>
          <h2 className="text-lg font-semibold tracking-tight">
            AI создаёт вашу карточку
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Это займёт около 15–25 секунд
          </p>

          <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-foreground/10">
            <div
              className="h-full rounded-full bg-foreground transition-[width] duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <ul className="mt-8 space-y-3">
          {STEPS.map((label, i) => {
            const state =
              i < active ? "done" : i === active ? "active" : "pending";
            return (
              <li
                key={label}
                className={cn(
                  "flex items-center gap-3 text-sm transition-all duration-500",
                  state === "pending" && "opacity-40",
                  state === "active" && "opacity-100",
                  state === "done" && "opacity-70",
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors",
                    state === "done" && "bg-foreground text-background",
                    state === "active" && "bg-foreground/10 text-foreground",
                    state === "pending" && "bg-foreground/5 text-foreground/40",
                  )}
                >
                  {state === "done" ? (
                    <Check className="h-3 w-3" />
                  ) : state === "active" ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  )}
                </span>
                <span
                  className={cn(
                    state === "active" && "font-medium text-foreground",
                  )}
                >
                  {label}
                  {state === "active" && (
                    <span className="inline-flex ml-1">
                      <span className="animate-pulse">.</span>
                      <span className="animate-pulse [animation-delay:150ms]">.</span>
                      <span className="animate-pulse [animation-delay:300ms]">.</span>
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}