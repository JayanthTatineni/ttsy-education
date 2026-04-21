"use server";

import { revalidatePath } from "next/cache";
import { requireStudent } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import {
  courseSelectionSchema,
  type CourseSelectionValues,
} from "@/lib/validation/courses";

export type CourseSelectionActionState = {
  ok: boolean;
  message: string;
};

export async function updateCourseSelectionAction(
  values: CourseSelectionValues,
): Promise<CourseSelectionActionState> {
  const student = await requireStudent();
  const parsed = courseSelectionSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Choose a valid course.",
    };
  }

  const supabase = await createClient();

  if (parsed.data.selected) {
    const { error } = await supabase.from("student_course_selections").upsert(
      {
        student_id: student.id,
        unit_id: parsed.data.unitId,
      },
      { onConflict: "student_id,unit_id" },
    );

    if (error) {
      return { ok: false, message: error.message };
    }
  } else {
    const { error } = await supabase
      .from("student_course_selections")
      .delete()
      .eq("student_id", student.id)
      .eq("unit_id", parsed.data.unitId);

    if (error) {
      return { ok: false, message: error.message };
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/courses");
  return {
    ok: true,
    message: parsed.data.selected ? "Course added to your home." : "Course removed from your home.",
  };
}
