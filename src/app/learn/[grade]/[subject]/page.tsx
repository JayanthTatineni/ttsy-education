import { notFound } from "next/navigation";
import { LessonGrid } from "@/components/lessons/lesson-grid";
import { PageHeader } from "@/components/ui/page-header";
import { requireLearner } from "@/lib/auth/session";
import { gradeLabel, parseGrade } from "@/lib/constants";
import { getLessonSummaries, getSubjectBySlug } from "@/lib/services/lessons";

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ grade: string; subject: string }>;
}) {
  const profile = await requireLearner();
  const { grade: gradeParam, subject: subjectSlug } = await params;
  const grade = parseGrade(gradeParam);

  if (!grade) {
    notFound();
  }

  const subject = await getSubjectBySlug(subjectSlug);
  if (!subject) {
    notFound();
  }

  const lessons = await getLessonSummaries({
    grade,
    subjectSlug,
    studentId: profile.role === "student" ? profile.id : undefined,
  });

  return (
    <div className="space-y-8">
      <PageHeader eyebrow={gradeLabel(grade)} title={`${subject.name} lessons`}>
        Watch, practice, and save your best score for each lesson.
      </PageHeader>
      <LessonGrid lessons={lessons} />
    </div>
  );
}
