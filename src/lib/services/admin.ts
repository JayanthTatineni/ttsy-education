import { createClient } from "@/lib/supabase/server";
import { getLessonSummaries, getSubjects, getUnits } from "@/lib/services/lessons";

export async function getAdminLessonList() {
  return getLessonSummaries({ includeUnpublished: true });
}

export async function getAdminCatalogOptions() {
  const [subjects, units] = await Promise.all([getSubjects(), getUnits()]);

  return { subjects, units };
}

export async function getAdminLessonById(id: string) {
  const supabase = await createClient();
  const { data: lesson, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!lesson) {
    return null;
  }

  const [subjectsResponse, unitsResponse, questionsResponse] = await Promise.all([
    supabase.from("subjects").select("*").order("name", { ascending: true }),
    supabase.from("units").select("*").order("sort_order", { ascending: true }),
    supabase
      .from("questions")
      .select("*")
      .eq("lesson_id", id)
      .order("sort_order", { ascending: true }),
  ]);

  if (subjectsResponse.error) {
    throw new Error(subjectsResponse.error.message);
  }

  if (unitsResponse.error) {
    throw new Error(unitsResponse.error.message);
  }

  if (questionsResponse.error) {
    throw new Error(questionsResponse.error.message);
  }

  return {
    lesson,
    subjects: subjectsResponse.data,
    units: unitsResponse.data,
    questions: questionsResponse.data,
  };
}
