import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { gradeLabel } from "@/lib/constants";
import type { LessonSummary } from "@/types/domain";

export function LessonCard({ lesson }: { lesson: LessonSummary }) {
  const href = `/learn/${lesson.grade_level.toLowerCase()}/${lesson.subject.slug}/${lesson.slug}`;
  const score = lesson.progress?.best_score ?? 0;
  const isComplete = Boolean(lesson.progress?.completed);

  return (
    <Link
      href={href}
      className="block rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
    >
      {lesson.thumbnail_url ? (
        <img
          src={lesson.thumbnail_url}
          alt=""
          className="mb-4 h-36 w-full rounded-lg object-cover"
        />
      ) : null}
      <div className="flex flex-wrap gap-2">
        <Badge tone={lesson.subject.slug === "math" ? "blue" : "green"}>
          {lesson.subject.name}
        </Badge>
        <Badge tone={isComplete ? "green" : "yellow"}>
          {isComplete ? "Completed" : `${lesson.estimated_minutes} min`}
        </Badge>
      </div>
      <h3 className="mt-4 text-2xl font-black tracking-tight text-slate-950">
        {lesson.title}
      </h3>
      <p className="mt-2 text-sm font-bold text-slate-500">
        {gradeLabel(lesson.grade_level)} · {lesson.unit.title}
      </p>
      <p className="mt-3 line-clamp-3 text-base leading-7 text-slate-600">
        {lesson.description}
      </p>
      <ProgressBar value={score} label="Best score" className="mt-5" />
    </Link>
  );
}
