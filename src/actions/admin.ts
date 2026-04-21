"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import {
  lessonSchema,
  questionSchema,
  type LessonFormValues,
  type QuestionFormValues,
} from "@/lib/validation/lesson";

export type AdminActionState = {
  ok: boolean;
  message: string;
  id?: string;
};

export async function saveLessonAction(values: LessonFormValues): Promise<AdminActionState> {
  await requireAdmin();
  const parsed = lessonSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Check the lesson form.",
    };
  }

  const supabase = await createClient();
  const payload = {
    title: parsed.data.title,
    slug: slugify(parsed.data.slug || parsed.data.title),
    description: parsed.data.description,
    grade_level: parsed.data.gradeLevel,
    subject_id: parsed.data.subjectId,
    unit_id: parsed.data.unitId,
    video_url: parsed.data.videoUrl,
    thumbnail_url: parsed.data.thumbnailUrl || null,
    estimated_minutes: parsed.data.estimatedMinutes,
    sort_order: parsed.data.sortOrder,
    is_published: parsed.data.isPublished,
  };

  const response = parsed.data.id
    ? await supabase
        .from("lessons")
        .update(payload)
        .eq("id", parsed.data.id)
        .select("id")
        .single()
    : await supabase.from("lessons").insert(payload).select("id").single();

  if (response.error) {
    return { ok: false, message: response.error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/lessons");
  revalidatePath("/learn");

  return {
    ok: true,
    message: parsed.data.id ? "Lesson updated." : "Lesson created.",
    id: response.data.id,
  };
}

export async function toggleLessonPublishAction(
  lessonId: string,
  isPublished: boolean,
): Promise<AdminActionState> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("lessons")
    .update({ is_published: isPublished })
    .eq("id", lessonId);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/admin/lessons");
  revalidatePath("/learn");
  return { ok: true, message: isPublished ? "Lesson published." : "Lesson unpublished." };
}

export async function saveQuestionAction(
  values: QuestionFormValues,
): Promise<AdminActionState> {
  await requireAdmin();
  const parsed = questionSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Check the question form.",
    };
  }

  const supabase = await createClient();
  const payload = {
    lesson_id: parsed.data.lessonId,
    type: parsed.data.type,
    prompt: parsed.data.prompt,
    image_url: parsed.data.imageUrl || null,
    explanation: parsed.data.explanation,
    correct_answer: parsed.data.correctAnswer.trim(),
    answer_options:
      parsed.data.type === "multiple_choice"
        ? parsed.data.answerOptions.map((option) => option.trim())
        : [],
    difficulty: parsed.data.difficulty,
    skill_tag: parsed.data.skillTag,
    sort_order: parsed.data.sortOrder,
  };

  const response = parsed.data.id
    ? await supabase
        .from("questions")
        .update(payload)
        .eq("id", parsed.data.id)
        .select("id")
        .single()
    : await supabase.from("questions").insert(payload).select("id").single();

  if (response.error) {
    return { ok: false, message: response.error.message };
  }

  revalidatePath(`/admin/lessons/${parsed.data.lessonId}/edit`);
  revalidatePath("/admin/lessons");
  revalidatePath("/learn");

  return {
    ok: true,
    message: parsed.data.id ? "Question updated." : "Question added.",
    id: response.data.id,
  };
}

export async function deleteQuestionAction(
  questionId: string,
  lessonId: string,
): Promise<AdminActionState> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("questions").delete().eq("id", questionId);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath(`/admin/lessons/${lessonId}/edit`);
  revalidatePath("/admin/lessons");
  revalidatePath("/learn");

  return { ok: true, message: "Question deleted." };
}
