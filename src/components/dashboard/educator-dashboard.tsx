import Link from "next/link";
import { ClassCreateForm } from "@/components/dashboard/class-create-form";
import { CompactClassList } from "@/components/dashboard/compact-class-list";
import { StatCard } from "@/components/dashboard/stat-card";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import type { Profile } from "@/types/domain";
import { getEducatorDashboardData } from "@/lib/services/dashboard";

type EducatorDashboardData = Awaited<ReturnType<typeof getEducatorDashboardData>>;

export function EducatorDashboard({
  profile,
  data,
}: {
  profile: Profile;
  data: EducatorDashboardData;
}) {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Educator hub"
        title={`Welcome, ${profile.full_name.split(" ")[0] || "educator"}`}
        actions={<ButtonLink href="/dashboard/classes">Open classes</ButtonLink>}
      >
        Create classes, share join codes, and watch how each child grows through videos, quizzes, and games.
      </PageHeader>

      <div className="grid gap-5 md:grid-cols-3">
        <StatCard label="Classes" value={data.classCount} helper="Active classes you manage." />
        <StatCard label="Students" value={data.studentCount} helper="Students currently enrolled across all classes." />
        <StatCard label="Average class size" value={data.averageClassSize} helper="A quick feel for roster size." />
      </div>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <ClassCreateForm />
        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-black text-slate-950">Your classes</h2>
            <Link href="/dashboard/classes" className="font-black text-sky-700 hover:text-sky-800">
              View all
            </Link>
          </div>
          <div className="mt-4">
            {data.classes.length > 0 ? (
              <CompactClassList classes={data.classes.slice(0, 6)} />
            ) : (
              <EmptyState
                title="Your first class starts here"
                message="Create one class, share the code, and your students can start joining."
              />
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}
