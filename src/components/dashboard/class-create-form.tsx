"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { createClassAction } from "@/actions/classroom";
import { Button } from "@/components/ui/button";
import { GRADES, gradeLabel, SUBJECTS } from "@/lib/constants";
import {
  createClassSchema,
  type CreateClassValues,
} from "@/lib/validation/classroom";

export function ClassCreateForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<CreateClassValues>({
    resolver: zodResolver(createClassSchema),
    defaultValues: {
      name: "",
      description: "",
      gradeLevel: null,
      subjectFocus: null,
    },
  });
  const gradeLevel = useWatch({ control: form.control, name: "gradeLevel" });
  const subjectFocus = useWatch({ control: form.control, name: "subjectFocus" });

  const onSubmit = form.handleSubmit((values) => {
    setMessage(null);
    startTransition(async () => {
      const result = await createClassAction(values);
      setMessage(result.message);
      if (result.ok) {
        form.reset();
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-2xl font-black text-slate-950">Create a class</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Set up a class, share the join code, and watch growth in one place.
      </p>

      <div className="mt-4 space-y-4">
        <label className="block">
          <span className="text-sm font-bold text-slate-700">Class name</span>
          <input className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3" {...form.register("name")} />
          {form.formState.errors.name ? (
            <p className="mt-1 text-sm font-bold text-rose-700">{form.formState.errors.name.message}</p>
          ) : null}
        </label>

        <label className="block">
          <span className="text-sm font-bold text-slate-700">Description</span>
          <textarea className="mt-1 min-h-24 w-full rounded-lg border border-slate-300 px-4 py-3" {...form.register("description")} />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-bold text-slate-700">Grade focus</span>
            <select
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3"
              value={gradeLevel ?? ""}
              onChange={(event) =>
                form.setValue("gradeLevel", event.target.value ? (event.target.value as CreateClassValues["gradeLevel"]) : null)
              }
            >
              <option value="">Mixed grades</option>
              {GRADES.map((grade) => (
                <option key={grade} value={grade}>
                  {gradeLabel(grade)}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-700">Subject focus</span>
            <select
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3"
              value={subjectFocus ?? ""}
              onChange={(event) =>
                form.setValue("subjectFocus", event.target.value ? (event.target.value as CreateClassValues["subjectFocus"]) : null)
              }
            >
              <option value="">All subjects</option>
              {SUBJECTS.map((subject) => (
                <option key={subject.slug} value={subject.slug}>
                  {subject.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {message ? (
        <p className="mt-4 rounded-lg bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700">
          {message}
        </p>
      ) : null}

      <Button type="submit" className="mt-4" disabled={isPending}>
        {isPending ? "Creating..." : "Create class"}
      </Button>
    </form>
  );
}
