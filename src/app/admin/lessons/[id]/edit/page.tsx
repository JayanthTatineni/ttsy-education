import { notFound } from "next/navigation";
import { LessonForm } from "@/components/admin/lesson-form";
import { QuestionManager } from "@/components/admin/question-manager";
import { PageHeader } from "@/components/ui/page-header";
import { requireAdmin } from "@/lib/auth/session";
import { getAdminLessonById } from "@/lib/services/admin";

export default async function EditLessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const data = await getAdminLessonById(id);

  if (!data) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Edit lesson" title={data.lesson.title}>
        Update lesson details, then manage the quiz questions students answer.
      </PageHeader>
      <LessonForm lesson={data.lesson} subjects={data.subjects} units={data.units} />
      <QuestionManager lessonId={data.lesson.id} questions={data.questions} />
    </div>
  );
}
