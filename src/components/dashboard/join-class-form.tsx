"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { joinClassAction } from "@/actions/classroom";
import { Button } from "@/components/ui/button";
import {
  joinClassSchema,
  type JoinClassValues,
} from "@/lib/validation/classroom";

export function JoinClassForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<JoinClassValues>({
    resolver: zodResolver(joinClassSchema),
    defaultValues: { joinCode: "" },
  });

  const onSubmit = form.handleSubmit((values) => {
    setMessage(null);
    startTransition(async () => {
      const result = await joinClassAction(values);
      setMessage(result.message);
      if (result.ok) {
        form.reset();
        router.refresh();
        if (result.id) {
          router.push(`/dashboard/classes/${result.id}`);
        }
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-2xl font-black text-slate-950">Join a class</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Ask your educator for the class code, then join in one tap.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-lg font-black uppercase tracking-[0.2em] text-slate-950 outline-none focus:border-emerald-600"
          placeholder="ABC123"
          maxLength={12}
          {...form.register("joinCode")}
          disabled={isPending}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Joining..." : "Join class"}
        </Button>
      </div>
      {form.formState.errors.joinCode ? (
        <p className="mt-2 text-sm font-bold text-rose-700">
          {form.formState.errors.joinCode.message}
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
