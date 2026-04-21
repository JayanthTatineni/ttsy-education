"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { toggleLessonPublishAction } from "@/actions/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { gradeLabel } from "@/lib/constants";
import type { LessonSummary } from "@/types/domain";

export function AdminLessonList({ lessons }: { lessons: LessonSummary[] }) {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-4">
      {message ? (
        <p className="rounded-lg bg-slate-100 px-4 py-3 font-bold text-slate-700">
          {message}
        </p>
      ) : null}
      {lessons.map((lesson) => (
        <div
          key={lesson.id}
          className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge tone={lesson.is_published ? "green" : "yellow"}>
                {lesson.is_published ? "Published" : "Draft"}
              </Badge>
              <Badge tone="blue">{lesson.subject.name}</Badge>
              <Badge>{gradeLabel(lesson.grade_level)}</Badge>
            </div>
            <h3 className="mt-3 text-2xl font-black text-slate-950">{lesson.title}</h3>
            <p className="mt-1 text-sm font-bold text-slate-500">
              {lesson.unit.title} · {lesson.question_count ?? 0} questions
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/admin/lessons/${lesson.id}/edit`}
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 font-bold text-slate-900 hover:bg-slate-50"
            >
              Edit
            </Link>
            <Button
              variant={lesson.is_published ? "outline" : "primary"}
              disabled={isPending}
              onClick={() => {
                startTransition(async () => {
                  const result = await toggleLessonPublishAction(
                    lesson.id,
                    !lesson.is_published,
                  );
                  setMessage(result.message);
                });
              }}
            >
              {lesson.is_published ? "Unpublish" : "Publish"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
