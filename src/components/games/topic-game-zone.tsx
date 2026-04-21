"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTopicGameForLesson } from "@/lib/games/topic-games";
import type { LessonDetail } from "@/types/domain";

export function TopicGameZone({ lesson }: { lesson: LessonDetail }) {
  const game = useMemo(() => getTopicGameForLesson(lesson), [lesson]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  if (!game) {
    return null;
  }

  const round = game.rounds[roundIndex];
  const finished = roundIndex >= game.rounds.length;

  if (finished) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <Badge tone="green">Game complete</Badge>
        <h2 className="mt-3 text-3xl font-black text-slate-950">{game.title}</h2>
        <p className="mt-2 text-lg leading-8 text-slate-600">
          You finished with {score} out of {game.rounds.length}.
        </p>
        <Button
          className="mt-5"
          onClick={() => {
            setRoundIndex(0);
            setScore(0);
            setSelected(null);
            setChecked(false);
          }}
        >
          Play again
        </Button>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge tone="yellow">Game lab</Badge>
          <h2 className="mt-3 text-3xl font-black text-slate-950">{game.title}</h2>
          <p className="mt-2 text-base leading-7 text-slate-600">{game.subtitle}</p>
        </div>
        <div className="text-sm font-black text-slate-600">
          Round {roundIndex + 1}/{game.rounds.length} · Score {score}
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-slate-50 p-5">
        <p className="text-sm font-black uppercase tracking-wide text-emerald-700">
          {game.goal}
        </p>
        <p className="mt-3 text-2xl font-black text-slate-950">{round.prompt}</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {round.options.map((option) => (
            <button
              key={option}
              type="button"
              className={`rounded-lg border px-4 py-4 text-left text-lg font-black transition ${
                selected === option
                  ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                  : "border-slate-300 bg-white text-slate-800 hover:border-sky-300"
              }`}
              onClick={() => setSelected(option)}
            >
              {option}
            </button>
          ))}
        </div>

        {!checked ? (
          <Button
            className="mt-5"
            disabled={!selected}
            onClick={() => {
              setChecked(true);
              if (selected === round.correctAnswer) {
                setScore((value) => value + 1);
              }
            }}
          >
            Check move
          </Button>
        ) : (
          <div className="mt-5 rounded-lg bg-white p-4">
            <p className="font-black text-slate-950">
              {selected === round.correctAnswer
                ? round.celebration
                : `Nice try. The right answer is ${round.correctAnswer}.`}
            </p>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => {
                setRoundIndex((value) => value + 1);
                setSelected(null);
                setChecked(false);
              }}
            >
              {roundIndex + 1 === game.rounds.length ? "Finish game" : "Next round"}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
