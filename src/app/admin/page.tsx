import { BookOpen, Eye, FilePlus2 } from "lucide-react";
import { AdminLessonList } from "@/components/admin/admin-lesson-list";
import { StatCard } from "@/components/dashboard/stat-card";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { requireAdmin } from "@/lib/auth/session";
import { getAdminLessonList } from "@/lib/services/admin";

export default async function AdminPage() {
  await requireAdmin();
  const lessons = await getAdminLessonList();
  const published = lessons.filter((lesson) => lesson.is_published).length;
  const drafts = lessons.length - published;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Lesson control room"
        actions={<ButtonLink href="/admin/lessons/new">Create lesson</ButtonLink>}
      >
        Create lessons, manage questions, and choose what students can see.
      </PageHeader>

      <div className="grid gap-5 md:grid-cols-3">
        <StatCard label="Lessons" value={lessons.length} helper="Total lessons in the library." />
        <StatCard label="Published" value={published} helper="Visible to students." />
        <StatCard label="Drafts" value={drafts} helper="Hidden while being edited." />
      </div>

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-3xl font-black text-slate-950">
            <BookOpen className="h-7 w-7 text-emerald-600" />
            Recent lessons
          </h2>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/learn" variant="outline">
              <Eye className="mr-2 h-5 w-5" />
              View student side
            </ButtonLink>
            <ButtonLink href="/admin/lessons/new" variant="secondary">
              <FilePlus2 className="mr-2 h-5 w-5" />
              New lesson
            </ButtonLink>
          </div>
        </div>
        <AdminLessonList lessons={lessons.slice(0, 6)} />
      </section>
    </div>
  );
}
