import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
        <p className="text-sm font-black uppercase tracking-wide text-sky-700">
          Page not found
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">
          This path is not ready for learning.
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-600">
          Choose a grade or head back to your dashboard.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <ButtonLink href="/dashboard">Dashboard</ButtonLink>
          <ButtonLink href="/dashboard/courses" variant="outline">
            Edit courses
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
