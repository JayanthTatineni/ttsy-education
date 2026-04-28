"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { assignLessonToClassAction } from "@/actions/classroom";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { gradeLabel } from "@/lib/constants";
import {
  assignLessonSchema,
  type AssignLessonValues,
} from "@/lib/validation/classroom";
import type { AssignableLesson } from "@/types/domain";

export function AssignLessonForm({
  classId,
  lessons,
}: {
  classId: string;
  lessons: AssignableLesson[];
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const firstLessonId = useMemo(() => lessons[0]?.id ?? "", [lessons]);
  const form = useForm<AssignLessonValues>({
    resolver: zodResolver(assignLessonSchema),
    defaultValues: { lessonId: firstLessonId },
  });

  useEffect(() => {
    if (firstLessonId) {
      form.reset({ lessonId: firstLessonId });
    }
  }, [firstLessonId, form]);

  const onSubmit = form.handleSubmit((values) => {
    setMessage(null);
    startTransition(async () => {
      const result = await assignLessonToClassAction(classId, values);
      setMessage(result.message);

      if (result.ok) {
        form.reset({ lessonId: firstLessonId });
        router.refresh();
      }
    });
  });

  if (lessons.length === 0) {
    return (
      <Card>
        <CardTitle>Assign a lesson</CardTitle>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          All matching published lessons are already assigned, or there are no lessons that fit this class yet.
        </p>
      </Card>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <CardTitle>Assign a lesson</CardTitle>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Pick a lesson for this class and students will see it in their class space.
      </p>

      <div className="mt-4 space-y-3">
        <select
          className="form-input"
          {...form.register("lessonId")}
          disabled={isPending}
        >
          {lessons.map((lesson) => (
            <option key={lesson.id} value={lesson.id}>
              {`${gradeLabel(lesson.grade_level)} · ${lesson.subject.name} · ${lesson.unit.title} · ${lesson.title}`}
            </option>
          ))}
        </select>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Assigning..." : "Assign lesson"}
        </Button>
      </div>

      {form.formState.errors.lessonId ? (
        <p className="mt-2 text-sm font-bold text-rose-700">
          {form.formState.errors.lessonId.message}
        </p>
      ) : null}

      {message ? (
        <p className="mt-3 rounded-lg bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700">
          {message}
        </p>
      ) : null}
    </form>
  );
}
