import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "green" | "blue" | "yellow" | "red" | "slate";

const tones: Record<BadgeTone, string> = {
  green: "bg-emerald-100 text-emerald-800",
  blue: "bg-sky-100 text-sky-800",
  yellow: "bg-yellow-100 text-yellow-900",
  red: "bg-rose-100 text-rose-800",
  slate: "bg-slate-100 text-slate-700",
};

export function Badge({
  className,
  tone = "slate",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-1 text-sm font-bold",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
