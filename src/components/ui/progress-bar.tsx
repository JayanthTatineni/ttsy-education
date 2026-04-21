import { cn, formatPercent } from "@/lib/utils";

export function ProgressBar({
  value,
  label,
  className,
}: {
  value: number;
  label?: string;
  className?: string;
}) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm font-bold text-slate-700">
        <span>{label ?? "Progress"}</span>
        <span>{formatPercent(safeValue)}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-md bg-slate-200">
        <div
          className={cn(
            "h-full rounded-md transition-all",
            safeValue >= 80 ? "bg-emerald-500" : "bg-sky-500",
          )}
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}
