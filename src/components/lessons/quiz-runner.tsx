"use client";

import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { submitQuizAction } from "@/actions/quiz";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { COMPLETION_SCORE } from "@/lib/constants";
import { isNumericMatch, normalizeAnswer } from "@/lib/utils";
import type { LessonDetail, Question, QuizResult } from "@/types/domain";

function answerOptions(question: Question) {
  return Array.isArray(question.answer_options)
    ? question.answer_options.filter((option): option is string => typeof option === "string")
    : [];
}

function checkLocalAnswer(question: Question, selected: string) {
  if (question.type === "numeric") {
    return isNumericMatch(selected, question.correct_answer);
  }

  return normalizeAnswer(selected) === normalizeAnswer(question.correct_answer);
}

export function QuizRunner({ lesson }: { lesson: LessonDetail }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const answeredCount = useMemo(
    () =>
      lesson.questions.filter((question) => {
        const answer = answers[question.id];
        return answer !== undefined && answer.trim() !== "";
      }).length,
    [answers, lesson.questions],
  );

  const canSubmit = answeredCount === lesson.questions.length && lesson.questions.length > 0;

  function submitQuiz() {
    setError(null);
    startTransition(async () => {
      try {
        const nextResult = await submitQuizAction({ lessonId: lesson.id, answers });
        setResult(nextResult);
      } catch (submissionError) {
        setError(
          submissionError instanceof Error
            ? submissionError.message
            : "Something went wrong while saving your quiz.",
        );
      }
    });
  }

  if (result) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <Badge tone={result.completed ? "green" : "yellow"}>
          {result.completed ? "Lesson complete" : "Keep practicing"}
        </Badge>
        <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
          You scored {result.score}%
        </h2>
        <p className="mt-2 text-lg leading-8 text-slate-600">
          {result.correctAnswers} out of {result.totalQuestions} answers were correct.
          {result.completed
            ? " Great work. Your progress is saved."
            : ` Score ${COMPLETION_SCORE}% or higher to complete this lesson.`}
        </p>
        <ProgressBar value={result.score} label="Final score" className="mt-5" />
        <div className="mt-6 space-y-3">
          {result.results.map((item, index) => (
            <div key={item.questionId} className="rounded-lg bg-slate-50 p-4">
              <p className="font-black text-slate-950">Question {index + 1}</p>
              <p className="mt-1 text-sm font-bold text-slate-600">
                Your answer: {item.selectedAnswer || "No answer"} | Correct answer:{" "}
                {item.correctAnswer}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.explanation}</p>
            </div>
          ))}
        </div>
        <Button
          variant="secondary"
          className="mt-6"
          onClick={() => {
            setAnswers({});
            setChecked({});
            setResult(null);
          }}
        >
          <RotateCcw className="mr-2 h-5 w-5" />
          Try again
        </Button>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge tone="blue">Lesson quiz</Badge>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
            Check your understanding
          </h2>
          <p className="mt-2 text-base leading-7 text-slate-600">
            Answer every question. These are original TEKS-aligned checks with quick
            feedback right away.
          </p>
        </div>
        <div className="text-sm font-black text-slate-600">
          {answeredCount}/{lesson.questions.length} answered
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {lesson.questions.map((question, index) => {
          const selected = answers[question.id] ?? "";
          const isChecked = Boolean(checked[question.id]);
          const isCorrect = isChecked ? checkLocalAnswer(question, selected) : false;
          const options =
            question.type === "true_false"
              ? ["true", "false"]
              : answerOptions(question);

          return (
            <div key={question.id} className="rounded-lg bg-slate-50 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="slate">Question {index + 1}</Badge>
                <Badge tone={question.difficulty === "challenge" ? "yellow" : "green"}>
                  {question.skill_tag}
                </Badge>
              </div>
              {question.image_url ? (
                <img
                  src={question.image_url}
                  alt=""
                  className="mt-4 max-h-64 w-full rounded-lg object-cover"
                />
              ) : null}
              <p className="mt-4 text-xl font-black leading-8 text-slate-950">
                {question.prompt}
              </p>

              {question.type === "numeric" ? (
                <input
                  type="number"
                  inputMode="numeric"
                  className="mt-4 w-full rounded-lg border border-slate-300 px-4 py-3 text-lg font-bold text-slate-950 outline-none focus:border-emerald-600 sm:max-w-xs"
                  value={selected}
                  onChange={(event) =>
                    setAnswers((current) => ({
                      ...current,
                      [question.id]: event.target.value,
                    }))
                  }
                />
              ) : (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {options.map((option) => (
                    <label
                      key={option}
                      className="flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3 font-bold text-slate-800"
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={option}
                        checked={selected === option}
                        onChange={() =>
                          setAnswers((current) => ({ ...current, [question.id]: option }))
                        }
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}

              <Button
                variant="outline"
                className="mt-4"
                disabled={!selected}
                onClick={() => setChecked((current) => ({ ...current, [question.id]: true }))}
              >
                Check answer
              </Button>

              {isChecked ? (
                <div className="mt-4 rounded-lg bg-white p-4">
                  <p className="flex items-center gap-2 font-black text-slate-950">
                    {isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-rose-600" />
                    )}
                    {isCorrect ? "Nice thinking!" : "Good try. Look at the hint."}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {question.explanation}
                  </p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {error ? (
        <p className="mt-5 rounded-lg bg-rose-100 px-4 py-3 font-bold text-rose-800">
          {error}
        </p>
      ) : null}

      <Button
        className="mt-6 w-full sm:w-auto"
        disabled={!canSubmit || isPending}
        onClick={submitQuiz}
      >
        {isPending ? "Saving..." : "Finish quiz and save progress"}
      </Button>
    </section>
  );
}
