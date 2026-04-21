import { cache } from "react";
import { GRADES, STARTER_TEXAS_TOPICS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { makeCourseSlug } from "@/lib/utils";
import type {
  CourseDetail,
  CourseSummary,
  GradeLevel,
  LessonDetail,
  LessonProgress,
  LessonSequenceItem,
  LessonSummary,
  Question,
  Subject,
  Unit,
} from "@/types/domain";

function byId<T extends { id: string }>(rows: T[]) {
  return new Map(rows.map((row) => [row.id, row]));
}

function countQuestions(questions: Array<{ lesson_id: string }>) {
  return questions.reduce<Map<string, number>>((map, question) => {
    map.set(question.lesson_id, (map.get(question.lesson_id) ?? 0) + 1);
    return map;
  }, new Map());
}

function topicLabelsForCourse(subject: Subject, unit: Unit) {
  return STARTER_TEXAS_TOPICS[makeCourseSlug(subject.slug, unit.title)] ?? [];
}

function buildCourseSummaries(lessons: LessonSummary[]): CourseSummary[] {
  const grouped = lessons.reduce<Map<string, LessonSummary[]>>((map, lesson) => {
    const key = lesson.unit.id;
    map.set(key, [...(map.get(key) ?? []), lesson]);
    return map;
  }, new Map());

  return Array.from(grouped.values())
    .map((courseLessons) => {
      const [firstLesson] = courseLessons;
      const slug = makeCourseSlug(firstLesson.subject.slug, firstLesson.unit.title);
      const completedCount = courseLessons.filter((lesson) => lesson.progress?.completed).length;
      const totalBestScore = courseLessons.reduce(
        (sum, lesson) => sum + (lesson.progress?.best_score ?? 0),
        0,
      );

      return {
        slug,
        unit: firstLesson.unit,
        subject: firstLesson.subject,
        lessonCount: courseLessons.length,
        completedCount,
        totalBestScore,
        lessons: courseLessons.sort((a, b) => a.sort_order - b.sort_order),
        topicLabels: topicLabelsForCourse(firstLesson.subject, firstLesson.unit),
      };
    })
    .sort((left, right) => {
      if (left.unit.grade_level !== right.unit.grade_level) {
        return GRADES.indexOf(left.unit.grade_level) - GRADES.indexOf(right.unit.grade_level);
      }

      if (left.unit.sort_order !== right.unit.sort_order) {
        return left.unit.sort_order - right.unit.sort_order;
      }

      return left.subject.name.localeCompare(right.subject.name);
    });
}

export const getSubjects = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
});

export const getUnits = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("units")
    .select("*")
    .order("grade_level", { ascending: true })
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
});

export async function getUnitsForGradeSubject(grade: GradeLevel, subjectId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("units")
    .select("*")
    .eq("grade_level", grade)
    .eq("subject_id", subjectId)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export const getSubjectBySlug = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
});

type LessonQuery = {
  grade?: GradeLevel;
  subjectSlug?: string;
  studentId?: string;
  includeUnpublished?: boolean;
};

export async function getLessonSummaries({
  grade,
  subjectSlug,
  studentId,
  includeUnpublished = false,
}: LessonQuery = {}): Promise<LessonSummary[]> {
  const supabase = await createClient();
  const [subjectsResponse, unitsResponse] = await Promise.all([
    supabase.from("subjects").select("*"),
    supabase.from("units").select("*"),
  ]);

  if (subjectsResponse.error) {
    throw new Error(subjectsResponse.error.message);
  }

  if (unitsResponse.error) {
    throw new Error(unitsResponse.error.message);
  }

  const subjects = subjectsResponse.data;
  const units = unitsResponse.data;
  const subject = subjectSlug
    ? subjects.find((item) => item.slug === subjectSlug)
    : undefined;

  if (subjectSlug && !subject) {
    return [];
  }

  let lessonQuery = supabase
    .from("lessons")
    .select("*")
    .order("grade_level", { ascending: true })
    .order("sort_order", { ascending: true });

  if (!includeUnpublished) {
    lessonQuery = lessonQuery.eq("is_published", true);
  }

  if (grade) {
    lessonQuery = lessonQuery.eq("grade_level", grade);
  }

  if (subject) {
    lessonQuery = lessonQuery.eq("subject_id", subject.id);
  }

  const { data: lessons, error } = await lessonQuery;

  if (error) {
    throw new Error(error.message);
  }

  if (lessons.length === 0) {
    return [];
  }

  const lessonIds = lessons.map((lesson) => lesson.id);
  const [progressResponse, questionsResponse] = await Promise.all([
    studentId
      ? supabase
          .from("lesson_progress")
          .select("*")
          .eq("student_id", studentId)
          .in("lesson_id", lessonIds)
      : Promise.resolve({ data: [] as LessonProgress[], error: null }),
    supabase.from("questions").select("lesson_id").in("lesson_id", lessonIds),
  ]);

  if (progressResponse.error) {
    throw new Error(progressResponse.error.message);
  }

  if (questionsResponse.error) {
    throw new Error(questionsResponse.error.message);
  }

  const subjectsById = byId<Subject>(subjects);
  const unitsById = byId<Unit>(units);
  const progressByLesson = new Map(
    progressResponse.data.map((progress) => [progress.lesson_id, progress]),
  );
  const questionCounts = countQuestions(questionsResponse.data);

  return lessons.flatMap((lesson) => {
    const lessonSubject = subjectsById.get(lesson.subject_id);
    const unit = unitsById.get(lesson.unit_id);

    if (!lessonSubject || !unit) {
      return [];
    }

    return [
      {
        ...lesson,
        subject: lessonSubject,
        unit,
        progress: progressByLesson.get(lesson.id) ?? null,
        question_count: questionCounts.get(lesson.id) ?? 0,
      },
    ];
  });
}

export async function getCourseSummariesForGrade(
  grade: GradeLevel,
  studentId?: string,
): Promise<CourseSummary[]> {
  const courses = await getAllCourseSummaries(studentId);
  return courses.filter((course) => course.unit.grade_level === grade);
}

export async function getAllCourseSummaries(
  studentId?: string,
): Promise<CourseSummary[]> {
  const lessons = await getLessonSummaries({ studentId });
  return buildCourseSummaries(lessons);
}

export async function getSelectedCourseUnitIds(studentId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("student_course_selections")
    .select("unit_id")
    .eq("student_id", studentId);

  if (error) {
    throw new Error(error.message);
  }

  return data.map((row) => row.unit_id);
}

export async function getSelectedCourseSummaries(
  studentId: string,
): Promise<CourseSummary[]> {
  const [courses, selectedUnitIds] = await Promise.all([
    getAllCourseSummaries(studentId),
    getSelectedCourseUnitIds(studentId),
  ]);

  const selectedUnits = new Set(selectedUnitIds);
  return courses.filter((course) => selectedUnits.has(course.unit.id));
}

export async function getCourseBySlug(
  grade: GradeLevel,
  courseSlug: string,
  studentId?: string,
): Promise<CourseDetail | null> {
  const courses = await getCourseSummariesForGrade(grade, studentId);
  const course = courses.find((item) => item.slug === courseSlug);

  if (!course) {
    return null;
  }

  const firstIncomplete = course.lessons.find((lesson) => !lesson.progress?.completed);

  return {
    ...course,
    nextLessonId: firstIncomplete?.id ?? course.lessons[0]?.id ?? null,
  };
}

export async function getLessonSequenceForUnit(
  unitId: string,
  studentId?: string,
): Promise<LessonSequenceItem[]> {
  const lessons = await getLessonSummaries({ studentId });
  const unitLessons = lessons
    .filter((lesson) => lesson.unit_id === unitId)
    .sort((left, right) => left.sort_order - right.sort_order);

  let unlocked = true;
  const respectProgress = Boolean(studentId);

  return unitLessons.map((lesson, index) => {
    const item = {
      lesson,
      order: index + 1,
      locked: respectProgress ? !unlocked : false,
    };

    if (respectProgress && !lesson.progress?.completed) {
      unlocked = false;
    }

    return item;
  });
}

export async function getLessonBySlug({
  grade,
  subjectSlug,
  lessonSlug,
  studentId,
  includeUnpublished = false,
}: {
  grade: GradeLevel;
  subjectSlug: string;
  lessonSlug: string;
  studentId?: string;
  includeUnpublished?: boolean;
}): Promise<LessonDetail | null> {
  const supabase = await createClient();
  const subject = await getSubjectBySlug(subjectSlug);

  if (!subject) {
    return null;
  }

  let lessonQuery = supabase
    .from("lessons")
    .select("*")
    .eq("grade_level", grade)
    .eq("subject_id", subject.id)
    .eq("slug", lessonSlug);

  if (!includeUnpublished) {
    lessonQuery = lessonQuery.eq("is_published", true);
  }

  const { data: lesson, error } = await lessonQuery.maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!lesson) {
    return null;
  }

  const [unitResponse, questionsResponse, progressResponse] = await Promise.all([
    supabase.from("units").select("*").eq("id", lesson.unit_id).single(),
    supabase
      .from("questions")
      .select("*")
      .eq("lesson_id", lesson.id)
      .order("sort_order", { ascending: true }),
    studentId
      ? supabase
          .from("lesson_progress")
          .select("*")
          .eq("student_id", studentId)
          .eq("lesson_id", lesson.id)
          .maybeSingle()
      : Promise.resolve({ data: null as LessonProgress | null, error: null }),
  ]);

  if (unitResponse.error) {
    throw new Error(unitResponse.error.message);
  }

  if (questionsResponse.error) {
    throw new Error(questionsResponse.error.message);
  }

  if (progressResponse.error) {
    throw new Error(progressResponse.error.message);
  }

  return {
    ...lesson,
    subject,
    unit: unitResponse.data,
    questions: questionsResponse.data as Question[],
    progress: progressResponse.data,
  };
}

export async function getStudentProgress(studentId: string) {
  const supabase = await createClient();
  const [progressResponse, lessons] = await Promise.all([
    supabase
      .from("lesson_progress")
      .select("*")
      .eq("student_id", studentId)
      .order("last_attempted_at", { ascending: false }),
    getLessonSummaries({ studentId }),
  ]);

  if (progressResponse.error) {
    throw new Error(progressResponse.error.message);
  }

  const lessonById = new Map(lessons.map((lesson) => [lesson.id, lesson]));

  return progressResponse.data.flatMap((progress) => {
    const lesson = lessonById.get(progress.lesson_id);
    return lesson ? [{ progress, lesson }] : [];
  });
}
