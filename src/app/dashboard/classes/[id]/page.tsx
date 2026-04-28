import { notFound } from "next/navigation";
import { AssignLessonForm } from "@/components/dashboard/assign-lesson-form";
import { AssignStudentForm } from "@/components/dashboard/assign-student-form";
import { ClassAssignmentSummary } from "@/components/dashboard/class-assignment-summary";
import { ClassGrowthTable } from "@/components/dashboard/class-growth-table";
import { StudentClassAssignments } from "@/components/dashboard/student-class-assignments";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { gradeLabel } from "@/lib/constants";
import { requireLearner } from "@/lib/auth/session";
import {
  getEducatorClassDetail,
  getStudentClassDetail,
} from "@/lib/services/classroom";

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

        <section className="grid gap-5 xl:grid-cols-[1fr_1fr_0.8fr]">
          <AssignLessonForm
            classId={classroom.id}
            lessons={classroom.availableLessons.filter(
              (lesson) => !classroom.assignments.some((assignment) => assignment.lesson_id === lesson.id),
            )}
          />
          <AssignStudentForm classId={classroom.id} />
          <Card>
            <p className="text-sm font-black uppercase tracking-wide text-slate-500">
              Teacher view
            </p>
            <div className="mt-3 space-y-2 text-sm font-bold text-slate-700">
              <p>Assign published lessons to the whole class</p>
              <p>See assignment completion and scores</p>
              <p>Track overall growth and latest activity</p>
            </div>
          </Card>
        </section>

        <section className="space-y-4">
          <PageHeader eyebrow="Assignments" title="Assigned lessons">
            See how the class is doing on the work you assigned.
          </PageHeader>
          <ClassAssignmentSummary assignments={classroom.assignments} />
        </section>

        <section className="space-y-4">
          <PageHeader eyebrow="Performance" title="Student growth">
            Overall lesson progress stays here, with assignment signals tucked under each learner.
          </PageHeader>
          <ClassGrowthTable classroom={classroom} />
        </section>
      </div>
    );
  }

  const classroom = await getStudentClassDetail(id, profile.id);

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
            <p>{classroom.assignments.length} active assignments</p>
            <p>Join code {classroom.join_code}</p>
          </div>
          <ButtonLink href="/dashboard" className="mt-5">
            Back to my courses
          </ButtonLink>
        </div>
      </section>

      <section className="space-y-4">
        <PageHeader eyebrow="Assignments" title="Classwork from your teacher">
          Open each lesson here and your progress will count toward this class.
        </PageHeader>
        <StudentClassAssignments assignments={classroom.assignments} />
      </section>
    </div>
  );
}
