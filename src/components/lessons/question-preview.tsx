import { Badge } from "@/components/ui/badge";
import type { Question } from "@/types/domain";

function answerOptions(question: Question) {
  return Array.isArray(question.answer_options)
    ? question.answer_options.filter((option): option is string => typeof option === "string")
    : [];
}

export function QuestionPreview({ questions }: { questions: Question[] }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <Badge tone="blue">Question preview</Badge>
      <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
        Preview the checks
      </h2>
      <p className="mt-2 text-base leading-7 text-slate-600">
        Educator view shows the question flow without saving student progress.
      </p>
      <div className="mt-6 space-y-5">
        {questions.map((question, index) => (
          <div key={question.id} className="rounded-lg bg-slate-50 p-5">
            <div className="flex flex-wrap gap-2">
              <Badge>Question {index + 1}</Badge>
              <Badge tone="green">{question.skill_tag}</Badge>
            </div>
            <p className="mt-4 text-xl font-black leading-8 text-slate-950">
              {question.prompt}
            </p>
            {question.image_url ? (
              <img src={question.image_url} alt="" className="mt-4 max-h-64 w-full rounded-lg object-cover" />
            ) : null}
            {question.type === "numeric" ? (
              <div className="mt-4 rounded-lg border border-slate-300 bg-white px-4 py-3 text-lg font-bold text-slate-500">
                Numeric response
              </div>
            ) : (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {(question.type === "true_false" ? ["true", "false"] : answerOptions(question)).map((option) => (
                  <div
                    key={option}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-3 font-bold text-slate-800"
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
