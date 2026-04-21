"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { saveLessonAction } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { GRADES, gradeLabel } from "@/lib/constants";
import { slugify } from "@/lib/utils";
import {
  lessonSchema,
  type LessonFormInput,
  type LessonFormValues,
} from "@/lib/validation/lesson";
import type { Lesson, Subject, Unit } from "@/types/domain";

export function LessonForm({
  lesson,
  subjects,
  units,
}: {
  lesson?: Lesson;
  subjects: Subject[];
  units: Unit[];
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const firstSubject = subjects[0];
  const firstUnit = units[0];

  const form = useForm<LessonFormInput, unknown, LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      id: lesson?.id,
      title: lesson?.title ?? "",
      slug: lesson?.slug ?? "",
      description: lesson?.description ?? "",
      gradeLevel: lesson?.grade_level ?? "1",
      subjectId: lesson?.subject_id ?? firstSubject?.id ?? "",
      unitId: lesson?.unit_id ?? firstUnit?.id ?? "",
      videoUrl: lesson?.video_url ?? "https://www.youtube.com/watch?v=19g66ezsKAg",
      thumbnailUrl: lesson?.thumbnail_url ?? "",
      estimatedMinutes: lesson?.estimated_minutes ?? 8,
      sortOrder: lesson?.sort_order ?? 1,
      isPublished: lesson?.is_published ?? false,
    },
  });

  const grade = useWatch({ control: form.control, name: "gradeLevel" });
  const subjectId = useWatch({ control: form.control, name: "subjectId" });
  const title = useWatch({ control: form.control, name: "title" });
  const filteredUnits = useMemo(
    () =>
      units.filter(
        (unit) => unit.grade_level === grade && unit.subject_id === subjectId,
      ),
    [grade, subjectId, units],
  );

  useEffect(() => {
    const currentUnitId = form.getValues("unitId");
    const hasCurrentUnit = filteredUnits.some((unit) => unit.id === currentUnitId);
    if (!hasCurrentUnit && filteredUnits[0]) {
      form.setValue("unitId", filteredUnits[0].id);
    }
  }, [filteredUnits, form]);

  useEffect(() => {
    if (!lesson && title && !form.getValues("slug")) {
      form.setValue("slug", slugify(title));
    }
  }, [form, lesson, title]);

  const onSubmit = form.handleSubmit((values) => {
    setMessage(null);
    startTransition(async () => {
      const result = await saveLessonAction(values);
      setMessage(result.message);
      if (result.ok && result.id) {
        router.push(`/admin/lessons/${result.id}/edit`);
        router.refresh();
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Title" error={form.formState.errors.title?.message}>
          <input className="form-input" {...form.register("title")} />
        </Field>
        <Field label="Slug" error={form.formState.errors.slug?.message}>
          <input className="form-input" {...form.register("slug")} />
        </Field>
      </div>

      <Field label="Description" error={form.formState.errors.description?.message}>
        <textarea className="form-input min-h-28" {...form.register("description")} />
      </Field>

      <div className="grid gap-5 md:grid-cols-3">
        <Field label="Grade" error={form.formState.errors.gradeLevel?.message}>
          <select className="form-input" {...form.register("gradeLevel")}>
            {GRADES.map((item) => (
              <option key={item} value={item}>
                {gradeLabel(item)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Subject" error={form.formState.errors.subjectId?.message}>
          <select className="form-input" {...form.register("subjectId")}>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Unit" error={form.formState.errors.unitId?.message}>
          <select className="form-input" {...form.register("unitId")}>
            {filteredUnits.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.title}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Video URL" error={form.formState.errors.videoUrl?.message}>
          <input className="form-input" {...form.register("videoUrl")} />
        </Field>
        <Field label="Thumbnail URL" error={form.formState.errors.thumbnailUrl?.message}>
          <input className="form-input" {...form.register("thumbnailUrl")} />
        </Field>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <Field label="Estimated minutes" error={form.formState.errors.estimatedMinutes?.message}>
          <input
            type="number"
            className="form-input"
            {...form.register("estimatedMinutes", { valueAsNumber: true })}
          />
        </Field>
        <Field label="Sort order" error={form.formState.errors.sortOrder?.message}>
          <input
            type="number"
            className="form-input"
            {...form.register("sortOrder", { valueAsNumber: true })}
          />
        </Field>
        <label className="flex items-center gap-3 rounded-lg bg-slate-50 px-4 py-3 font-bold text-slate-800">
          <input type="checkbox" {...form.register("isPublished")} />
          Published
        </label>
      </div>

      {message ? (
        <p className="rounded-lg bg-slate-100 px-4 py-3 font-bold text-slate-700">
          {message}
        </p>
      ) : null}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save lesson"}
      </Button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <div className="mt-1">{children}</div>
      {error ? <p className="mt-1 text-sm font-bold text-rose-700">{error}</p> : null}
    </label>
  );
}
