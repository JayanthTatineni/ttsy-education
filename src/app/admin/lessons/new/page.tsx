import { LessonForm } from "@/components/admin/lesson-form";
import { PageHeader } from "@/components/ui/page-header";
import { requireAdmin } from "@/lib/auth/session";
import { getAdminCatalogOptions } from "@/lib/services/admin";

export default async function NewLessonPage() {
  await requireAdmin();
  const { subjects, units } = await getAdminCatalogOptions();

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="New lesson" title="Create a lesson">
        Add the lesson details first. After saving, add quiz questions on the edit page.
      </PageHeader>
      <LessonForm subjects={subjects} units={units} />
    </div>
  );
}
