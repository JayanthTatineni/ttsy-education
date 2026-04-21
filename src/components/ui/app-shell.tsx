import Link from "next/link";
import type { ReactNode } from "react";
import { logoutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/types/domain";

export function AppShell({ profile, children }: { profile: Profile; children: ReactNode }) {
  const isAdmin = profile.role === "admin";
  const isEducator = profile.role === "educator";

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link href={isAdmin ? "/admin" : "/dashboard"} className="text-2xl font-black text-slate-950">
              TTSY Education
            </Link>
            <form action={logoutAction}>
              <Button type="submit" variant="outline" className="w-full sm:w-auto">
                Log out
              </Button>
            </form>
          </div>
          <nav className="flex flex-wrap gap-2 text-sm font-bold">
            {isAdmin ? (
              <>
                <Link className="rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100" href="/admin">
                  Admin home
                </Link>
                <Link className="rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100" href="/admin/lessons">
                  Lessons
                </Link>
              </>
            ) : isEducator ? (
              <>
                <Link className="rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100" href="/dashboard">
                  Educator hub
                </Link>
                <Link className="rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100" href="/dashboard/classes">
                  Classes
                </Link>
                <Link className="rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100" href="/learn">
                  Curriculum
                </Link>
              </>
            ) : (
              <>
                <Link className="rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100" href="/dashboard">
                  My courses
                </Link>
                <Link className="rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100" href="/dashboard/courses">
                  Edit courses
                </Link>
                <Link className="rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100" href="/dashboard/progress">
                  Progress
                </Link>
                <Link className="rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100" href="/dashboard/classes">
                  Teachers
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
