"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { deleteQuestionAction, saveQuestionAction } from "@/actions/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DIFFICULTIES, QUESTION_TYPES } from "@/lib/constants";
import {
  questionSchema,
  type QuestionFormInput,
  type QuestionFormValues,
} from "@/lib/validation/lesson";
import type { Question } from "@/types/domain";

function optionsToText(question?: Question) {
  return Array.isArray(question?.answer_options)
    ? question.answer_options
        .filter((option): option is string => typeof option === "string")
        .join("\n")
    : "";
}

export function QuestionManager({
  lessonId,
  questions,
}: {
  lessonId: string;
  questions: Question[];
}) {
  const [editing, setEditing] = useState<Question | null>(null);
  const [optionsText, setOptionsText] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<QuestionFormInput, unknown, QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      lessonId,
      type: "multiple_choice",
      prompt: "",
      imageUrl: "",
      explanation: "",
      correctAnswer: "",
      answerOptions: [],
      difficulty: "easy",
      skillTag: "",
      sortOrder: questions.length + 1,
    },
  });

  const type = useWatch({ control: form.control, name: "type" });

  function startEditing(question: Question) {
    setEditing(question);
    setOptionsText(optionsToText(question));
    form.reset({
      id: question.id,
      lessonId,
      type: question.type,
      prompt: question.prompt,
      imageUrl: question.image_url ?? "",
      explanation: question.explanation,
      correctAnswer: question.correct_answer,
      answerOptions: optionsToText(question)
        .split("\n")
        .map((option) => option.trim())
        .filter(Boolean),
      difficulty: question.difficulty,
      skillTag: question.skill_tag,
      sortOrder: question.sort_order,
    });
  }

  function resetForm() {
    setEditing(null);
    setOptionsText("");
    form.reset({
      lessonId,
      type: "multiple_choice",
      prompt: "",
      imageUrl: "",
      explanation: "",
      correctAnswer: "",
      answerOptions: [],
      difficulty: "easy",
      skillTag: "",
      sortOrder: questions.length + 1,
    });
  }

  const onSubmit = form.handleSubmit((values) => {
    setMessage(null);
    const answerOptions = optionsText
      .split("\n")
      .map((option) => option.trim())
      .filter(Boolean);

    startTransition(async () => {
      const result = await saveQuestionAction({ ...values, answerOptions });
      setMessage(result.message);
      if (result.ok) {
        resetForm();
      }
    });
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black text-slate-950">
          {editing ? "Edit question" : "Add question"}
        </h2>
        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <Field label="Question type" error={form.formState.errors.type?.message}>
            <select className="form-input" {...form.register("type")}>
              {QUESTION_TYPES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Prompt" error={form.formState.errors.prompt?.message}>
            <textarea className="form-input min-h-24" {...form.register("prompt")} />
          </Field>
          <Field label="Optional image URL" error={form.formState.errors.imageUrl?.message}>
            <input className="form-input" {...form.register("imageUrl")} />
          </Field>
          {type === "multiple_choice" ? (
            <Field label="Answer choices, one per line" error={form.formState.errors.answerOptions?.message}>
              <textarea
                className="form-input min-h-28"
                value={optionsText}
                onChange={(event) => setOptionsText(event.target.value)}
              />
            </Field>
          ) : null}
          <Field label="Correct answer" error={form.formState.errors.correctAnswer?.message}>
            <input className="form-input" {...form.register("correctAnswer")} />
          </Field>
          <Field label="Explanation" error={form.formState.errors.explanation?.message}>
            <textarea className="form-input min-h-24" {...form.register("explanation")} />
          </Field>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Difficulty" error={form.formState.errors.difficulty?.message}>
              <select className="form-input" {...form.register("difficulty")}>
                {DIFFICULTIES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Skill tag" error={form.formState.errors.skillTag?.message}>
              <input className="form-input" {...form.register("skillTag")} />
            </Field>
            <Field label="Sort" error={form.formState.errors.sortOrder?.message}>
              <input
                type="number"
                className="form-input"
                {...form.register("sortOrder", { valueAsNumber: true })}
              />
            </Field>
          </div>
          {message ? (
            <p className="rounded-lg bg-slate-100 px-4 py-3 font-bold text-slate-700">
              {message}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : editing ? "Update question" : "Add question"}
            </Button>
            {editing ? (
              <Button variant="outline" onClick={resetForm}>
                Cancel edit
              </Button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="space-y-4">
        {questions.map((question) => (
          <div key={question.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap gap-2">
              <Badge tone="blue">{question.type.replace("_", " ")}</Badge>
              <Badge tone="green">{question.skill_tag}</Badge>
              <Badge>{question.difficulty}</Badge>
            </div>
            <h3 className="mt-3 text-lg font-black text-slate-950">{question.prompt}</h3>
            <p className="mt-2 text-sm font-bold text-slate-600">
              Correct: {question.correct_answer}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{question.explanation}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => startEditing(question)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="danger"
                disabled={isPending}
                onClick={() => {
                  startTransition(async () => {
                    const result = await deleteQuestionAction(question.id, lessonId);
                    setMessage(result.message);
                  });
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <div className="mt-1">{children}</div>
      {error ? <p className="mt-1 text-sm font-bold text-rose-700">{error}</p> : null}
    </label>
  );
}
