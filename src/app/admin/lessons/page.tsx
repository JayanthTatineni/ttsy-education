import { AdminLessonList } from "@/components/admin/admin-lesson-list";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { requireAdmin } from "@/lib/auth/session";
import { getAdminLessonList } from "@/lib/services/admin";

export default async function AdminLessonsPage() {
  await requireAdmin();
  const lessons = await getAdminLessonList();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin lessons"
        title="Manage lesson library"
        actions={<ButtonLink href="/admin/lessons/new">Create lesson</ButtonLink>}
      >
        Edit lesson details, publish drafts, and open question management.
      </PageHeader>
      {lessons.length > 0 ? (
        <AdminLessonList lessons={lessons} />
      ) : (
        <EmptyState
          title="No lessons yet"
          message="Create the first lesson, then add quiz questions from the edit screen."
          actionHref="/admin/lessons/new"
          actionLabel="Create lesson"
        />
      )}
    </div>
  );
}
