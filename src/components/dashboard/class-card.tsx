import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { gradeLabel } from "@/lib/constants";
import type { JoinedClass } from "@/types/domain";

export function ClassCard({
  classroom,
  href,
}: {
  classroom: JoinedClass;
  href?: string;
}) {
  const content = (
    <Card className="h-full transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md">
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
      <h3 className="mt-4 text-2xl font-black text-slate-950">{classroom.name}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {classroom.description || "A fresh class space for progress, pacing, and encouragement."}
      </p>
      <div className="mt-4 flex flex-wrap gap-4 text-sm font-bold text-slate-600">
        <span>{classroom.memberCount} students</span>
        <span>Code {classroom.join_code}</span>
      </div>
      <p className="mt-3 text-sm font-bold text-slate-500">
        Led by {classroom.educator.full_name}
      </p>
    </Card>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
