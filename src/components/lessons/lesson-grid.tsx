import { EmptyState } from "@/components/ui/empty-state";
import { LessonCard } from "@/components/lessons/lesson-card";
import type { LessonSummary } from "@/types/domain";

export function LessonGrid({ lessons }: { lessons: LessonSummary[] }) {
  if (lessons.length === 0) {
    return (
      <EmptyState
        title="No lessons here yet"
        message="Try a different grade or subject while new lessons are being prepared."
        actionHref="/learn"
        actionLabel="Choose another path"
      />
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {lessons.map((lesson) => (
        <LessonCard key={lesson.id} lesson={lesson} />
      ))}
    </div>
  );
}
