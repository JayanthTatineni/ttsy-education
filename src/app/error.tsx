"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
        <p className="text-sm font-black uppercase tracking-wide text-rose-700">
          Something needs attention
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">
          We could not load this page.
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-600">{error.message}</p>
        <Button className="mt-5" onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  );
}
