"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, CirclePlay, Gamepad2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { CourseDetail, LessonSequenceItem, Profile } from "@/types/domain";

type CourseTab = "videos" | "questions";

function lessonHref(item: LessonSequenceItem) {
  return `/learn/${item.lesson.grade_level.toLowerCase()}/${item.lesson.subject.slug}/${item.lesson.slug}`;
}

function lessonStatus(item: LessonSequenceItem, isStudent: boolean) {
  if (item.lesson.progress?.completed) {
    return { label: "Done", tone: "green" as const };
  }

  if (item.locked && isStudent) {
    return { label: "Locked", tone: "yellow" as const };
  }

  if (item.lesson.progress) {
    return { label: "Resume", tone: "blue" as const };
  }

  return { label: "Start", tone: "slate" as const };
}

export function CourseRoadmap({
  course,
  sequence,
  profile,
}: {
  course: CourseDetail;
  sequence: LessonSequenceItem[];
  profile: Profile;
}) {
  const isStudent = profile.role === "student";
  const firstOpenLesson =
    sequence.find((item) => !item.locked || !isStudent) ?? sequence[0] ?? null;
  const [selectedLessonId, setSelectedLessonId] = useState(firstOpenLesson?.lesson.id ?? "");
  const [activeTab, setActiveTab] = useState<CourseTab>("videos");

  const selectedItem = useMemo(
    () =>
      sequence.find((item) => item.lesson.id === selectedLessonId) ??
      firstOpenLesson,
    [firstOpenLesson, selectedLessonId, sequence],
  );

  if (!selectedItem) {
    return null;
  }

  const selectedStatus = lessonStatus(selectedItem, isStudent);
  const masteryValue =
    course.lessonCount > 0 ? (course.completedCount / course.lessonCount) * 100 : 0;
  const selectedLessonHref = lessonHref(selectedItem);
  const selectedLocked = selectedItem.locked && isStudent;
  const secondaryHref = isStudent ? "/dashboard/courses" : "/learn";
  const secondaryLabel = isStudent ? "Edit courses" : "Course library";

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-black uppercase tracking-wide text-slate-500">
          Course lessons
        </p>
        <h2 className="mt-2 text-2xl font-black text-slate-950">{course.unit.title}</h2>
        <ProgressBar value={masteryValue} label="Course mastery" className="mt-4" />

        <div className="mt-5 space-y-2">
          {sequence.map((item) => {
            const state = lessonStatus(item, isStudent);
            const isActive = item.lesson.id === selectedItem.lesson.id;

            return (
              <button
                key={item.lesson.id}
                type="button"
                onClick={() => setSelectedLessonId(item.lesson.id)}
                className={`w-full rounded-lg border px-4 py-3 text-left transition ${
                  isActive
                    ? "border-emerald-300 bg-emerald-50"
                    : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black uppercase tracking-wide text-slate-500">
                      Lesson {item.order}
                    </p>
                    <p className="mt-1 font-black text-slate-950">{item.lesson.title}</p>
                  </div>
                  <Badge tone={state.tone}>{state.label}</Badge>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      <div className="space-y-5">
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap gap-2">
                <Badge tone={course.subject.slug === "math" ? "blue" : "green"}>
                  {course.subject.name}
                </Badge>
                <Badge>{selectedItem.order === 1 ? "Start here" : `Lesson ${selectedItem.order}`}</Badge>
                <Badge tone={selectedStatus.tone}>{selectedStatus.label}</Badge>
              </div>
              <h3 className="mt-4 text-4xl font-black tracking-tight text-slate-950">
                {selectedItem.lesson.title}
              </h3>
              <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
                {selectedItem.lesson.description}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <ButtonLink href={selectedLessonHref} variant="secondary">
                {selectedItem.lesson.progress ? "Open lesson" : "Get started"}
              </ButtonLink>
              <ButtonLink href={secondaryHref} variant="outline">
                {secondaryLabel}
              </ButtonLink>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
            <button
              type="button"
              onClick={() => setActiveTab("videos")}
              className={`rounded-lg px-4 py-2 text-sm font-black transition ${
                activeTab === "videos"
                  ? "bg-sky-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Videos
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("questions")}
              className={`rounded-lg px-4 py-2 text-sm font-black transition ${
                activeTab === "questions"
                  ? "bg-sky-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Questions
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {activeTab === "videos" ? (
              <Link
                href={selectedLocked ? `#` : `${selectedLessonHref}#video`}
                className={`flex items-center justify-between rounded-lg border px-4 py-4 ${
                  selectedLocked
                    ? "cursor-default border-slate-200 bg-slate-100 text-slate-500"
                    : "border-slate-200 bg-slate-50 hover:border-sky-300 hover:bg-sky-50"
                }`}
              >
                <span className="inline-flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
                    <CirclePlay className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-black text-slate-950">Watch lesson video</span>
                    <span className="text-sm text-slate-600">
                      Start with the video and get the main idea first.
                    </span>
                  </span>
                </span>
                <span className="text-sm font-bold text-slate-500">
                  {selectedItem.lesson.estimated_minutes} min
                </span>
              </Link>
            ) : (
              <>
                <Link
                  href={selectedLocked ? `#` : `${selectedLessonHref}#questions`}
                  className={`flex items-center justify-between rounded-lg border px-4 py-4 ${
                    selectedLocked
                      ? "cursor-default border-slate-200 bg-slate-100 text-slate-500"
                      : "border-slate-200 bg-slate-50 hover:border-emerald-300 hover:bg-emerald-50"
                  }`}
                >
                  <span className="inline-flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                      <BookOpen className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block font-black text-slate-950">Lesson questions</span>
                      <span className="text-sm text-slate-600">
                        Save progress and see feedback after each answer.
                      </span>
                    </span>
                  </span>
                  <span className="text-sm font-bold text-slate-500">
                    {selectedItem.lesson.question_count ?? 0} questions
                  </span>
                </Link>

                <Link
                  href={selectedLocked ? `#` : `${selectedLessonHref}#game`}
                  className={`flex items-center justify-between rounded-lg border px-4 py-4 ${
                    selectedLocked
                      ? "cursor-default border-slate-200 bg-slate-100 text-slate-500"
                      : "border-slate-200 bg-slate-50 hover:border-amber-300 hover:bg-amber-50"
                  }`}
                >
                  <span className="inline-flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                      <Gamepad2 className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block font-black text-slate-950">Topic game</span>
                      <span className="text-sm text-slate-600">
                        Play the quick game after the questions for extra practice.
                      </span>
                    </span>
                  </span>
                  <span className="text-sm font-bold text-slate-500">Bonus</span>
                </Link>
              </>
            )}
          </div>

          {selectedLocked ? (
            <p className="mt-4 text-sm font-bold text-slate-500">
              Finish the lesson above to unlock this one.
            </p>
          ) : null}
        </section>
      </div>
    </div>
  );
}
