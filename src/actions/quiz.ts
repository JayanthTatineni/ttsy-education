"use server";

import { revalidatePath } from "next/cache";
import { COMPLETION_SCORE } from "@/lib/constants";
import { requireStudent } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { isNumericMatch, normalizeAnswer } from "@/lib/utils";
import type { QuestionType } from "@/types/domain";
import type { QuizResult, QuizSubmission } from "@/types/domain";

function isCorrectAnswer(type: QuestionType, selected: string, correct: string) {
  if (type === "numeric") {
    return isNumericMatch(selected, correct);
  }

  return normalizeAnswer(selected) === normalizeAnswer(correct);
}

export async function submitQuizAction(submission: QuizSubmission): Promise<QuizResult> {
  const profile = await requireStudent();
  const supabase = await createClient();

  const { data: lesson, error: lessonError } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", submission.lessonId)
    .eq("is_published", true)
    .single();

  if (lessonError) {
    throw new Error("This lesson is not available.");
  }

  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select("*")
    .eq("lesson_id", lesson.id)
    .order("sort_order", { ascending: true });

  if (questionsError) {
    throw new Error(questionsError.message);
  }

  if (questions.length === 0) {
    throw new Error("This lesson does not have quiz questions yet.");
  }

  const results = questions.map((question) => {
    const selectedAnswer = submission.answers[question.id] ?? "";
    const isCorrect = isCorrectAnswer(
      question.type,
      selectedAnswer,
      question.correct_answer,
    );

    return {
      questionId: question.id,
      selectedAnswer,
      correctAnswer: question.correct_answer,
      isCorrect,
      explanation: question.explanation,
    };
  });

  const correctAnswers = results.filter((result) => result.isCorrect).length;
  const score = Math.round((correctAnswers / questions.length) * 100);
  const completed = score >= COMPLETION_SCORE;
  const now = new Date().toISOString();

  const { data: attempt, error: attemptError } = await supabase
    .from("lesson_attempts")
    .insert({
      student_id: profile.id,
      lesson_id: lesson.id,
      score,
      total_questions: questions.length,
      correct_answers: correctAnswers,
      completed,
      started_at: now,
      completed_at: now,
    })
    .select("*")
    .single();

  if (attemptError) {
    throw new Error(attemptError.message);
  }

  const questionAttempts = results.map((result) => ({
    lesson_attempt_id: attempt.id,
    question_id: result.questionId,
    student_id: profile.id,
    selected_answer: result.selectedAnswer,
    is_correct: result.isCorrect,
    answered_at: now,
  }));

  const { error: questionAttemptError } = await supabase
    .from("question_attempts")
    .insert(questionAttempts);

  if (questionAttemptError) {
    throw new Error(questionAttemptError.message);
  }

  const { data: existingProgress, error: progressLookupError } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("student_id", profile.id)
    .eq("lesson_id", lesson.id)
    .maybeSingle();

  if (progressLookupError) {
    throw new Error(progressLookupError.message);
  }

  const { error: progressError } = await supabase.from("lesson_progress").upsert(
    {
      student_id: profile.id,
      lesson_id: lesson.id,
      best_score: Math.max(existingProgress?.best_score ?? 0, score),
      last_score: score,
      completed: Boolean(existingProgress?.completed || completed),
      times_attempted: (existingProgress?.times_attempted ?? 0) + 1,
      last_attempted_at: now,
      updated_at: now,
    },
    { onConflict: "student_id,lesson_id" },
  );

  if (progressError) {
    throw new Error(progressError.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/progress");
  revalidatePath("/learn");

  return {
    attemptId: attempt.id,
    score,
    correctAnswers,
    totalQuestions: questions.length,
    completed,
    results,
  };
}
