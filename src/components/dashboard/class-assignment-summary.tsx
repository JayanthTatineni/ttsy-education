import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { gradeLabel } from "@/lib/constants";
import type { EducatorClassAssignment } from "@/types/domain";

function lessonHref(grade: string, subjectSlug: string, lessonSlug: string) {
  return `/learn/${grade.toLowerCase()}/${subjectSlug}/${lessonSlug}`;
}

export function ClassAssignmentSummary({
  assignments,
}: {
  assignments: EducatorClassAssignment[];
}) {
  if (assignments.length === 0) {
    return (
      <EmptyState
        title="No assignments yet"
        message="Assign a lesson to this class to start tracking assignment performance."
      />
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {assignments.map((assignment) => (
        <Card key={assignment.id}>
          <div className="flex flex-wrap gap-2">
            <Badge>{gradeLabel(assignment.lesson.grade_level)}</Badge>
            <Badge tone="slate">{assignment.lesson.subject.name}</Badge>
            <Badge tone="slate">{assignment.lesson.unit.title}</Badge>
          </div>
          <CardTitle className="mt-3">{assignment.lesson.title}</CardTitle>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {assignment.lesson.description}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm font-bold text-slate-700">
            <p>{assignment.performance.completedStudentCount} completed</p>
            <p>{assignment.performance.attemptedStudentCount} attempted</p>
            <p>{assignment.performance.averageBestScore}% average best</p>
            <p>{assignment.performance.assignedStudentCount} assigned students</p>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <ButtonLink
              href={lessonHref(
                assignment.lesson.grade_level,
                assignment.lesson.subject.slug,
                assignment.lesson.slug,
              )}
              variant="outline"
            >
              Preview lesson
            </ButtonLink>
            <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Assigned {new Date(assignment.created_at).toLocaleDateString()}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}
