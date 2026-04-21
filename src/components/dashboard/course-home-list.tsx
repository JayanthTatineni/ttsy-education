import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import type { CourseSummary } from "@/types/domain";

function actionLabel(course: CourseSummary) {
  if (course.lessonCount > 0 && course.completedCount === course.lessonCount) {
    return "Review";
  }

  if (course.completedCount > 0) {
    return "Resume";
  }

  return "Start";
}

export function CourseHomeList({
  title,
  description,
  courses,
  emptyMessage,
}: {
  title: string;
  description: string;
  courses: CourseSummary[];
  emptyMessage: string;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-950">{title}</h2>
          <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">{description}</p>
        </div>
        <ButtonLink href="/dashboard/courses" variant="secondary">
          Edit courses
        </ButtonLink>
      </div>

      {courses.length > 0 ? (
        <div className="mt-6 grid gap-3">
          {courses.map((course) => (
            <div
              key={course.slug}
              className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 lg:flex-row lg:items-center lg:justify-between"
            >
              <Link
                href={`/learn/${course.unit.grade_level.toLowerCase()}/courses/${course.slug}`}
                className="min-w-0 flex-1"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
                    <BookOpen className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-2">
                      <Badge tone={course.subject.slug === "math" ? "blue" : "green"}>
                        {course.subject.name}
                      </Badge>
                      <Badge tone="slate">{course.unit.grade_level === "K" ? "Kindergarten" : `Grade ${course.unit.grade_level}`}</Badge>
                    </div>
                    <h3 className="mt-2 text-xl font-black text-slate-950">{course.unit.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {course.lessonCount} lessons · {course.completedCount} complete
                    </p>
                  </div>
                </div>
              </Link>
              <div className="flex shrink-0 items-center gap-3">
                <ButtonLink
                  href={`/learn/${course.unit.grade_level.toLowerCase()}/courses/${course.slug}`}
                  variant="secondary"
                >
                  {actionLabel(course)}
                </ButtonLink>
                <Link
                  href={`/learn/${course.unit.grade_level.toLowerCase()}/courses/${course.slug}`}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100"
                >
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-5 text-base leading-7 text-slate-600">{emptyMessage}</p>
      )}
    </section>
  );
}
