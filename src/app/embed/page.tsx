import Link from "next/link";
import { ArrowRight, ExternalLink, MonitorSmartphone, School, UserRound } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const embedHighlights = [
  {
    title: "Students",
    text: "Open short STEM lessons, questions, and saved progress from one place.",
    icon: UserRound,
  },
  {
    title: "Teachers",
    text: "Share class codes, track progress, and manage student rosters.",
    icon: School,
  },
  {
    title: "Best on iPad",
    text: "If the embedded frame acts up, open TTSY Education directly in a new tab.",
    icon: MonitorSmartphone,
  },
];

export default function EmbedPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link href="/" className="text-2xl font-black tracking-tight">
              TTSY Education
            </Link>
            <ButtonLink href="/" variant="outline">
              Open homepage
            </ButtonLink>
          </div>

          <div className="mt-8 max-w-3xl">
            <p className="text-sm font-black uppercase tracking-wide text-emerald-700">
              Google Sites embed
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
              Launch the learning platform from your Google Site.
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              This page is a lighter entry point for embedded use. It works well as a launcher for
              students and teachers, especially on iPad where full embedded apps can be temperamental.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/login" className="text-lg">
                Log in
                <ArrowRight className="ml-2 h-5 w-5" />
              </ButtonLink>
              <ButtonLink href="/" variant="outline" className="text-lg">
                Open full site
                <ExternalLink className="ml-2 h-5 w-5" />
              </ButtonLink>
            </div>
          </div>
        </div>

        <section className="grid gap-5 md:grid-cols-3">
          {embedHighlights.map((item) => {
            const Icon = item.icon;

            return (
              <Card key={item.title}>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="mt-5 text-2xl font-black">{item.title}</h2>
                <p className="mt-3 text-base leading-7 text-slate-600">{item.text}</p>
              </Card>
            );
          })}
        </section>
      </div>
    </main>
  );
}
