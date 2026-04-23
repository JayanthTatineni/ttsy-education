import { notFound } from "next/navigation";
import { AssignStudentForm } from "@/components/dashboard/assign-student-form";
import { ClassGrowthTable } from "@/components/dashboard/class-growth-table";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { gradeLabel } from "@/lib/constants";
import { requireLearner } from "@/lib/auth/session";
import { getEducatorClassDetail, getStudentClasses } from "@/lib/services/classroom";

export default async function ClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const profile = await requireLearner();
  const { id } = await params;

  if (profile.role === "educator") {
    const classroom = await getEducatorClassDetail(id, profile.id);

    if (!classroom) {
      notFound();
    }

    return (
      <div className="space-y-8">
        <PageHeader eyebrow="Class growth" title={classroom.name}>
          {classroom.description || "Track how your students move through the course path."}
        </PageHeader>

        <div className="flex flex-wrap gap-2">
          {classroom.grade_level ? <Badge>{gradeLabel(classroom.grade_level)}</Badge> : null}
          {classroom.subject_focus ? (
            <Badge tone={classroom.subject_focus === "math" ? "blue" : "green"}>
              {classroom.subject_focus}
            </Badge>
          ) : (
            <Badge tone="slate">all subjects</Badge>
          )}
          <Badge tone="yellow">Join code {classroom.join_code}</Badge>
        </div>

        <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <AssignStudentForm classId={classroom.id} />
          <Card>
            <p className="text-sm font-black uppercase tracking-wide text-slate-500">
              Teacher view
            </p>
            <div className="mt-3 space-y-2 text-sm font-bold text-slate-700">
              <p>Completed lessons per student</p>
              <p>Lessons attempted</p>
              <p>Average best score</p>
              <p>Latest activity date</p>
            </div>
          </Card>
        </section>

        {classroom.students.length > 0 ? (
          <ClassGrowthTable classroom={classroom} />
        ) : (
          <EmptyState
            title="No students in this class yet"
            message={`Share code ${classroom.join_code} so students can join.`}
          />
        )}
      </div>
    );
  }

  const classes = await getStudentClasses(profile.id);
  const classroom = classes.find((item) => item.id === id);

  if (!classroom) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Teacher space" title={classroom.name}>
        {classroom.description || "This is one of the classes connected to your account."}
      </PageHeader>

      <div className="flex flex-wrap gap-2">
        {classroom.grade_level ? <Badge>{gradeLabel(classroom.grade_level)}</Badge> : null}
        {classroom.subject_focus ? (
          <Badge tone={classroom.subject_focus === "math" ? "blue" : "green"}>
            {classroom.subject_focus}
          </Badge>
        ) : (
          <Badge tone="slate">all subjects</Badge>
        )}
      </div>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-black uppercase tracking-wide text-slate-500">
            Teacher
          </p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">
            {classroom.educator.full_name}
          </h2>
          <p className="mt-2 text-base leading-7 text-slate-600">
            Reach out to your teacher for class expectations, pacing, or a new join code.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-black uppercase tracking-wide text-slate-500">
            Quick info
          </p>
          <div className="mt-3 space-y-2 text-base font-bold text-slate-700">
            <p>{classroom.memberCount} students in this class</p>
            <p>Join code {classroom.join_code}</p>
          </div>
          <ButtonLink href="/dashboard" className="mt-5">
            Back to my courses
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
