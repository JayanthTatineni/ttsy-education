import { notFound } from "next/navigation";
import { CourseCard } from "@/components/lessons/course-card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { requireLearner } from "@/lib/auth/session";
import { gradeLabel, parseGrade } from "@/lib/constants";
import { getCourseSummariesForGrade } from "@/lib/services/lessons";

export default async function GradePage({
  params,
}: {
  params: Promise<{ grade: string }>;
}) {
  const profile = await requireLearner();
  const { grade: gradeParam } = await params;
  const grade = parseGrade(gradeParam);

  if (!grade) {
    notFound();
  }

  const courses = await getCourseSummariesForGrade(
    grade,
    profile.role === "student" ? profile.id : undefined,
  );

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Choose a course" title={gradeLabel(grade)}>
        Pick one course, move lesson by lesson, and finish each step in order.
      </PageHeader>

      {courses.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.slug} course={course} grade={grade} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No courses here yet"
          message="Try another grade while this path is still being prepared."
          actionHref="/learn"
          actionLabel="Choose another grade"
        />
      )}
    </div>
  );
}
