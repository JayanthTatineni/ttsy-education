import { EmptyState } from "@/components/ui/empty-state";
import { gradeLabel } from "@/lib/constants";
import type { EducatorClassDetail } from "@/types/domain";

export function ClassGrowthTable({ classroom }: { classroom: EducatorClassDetail }) {
  if (classroom.students.length === 0) {
    return (
      <EmptyState
        title="No students yet"
        message={`Share class code ${classroom.join_code} so students can join this class.`}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="grid grid-cols-[1.4fr_repeat(3,0.8fr)_1fr] gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4 text-sm font-black uppercase tracking-wide text-slate-600">
        <span>Student</span>
        <span>Completed</span>
        <span>Tried</span>
        <span>Average</span>
        <span>Last active</span>
      </div>
      {classroom.students.map((row) => (
        <div
          key={row.student.id}
          className="grid grid-cols-[1.4fr_repeat(3,0.8fr)_1fr] gap-3 px-5 py-4 text-sm text-slate-700"
        >
          <div>
            <p className="font-black text-slate-950">{row.student.full_name}</p>
            <p className="text-xs font-bold text-slate-500">
              {row.student.grade_level ? gradeLabel(row.student.grade_level) : "Grade not set"}
            </p>
            {classroom.assignments.length > 0 ? (
              <p className="mt-1 text-xs font-bold text-slate-500">
                {row.assignedCompletedLessons}/{classroom.assignments.length} assigned complete ·{" "}
                {row.assignedAverageBestScore}% assigned avg
              </p>
            ) : null}
          </div>
          <span className="font-bold">{row.completedLessons}</span>
          <span className="font-bold">{row.attemptedLessons}</span>
          <span className="font-bold">{row.averageBestScore}%</span>
          <span className="font-bold text-slate-500">
            {row.latestActivityAt
              ? new Date(row.latestActivityAt).toLocaleDateString()
              : "Not yet"}
          </span>
        </div>
      ))}
    </div>
  );
}
