"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { generateTexasPractice, isPracticeAnswerCorrect } from "@/lib/practice/texas-practice";
import type { LessonDetail, PracticeQuestion } from "@/types/domain";

function practiceOptions(question: PracticeQuestion) {
  if (question.type === "true_false") {
    return ["true", "false"];
  }

  return question.options ?? [];
}

export function PracticeZone({ lesson }: { lesson: LessonDetail }) {
  const [round, setRound] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const practice = useMemo(() => generateTexasPractice(lesson, round), [lesson, round]);
  const usesReleasedStaarPatterns =
    ["3", "4", "5"].includes(lesson.grade_level) &&
    (lesson.subject.slug === "math" || lesson.subject.slug === "science");

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge tone="blue">
            {usesReleasedStaarPatterns ? "Released STAAR-inspired" : "TEKS warm-up"}
          </Badge>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
            {usesReleasedStaarPatterns ? "Released-test style practice" : "TEKS skill practice"}
          </h2>
          <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
            {usesReleasedStaarPatterns
              ? "These original practice questions borrow the structure, pacing, and distractor style of released Texas STAAR items while staying original to this app."
              : "These original practice questions build the TEKS skills students need before the official STAAR-tested grades and subjects."}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setRound((value) => value + 1);
            setAnswers({});
            setRevealed({});
          }}
        >
          New practice set
        </Button>
      </div>

      <div className="mt-6 space-y-5">
        {practice.map((question, index) => {
          const selected = answers[question.id] ?? "";
          const shown = Boolean(revealed[question.id]);
          const isCorrect = shown ? isPracticeAnswerCorrect(question, selected) : false;
          const options = practiceOptions(question);

          return (
            <div key={question.id} className="rounded-lg bg-slate-50 p-5">
              <div className="flex flex-wrap gap-2">
                <Badge>Practice {index + 1}</Badge>
                <Badge tone="green">{question.teks}</Badge>
              </div>
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
                onClick={() => setRevealed((current) => ({ ...current, [question.id]: true }))}
              >
                Check practice answer
              </Button>

              {shown ? (
                <div className="mt-4 rounded-lg bg-white p-4">
                  <p className="font-black text-slate-950">
                    {isCorrect ? "Nice work." : `Not yet. Correct answer: ${question.answer}`}
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
    </section>
  );
}
