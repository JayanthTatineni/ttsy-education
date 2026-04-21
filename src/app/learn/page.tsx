import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { requireLearner } from "@/lib/auth/session";
import { GRADES, gradeLabel } from "@/lib/constants";

export default async function LearnPage() {
  await requireLearner();

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Learning path" title="Choose your grade">
        Start with your grade, then choose one course path to move through in order.
      </PageHeader>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {GRADES.map((grade) => (
          <Link key={grade} href={`/learn/${grade.toLowerCase()}`}>
            <Card className="transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md">
              <p className="text-sm font-black uppercase tracking-wide text-emerald-700">
                Grade
              </p>
              <h2 className="mt-2 text-4xl font-black text-slate-950">
                {gradeLabel(grade)}
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-600">
                Open the grade, pick one course, then work down through videos, questions, and games.
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
