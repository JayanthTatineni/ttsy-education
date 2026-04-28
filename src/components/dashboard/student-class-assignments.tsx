import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { gradeLabel } from "@/lib/constants";
import type { StudentClassAssignment } from "@/types/domain";

function lessonHref(grade: string, subjectSlug: string, lessonSlug: string) {
  return `/learn/${grade.toLowerCase()}/${subjectSlug}/${lessonSlug}`;
}

function assignmentStatus(assignment: StudentClassAssignment) {
  if (assignment.progress?.completed) {
    return {
      label: "Completed",
      tone: "green" as const,
      detail: `${assignment.progress.best_score}% best score`,
      cta: "Review lesson",
    };
  }

  if (assignment.progress) {
    return {
      label: "In progress",
      tone: "yellow" as const,
      detail: `${assignment.progress.last_score}% last score`,
      cta: "Keep going",
    };
  }

  return {
    label: "Not started",
    tone: "slate" as const,
    detail: "Start this lesson when you're ready.",
    cta: "Start lesson",
  };
}

export function StudentClassAssignments({
  assignments,
}: {
  assignments: StudentClassAssignment[];
}) {
  if (assignments.length === 0) {
    return (
      <EmptyState
        title="No assignments yet"
        message="Your teacher has not assigned a lesson to this class yet."
      />
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {assignments.map((assignment) => {
        const status = assignmentStatus(assignment);

        return (
          <Card key={assignment.id}>
            <div className="flex flex-wrap gap-2">
              <Badge>{gradeLabel(assignment.lesson.grade_level)}</Badge>
              <Badge tone="slate">{assignment.lesson.subject.name}</Badge>
              <Badge tone={status.tone}>{status.label}</Badge>
            </div>
            <CardTitle className="mt-3">{assignment.lesson.title}</CardTitle>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {assignment.lesson.unit.title} · {assignment.lesson.description}
            </p>
            <p className="mt-4 text-sm font-bold text-slate-700">{status.detail}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <ButtonLink
                href={lessonHref(
                  assignment.lesson.grade_level,
                  assignment.lesson.subject.slug,
                  assignment.lesson.slug,
                )}
              >
                {status.cta}
              </ButtonLink>
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Assigned {new Date(assignment.created_at).toLocaleDateString()}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
