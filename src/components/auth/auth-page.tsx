import { Suspense } from "react";
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const supabaseReady = hasSupabaseEnv();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1fr_0.9fr] md:items-center">
        <section>
          <Link href="/" className="text-2xl font-black text-slate-950">
            TTSY Education
          </Link>
          <h2 className="mt-10 max-w-2xl text-5xl font-black tracking-tight text-slate-950">
            Big STEM wins, one small lesson at a time.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Students can learn in order, save progress, join classes, and play
            topic games. Educators can build classes and watch growth.
          </p>
          <img
            src="https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?auto=format&fit=crop&w=900&q=80"
            alt="Student working on math blocks at a desk"
            className="mt-8 h-72 w-full rounded-lg object-cover"
          />
        </section>
        <section className="flex justify-center">
          <Suspense>
            <AuthForm mode={mode} supabaseReady={supabaseReady} />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
