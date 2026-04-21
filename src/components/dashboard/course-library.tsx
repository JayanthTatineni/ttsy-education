"use client";

import { useMemo, useState, useTransition } from "react";
import { BookOpen } from "lucide-react";
import { updateCourseSelectionAction } from "@/actions/courses";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CourseSummary, GradeLevel } from "@/types/domain";

type GradeGroup = {
  grade: GradeLevel;
  courses: CourseSummary[];
};

export function CourseLibrary({
  groups,
  initialSelectedUnitIds,
}: {
  groups: GradeGroup[];
  initialSelectedUnitIds: string[];
}) {
  const [selectedUnitIds, setSelectedUnitIds] = useState<Set<string>>(
    () => new Set(initialSelectedUnitIds),
  );
  const [message, setMessage] = useState<string | null>(null);
  const [pendingUnitId, setPendingUnitId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedCount = selectedUnitIds.size;
  const gradeCount = useMemo(
    () => groups.reduce((sum, group) => sum + group.courses.length, 0),
    [groups],
  );

  function toggle(unitId: string, selected: boolean) {
    setMessage(null);
    setPendingUnitId(unitId);

    startTransition(async () => {
      const previous = new Set(selectedUnitIds);
      const next = new Set(selectedUnitIds);

      if (selected) {
        next.add(unitId);
      } else {
        next.delete(unitId);
      }

      setSelectedUnitIds(next);
      const result = await updateCourseSelectionAction({ unitId, selected });

      if (!result.ok) {
        setSelectedUnitIds(previous);
      }

      setPendingUnitId(null);
      setMessage(result.message);
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-emerald-700">
              Edit courses
            </p>
            <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-950">
              Choose from every grade
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge>{selectedCount} selected</Badge>
            <Badge tone="slate">{gradeCount} available</Badge>
          </div>
        </div>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
          Add any course you want to your home screen. You are not limited to your current grade.
        </p>
        {message ? (
          <p className="mt-4 rounded-lg bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700">
            {message}
          </p>
        ) : null}
      </div>

      {groups.map((group) => (
        <section key={group.grade} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <p className="text-sm font-black uppercase tracking-wide text-slate-500">
              {group.grade === "K" ? "Kindergarten" : `Grade ${group.grade}`}
            </p>
          </div>
          <div className="grid gap-3">
            {group.courses.map((course) => {
              const selected = selectedUnitIds.has(course.unit.id);
              const pending = isPending && pendingUnitId === course.unit.id;

              return (
                <div
                  key={course.slug}
                  className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
                        <BookOpen className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap gap-2">
                          <Badge tone={course.subject.slug === "math" ? "blue" : "green"}>
                            {course.subject.name}
                          </Badge>
                          <Badge tone="slate">{course.lessonCount} lessons</Badge>
                        </div>
                        <h3 className="mt-2 text-xl font-black text-slate-950">{course.unit.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          {course.unit.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <Button
                      variant={selected ? "outline" : "secondary"}
                      disabled={pending}
                      onClick={() => toggle(course.unit.id, !selected)}
                    >
                      {pending ? "Saving..." : selected ? "Remove" : "Add to home"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
