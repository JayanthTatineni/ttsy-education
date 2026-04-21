import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { TopicGameZone } from "@/components/games/topic-game-zone";
import { PracticeZone } from "@/components/lessons/practice-zone";
import { QuestionPreview } from "@/components/lessons/question-preview";
import { QuizRunner } from "@/components/lessons/quiz-runner";
import { VideoEmbed } from "@/components/lessons/video-embed";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { ProgressBar } from "@/components/ui/progress-bar";
import { requireLearner } from "@/lib/auth/session";
import { gradeLabel, parseGrade } from "@/lib/constants";
import { getLessonBySlug, getLessonSequenceForUnit } from "@/lib/services/lessons";
import { makeCourseSlug } from "@/lib/utils";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ grade: string; subject: string; lessonSlug: string }>;
}) {
  const profile = await requireLearner();
  const { grade: gradeParam, subject, lessonSlug } = await params;
  const grade = parseGrade(gradeParam);

  if (!grade) {
    notFound();
  }

  const lesson = await getLessonBySlug({
    grade,
    subjectSlug: subject,
    lessonSlug,
    studentId: profile.role === "student" ? profile.id : undefined,
  });

  if (!lesson) {
    notFound();
  }

  const sequence = await getLessonSequenceForUnit(
    lesson.unit_id,
    profile.role === "student" ? profile.id : undefined,
  );
  const currentStep = sequence.find((item) => item.lesson.id === lesson.id);
  const courseSlug = makeCourseSlug(lesson.subject.slug, lesson.unit.title);

  if (profile.role === "student" && currentStep?.locked) {
    redirect(`/learn/${lesson.grade_level.toLowerCase()}/courses/${courseSlug}`);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={`${gradeLabel(lesson.grade_level)} ${lesson.subject.name}`}
        title={lesson.title}
      >
        {lesson.description}
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.34fr]">
        <div className="space-y-6">
          <section id="video" className="scroll-mt-24 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap gap-2">
              <Badge tone="blue">Step 1</Badge>
              <Badge tone="slate">Video</Badge>
              <Badge tone="green">{lesson.estimated_minutes} min</Badge>
            </div>
            <h2 className="mt-3 text-3xl font-black text-slate-950">Watch the lesson</h2>
            <p className="mt-2 text-base leading-7 text-slate-600">
              Start with the video, then move into the questions and game.
            </p>
            <div className="mt-5">
              <VideoEmbed title={lesson.title} url={lesson.video_url} />
            </div>
          </section>

          <section id="questions" className="scroll-mt-24 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap gap-2">
              <Badge tone="blue">Step 2</Badge>
              <Badge tone="slate">Questions</Badge>
            </div>
            <h2 className="mt-3 text-3xl font-black text-slate-950">
              Answer the checks
            </h2>
            <p className="mt-2 text-base leading-7 text-slate-600">
              Finish the questions to save progress. Educators see a preview version here.
            </p>
          </section>
          {profile.role === "student" ? (
            <QuizRunner lesson={lesson} />
          ) : (
            <QuestionPreview questions={lesson.questions} />
          )}

          <section id="game" className="scroll-mt-24 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap gap-2">
              <Badge tone="blue">Step 3</Badge>
              <Badge tone="slate">Game</Badge>
            </div>
            <h2 className="mt-3 text-3xl font-black text-slate-950">Play the topic game</h2>
            <p className="mt-2 text-base leading-7 text-slate-600">
              End with something playful that still stays on the same idea.
            </p>
          </section>
          <TopicGameZone lesson={lesson} />

          {profile.role === "student" ? <PracticeZone lesson={lesson} /> : null}
        </div>

        <aside className="space-y-5">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap gap-2">
              <Badge tone={lesson.progress?.completed ? "green" : "yellow"}>
                {lesson.progress?.completed ? "Completed" : "In progress"}
              </Badge>
              {lesson.questions.slice(0, 2).map((question) => (
                <Badge key={question.id} tone="slate">
                  {question.skill_tag}
                </Badge>
              ))}
            </div>
            <h2 className="mt-4 text-2xl font-black text-slate-950">Course progress</h2>
            <ProgressBar value={lesson.progress?.best_score ?? 0} label="Best lesson score" className="mt-4" />
            <Link
              href={`/learn/${lesson.grade_level.toLowerCase()}/courses/${courseSlug}`}
              className="mt-4 inline-block font-black text-sky-700 hover:text-sky-800"
            >
              Back to course roadmap
            </Link>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">Do these in order</h2>
            <div className="mt-4 space-y-3">
              {sequence.map((item) => (
                <div
                  key={item.lesson.id}
                  className={`rounded-lg px-4 py-3 ${
                    item.lesson.id === lesson.id
                      ? "bg-emerald-50"
                      : item.locked && profile.role === "student"
                        ? "bg-slate-100"
                        : "bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-black text-slate-950">
                      {item.order}. {item.lesson.title}
                    </p>
                    {item.lesson.progress?.completed ? (
                      <Badge tone="green">Done</Badge>
                    ) : item.locked && profile.role === "student" ? (
                      <Badge tone="yellow">Locked</Badge>
                    ) : (
                      <Badge tone="blue">Open</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
