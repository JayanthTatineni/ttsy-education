"use server";

import { revalidatePath } from "next/cache";
import { requireEducator, requireStudent } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import {
  assignLessonSchema,
  assignStudentSchema,
  createClassSchema,
  joinClassSchema,
  type AssignLessonValues,
  type AssignStudentValues,
  type CreateClassValues,
  type JoinClassValues,
} from "@/lib/validation/classroom";

export type ClassroomActionState = {
  ok: boolean;
  message: string;
  id?: string;
};

function randomJoinCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

async function generateUniqueJoinCode() {
  const supabase = await createClient();

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const joinCode = randomJoinCode();
    const { data, error } = await supabase
      .from("classes")
      .select("id")
      .eq("join_code", joinCode)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return joinCode;
    }
  }

  throw new Error("Could not create a unique class code right now.");
}

export async function createClassAction(
  values: CreateClassValues,
): Promise<ClassroomActionState> {
  const educator = await requireEducator();
  const parsed = createClassSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Check the class form.",
    };
  }

  const supabase = await createClient();
  const joinCode = await generateUniqueJoinCode();

  const response = await supabase
    .from("classes")
    .insert({
      educator_id: educator.id,
      name: parsed.data.name,
      description: parsed.data.description || "",
      grade_level: parsed.data.gradeLevel ?? null,
      subject_focus: parsed.data.subjectFocus ?? null,
      join_code: joinCode,
    })
    .select("id")
    .single();

  if (response.error) {
    return { ok: false, message: response.error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/classes");
  return {
    ok: true,
    message: `Class created. Share code ${joinCode} with students.`,
    id: response.data.id,
  };
}

export async function joinClassAction(
  values: JoinClassValues,
): Promise<ClassroomActionState> {
  await requireStudent();
  const parsed = joinClassSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Enter a valid class code.",
    };
  }

  const supabase = await createClient();
  const { data: classId, error: joinError } = await supabase.rpc("join_class_by_code", {
    target_join_code: parsed.data.joinCode,
  });

  if (joinError) {
    if (joinError.message.includes("join_class_by_code")) {
      return {
        ok: false,
        message: "Class joins are not set up in Supabase yet. Run the latest schema.sql, then try again.",
      };
    }

    return { ok: false, message: joinError.message };
  }

  const { data: classroom, error: classError } = await supabase
    .from("classes")
    .select("id,name")
    .eq("id", classId)
    .maybeSingle();

  if (classError) {
    return { ok: false, message: classError.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/classes");
  revalidatePath(`/dashboard/classes/${classId}`);

  return {
    ok: true,
    message: `Joined ${classroom?.name ?? "the class"}.`,
    id: classId,
  };
}

export async function assignStudentToClassAction(
  classId: string,
  values: AssignStudentValues,
): Promise<ClassroomActionState> {
  await requireEducator();
  const parsed = assignStudentSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Enter a valid student email.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("assign_student_to_class", {
    target_class_id: classId,
    target_student_email: parsed.data.email,
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/classes");
  revalidatePath(`/dashboard/classes/${classId}`);

  return {
    ok: true,
    message: `Added ${parsed.data.email} to the class.`,
    id: classId,
  };
}

export async function assignLessonToClassAction(
  classId: string,
  values: AssignLessonValues,
): Promise<ClassroomActionState> {
  const educator = await requireEducator();
  const parsed = assignLessonSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Choose a lesson to assign.",
    };
  }

  const supabase = await createClient();
  const { data: classroom, error: classError } = await supabase
    .from("classes")
    .select("id, grade_level, subject_focus")
    .eq("id", classId)
    .eq("educator_id", educator.id)
    .maybeSingle();

  if (classError) {
    return { ok: false, message: classError.message };
  }

  if (!classroom) {
    return { ok: false, message: "That class was not found." };
  }

  const { data: lesson, error: lessonError } = await supabase
    .from("lessons")
    .select("id, title, grade_level, subject_id, is_published")
    .eq("id", parsed.data.lessonId)
    .maybeSingle();

  if (lessonError) {
    return { ok: false, message: lessonError.message };
  }

  if (!lesson || !lesson.is_published) {
    return { ok: false, message: "That lesson is not available to assign." };
  }

  const { data: subject, error: subjectError } = await supabase
    .from("subjects")
    .select("slug")
    .eq("id", lesson.subject_id)
    .maybeSingle();

  if (subjectError) {
    return { ok: false, message: subjectError.message };
  }

  if (!subject) {
    return { ok: false, message: "The lesson subject could not be found." };
  }

  if (classroom.grade_level && lesson.grade_level !== classroom.grade_level) {
    return {
      ok: false,
      message: "This lesson does not match the class grade level.",
    };
  }

  if (classroom.subject_focus && subject.slug !== classroom.subject_focus) {
    return {
      ok: false,
      message: "This lesson does not match the class subject focus.",
    };
  }

  const { error: assignmentError } = await supabase.from("class_assignments").insert({
    class_id: classId,
    lesson_id: lesson.id,
    assigned_by: educator.id,
  });

  if (assignmentError) {
    if (assignmentError.code === "23505") {
      return { ok: false, message: "That lesson is already assigned to this class." };
    }

    return { ok: false, message: assignmentError.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/classes");
  revalidatePath(`/dashboard/classes/${classId}`);

  return {
    ok: true,
    message: `Assigned ${lesson.title}.`,
    id: classId,
  };
}
