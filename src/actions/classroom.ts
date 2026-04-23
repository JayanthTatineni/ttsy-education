"use server";

import { revalidatePath } from "next/cache";
import { requireEducator, requireStudent } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import {
  assignStudentSchema,
  createClassSchema,
  joinClassSchema,
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
  const student = await requireStudent();
  const parsed = joinClassSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Enter a valid class code.",
    };
  }

  const supabase = await createClient();
  const { data: classroom, error: classError } = await supabase
    .from("classes")
    .select("id,name")
    .eq("join_code", parsed.data.joinCode)
    .maybeSingle();

  if (classError) {
    return { ok: false, message: classError.message };
  }

  if (!classroom) {
    return { ok: false, message: "That class code was not found." };
  }

  const { data: existingMembership, error: existingMembershipError } = await supabase
    .from("class_memberships")
    .select("id")
    .eq("class_id", classroom.id)
    .eq("student_id", student.id)
    .maybeSingle();

  if (existingMembershipError) {
    return { ok: false, message: existingMembershipError.message };
  }

  if (existingMembership) {
    return {
      ok: true,
      message: `You are already in ${classroom.name}.`,
      id: classroom.id,
    };
  }

  const { error } = await supabase.from("class_memberships").insert({
    class_id: classroom.id,
    student_id: student.id,
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/classes");
  return {
    ok: true,
    message: `Joined ${classroom.name}.`,
    id: classroom.id,
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
