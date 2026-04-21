import Link from "next/link";
import { ChevronRight, School2 } from "lucide-react";
import type { JoinedClass } from "@/types/domain";

export function CompactClassList({
  classes,
}: {
  classes: JoinedClass[];
}) {
  if (classes.length === 0) {
    return (
      <p className="text-sm leading-6 text-slate-600">
        No classes yet. Join one from the Teachers page when your teacher shares a code.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {classes.map((classroom) => (
        <Link
          key={classroom.id}
          href={`/dashboard/classes/${classroom.id}`}
          className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-emerald-300 hover:bg-emerald-50"
        >
          <span className="inline-flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
              <School2 className="h-5 w-5" />
            </span>
            <span className="font-black text-slate-950">{classroom.name}</span>
          </span>
          <ChevronRight className="h-5 w-5 text-slate-400" />
        </Link>
      ))}
    </div>
  );
}
