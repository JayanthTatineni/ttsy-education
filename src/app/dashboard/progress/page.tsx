import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { ProgressBar } from "@/components/ui/progress-bar";
import { requireStudent } from "@/lib/auth/session";
import { gradeLabel } from "@/lib/constants";
import { getStudentProgress } from "@/lib/services/lessons";

export default async function ProgressPage() {
  const profile = await requireStudent();
  const rows = await getStudentProgress(profile.id);

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Saved progress" title="Your STEM growth">
        Review your best scores, completion badges, and lesson attempts.
      </PageHeader>

      {rows.length === 0 ? (
        <EmptyState
          title="No saved progress yet"
          message="Finish a lesson quiz and your score will be saved here."
          actionHref="/learn"
          actionLabel="Start a lesson"
        />
      ) : (
        <div className="space-y-4">
          {rows.map(({ progress, lesson }) => (
            <div
              key={progress.id}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <Badge tone={progress.completed ? "green" : "yellow"}>
                      {progress.completed ? "Complete" : "Practice"}
                    </Badge>
                    <Badge tone="blue">{lesson.subject.name}</Badge>
                    <Badge>{gradeLabel(lesson.grade_level)}</Badge>
                  </div>
                  <h2 className="mt-3 text-2xl font-black text-slate-950">
                    {lesson.title}
                  </h2>
                  <p className="mt-1 text-sm font-bold text-slate-500">
                    Last score {progress.last_score}% · {progress.times_attempted} tries
                  </p>
                </div>
                <div className="w-full md:max-w-xs">
                  <ProgressBar value={progress.best_score} label="Best score" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
