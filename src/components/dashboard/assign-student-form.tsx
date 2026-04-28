"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { assignStudentToClassAction } from "@/actions/classroom";
import { Button } from "@/components/ui/button";
import {
  assignStudentSchema,
  type AssignStudentValues,
} from "@/lib/validation/classroom";

export function AssignStudentForm({ classId }: { classId: string }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<AssignStudentValues>({
    resolver: zodResolver(assignStudentSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = form.handleSubmit((values) => {
    setMessage(null);
    startTransition(async () => {
      const result = await assignStudentToClassAction(classId, values);
      setMessage(result.message);
      if (result.ok) {
        form.reset();
        router.refresh();
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-2xl font-black text-slate-950">Assign a student</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Add a student directly by email, or share the join code for self-serve access.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          className="form-input"
          type="email"
          placeholder="student@email.com"
          {...form.register("email")}
          disabled={isPending}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Adding..." : "Add student"}
        </Button>
      </div>
      {form.formState.errors.email ? (
        <p className="mt-2 text-sm font-bold text-rose-700">
          {form.formState.errors.email.message}
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
