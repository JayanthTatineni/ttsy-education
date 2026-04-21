import { notFound } from "next/navigation";
import { CourseRoadmap } from "@/components/lessons/course-roadmap";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { requireLearner } from "@/lib/auth/session";
import { gradeLabel, parseGrade } from "@/lib/constants";
import { getCourseBySlug, getLessonSequenceForUnit } from "@/lib/services/lessons";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ grade: string; courseSlug: string }>;
}) {
  const profile = await requireLearner();
  const { grade: gradeParam, courseSlug } = await params;
  const grade = parseGrade(gradeParam);

  if (!grade) {
    notFound();
  }

  const course = await getCourseBySlug(
    grade,
    courseSlug,
    profile.role === "student" ? profile.id : undefined,
  );

  if (!course) {
    notFound();
  }

  const sequence = await getLessonSequenceForUnit(
    course.unit.id,
    profile.role === "student" ? profile.id : undefined,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>{gradeLabel(grade)}</Badge>
        <Badge tone={course.subject.slug === "math" ? "blue" : "green"}>
          {course.subject.name}
        </Badge>
        <Badge tone="slate">{course.lessonCount} lessons</Badge>
      </div>

      {sequence.length > 0 ? (
        <CourseRoadmap course={course} sequence={sequence} profile={profile} />
      ) : (
        <EmptyState
          title="This course is still being built"
          message="Add lessons to the unit and they will appear here in order."
        />
      )}
    </div>
  );
}
