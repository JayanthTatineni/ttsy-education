import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { hasSupabaseEnv } from "@/lib/supabase/env";

const steps = [
  {
    title: "Pick a path",
    text: "Students choose a grade, subject, and short lesson that fits the day.",
    icon: BookOpen,
  },
  {
    title: "Try the quiz",
    text: "Every lesson has simple questions with feedback after each answer.",
    icon: CheckCircle2,
  },
  {
    title: "Keep progress",
    text: "Scores, completions, and retries are saved to each student account.",
    icon: ShieldCheck,
  },
];

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ setup?: string }>;
}) {
  const { setup } = await searchParams;
  const supabaseReady = hasSupabaseEnv();

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link href="/" className="text-2xl font-black tracking-tight">
            TTSY Education
          </Link>
        <nav className="flex items-center gap-3">
          <Link className="font-bold text-slate-700 hover:text-slate-950" href="/login">
            Log in
          </Link>
          <ButtonLink href="/signup">Sign up</ButtonLink>
        </nav>
      </header>

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1fr_0.9fr] md:items-center lg:px-8">
          <div>
            {!supabaseReady || setup === "supabase" ? (
              <div className="mb-5 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm font-bold text-yellow-950">
                Add your Supabase values to <code>.env.local</code>, then run{" "}
                <code>supabase/schema.sql</code> and <code>supabase/seed.sql</code>.
                After that, refresh and sign up.
              </div>
            ) : null}
            <div className="inline-flex items-center rounded-lg bg-yellow-100 px-3 py-2 text-sm font-black text-yellow-900">
              <Sparkles className="mr-2 h-4 w-4" />
              K-5 math and science practice
            </div>
            <h1 className="mt-6 max-w-3xl text-5xl font-black tracking-tight sm:text-6xl">
              Short STEM lessons that help Texas learners practice with confidence.
            </h1>
            <p className="mt-5 max-w-2xl text-xl leading-9 text-slate-600">
              Students sign in directly, learn with clear videos, answer TEKS-aligned
              questions, and build confidence with extra STAAR-style practice.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/signup" className="text-lg">
                Start learning
                <ArrowRight className="ml-2 h-5 w-5" />
              </ButtonLink>
              <ButtonLink href="/login" variant="outline" className="text-lg">
                I already have an account
              </ButtonLink>
            </div>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80"
              alt="Students raising hands in a bright classroom"
              className="h-[420px] w-full rounded-lg object-cover shadow-lg"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-wide text-emerald-700">
            How it works
          </p>
          <h2 className="mt-2 text-4xl font-black tracking-tight">
            Learn, answer, improve.
          </h2>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Card key={step.title}>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-2xl font-black">{step.title}</h3>
                <p className="mt-3 text-base leading-7 text-slate-600">{step.text}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="bg-emerald-700 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[0.8fr_1fr] md:items-center lg:px-8">
          <img
            src="https://images.unsplash.com/photo-1581093458791-9f3c3900df7b?auto=format&fit=crop&w=900&q=80"
            alt="Child using science materials during a STEM activity"
            className="h-72 w-full rounded-lg object-cover"
          />
          <div>
            <h2 className="text-4xl font-black tracking-tight">
              Admin tools are built in.
            </h2>
            <p className="mt-4 text-lg leading-8 text-emerald-50">
              Create lessons, publish when ready, and manage questions from a
              protected admin area. Students only see published content.
            </p>
            <ButtonLink href="/login" variant="outline" className="mt-6 border-white text-slate-950">
              Admin log in
            </ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
