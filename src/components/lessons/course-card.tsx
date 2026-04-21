import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { gradeLabel } from "@/lib/constants";
import type { CourseSummary, GradeLevel } from "@/types/domain";

export function CourseCard({
  course,
  grade,
}: {
  course: CourseSummary;
  grade: GradeLevel;
}) {
  const progressValue =
    course.lessonCount > 0 ? (course.completedCount / course.lessonCount) * 100 : 0;

  return (
    <Link href={`/learn/${grade.toLowerCase()}/courses/${course.slug}`}>
      <Card className="h-full transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md">
        <div className="flex flex-wrap gap-2">
          <Badge tone={course.subject.slug === "math" ? "blue" : "green"}>
            {course.subject.name}
          </Badge>
          <Badge>{gradeLabel(grade)}</Badge>
        </div>
        <h2 className="mt-4 text-3xl font-black text-slate-950">{course.unit.title}</h2>
        <p className="mt-3 text-base leading-7 text-slate-600">{course.unit.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {course.topicLabels.slice(0, 3).map((topic) => (
            <Badge key={topic} tone="slate">
              {topic}
            </Badge>
          ))}
        </div>
        <div className="mt-5 text-sm font-bold text-slate-500">
          {course.lessonCount} lessons · {course.completedCount} complete
        </div>
        <ProgressBar value={progressValue} label="Course progress" className="mt-4" />
      </Card>
    </Link>
  );
}
