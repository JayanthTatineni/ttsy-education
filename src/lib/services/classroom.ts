import { GRADES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import type {
  AssignableLesson,
  EducatorClassAssignment,
  EducatorClassDetail,
  EducatorStudentGrowthRow,
  JoinedClass,
  LessonProgress,
  Profile,
  StudentClassAssignment,
  StudentClassDetail,
} from "@/types/domain";
import type { Tables } from "@/types/database";

function byId<T extends { id: string }>(rows: T[]) {
  return new Map(rows.map((row) => [row.id, row]));
}

function sortLessons(left: AssignableLesson, right: AssignableLesson) {
  if (left.grade_level !== right.grade_level) {
    return GRADES.indexOf(left.grade_level) - GRADES.indexOf(right.grade_level);
  }

  if (left.subject.name !== right.subject.name) {
    return left.subject.name.localeCompare(right.subject.name);
  }

  if (left.unit.sort_order !== right.unit.sort_order) {
    return left.unit.sort_order - right.unit.sort_order;
  }

  return left.sort_order - right.sort_order;
}

async function getLessonsWithContext(
  lessonIds: string[],
): Promise<Map<string, AssignableLesson>> {
  if (lessonIds.length === 0) {
    return new Map();
  }

  const supabase = await createClient();
  const { data: lessons, error: lessonsError } = await supabase
    .from("lessons")
    .select("*")
    .in("id", lessonIds)
    .order("grade_level", { ascending: true })
    .order("sort_order", { ascending: true });

  if (lessonsError) {
    throw new Error(lessonsError.message);
  }

  if (lessons.length === 0) {
    return new Map();
  }

  const unitIds = Array.from(new Set(lessons.map((lesson) => lesson.unit_id)));
  const subjectIds = Array.from(new Set(lessons.map((lesson) => lesson.subject_id)));
  const [unitsResponse, subjectsResponse] = await Promise.all([
    supabase.from("units").select("*").in("id", unitIds),
    supabase.from("subjects").select("*").in("id", subjectIds),
  ]);

  if (unitsResponse.error) {
    throw new Error(unitsResponse.error.message);
  }

  if (subjectsResponse.error) {
    throw new Error(subjectsResponse.error.message);
  }

  const unitsById = byId(unitsResponse.data);
  const subjectsById = byId(subjectsResponse.data);

  return new Map(
    lessons.flatMap((lesson) => {
      const unit = unitsById.get(lesson.unit_id);
      const subject = subjectsById.get(lesson.subject_id);

      if (!unit || !subject) {
        return [];
      }

      const lessonWithContext: AssignableLesson = { ...lesson, unit, subject };
      return [[lesson.id, lessonWithContext] as const];
    }),
  );
}

async function getAssignmentsWithLessons(classId: string) {
  const supabase = await createClient();
  const { data: assignments, error } = await supabase
    .from("class_assignments")
    .select("*")
    .eq("class_id", classId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const lessonsById = await getLessonsWithContext(assignments.map((assignment) => assignment.lesson_id));

  return assignments.flatMap((assignment) => {
    const lesson = lessonsById.get(assignment.lesson_id);
    return lesson ? [{ assignment, lesson }] : [];
  });
}

async function getAvailableLessonsForClassroom(
  classroom: Pick<Tables<"classes">, "grade_level" | "subject_focus">,
): Promise<AssignableLesson[]> {
  const supabase = await createClient();
  const { data: subjects, error: subjectsError } = await supabase.from("subjects").select("*");

  if (subjectsError) {
    throw new Error(subjectsError.message);
  }

  let lessonQuery = supabase
    .from("lessons")
    .select("*")
    .eq("is_published", true)
    .order("grade_level", { ascending: true })
    .order("sort_order", { ascending: true });

  if (classroom.grade_level) {
    lessonQuery = lessonQuery.eq("grade_level", classroom.grade_level);
  }

  if (classroom.subject_focus) {
    const focusedSubject = subjects.find((subject) => subject.slug === classroom.subject_focus);

    if (!focusedSubject) {
      return [];
    }

    lessonQuery = lessonQuery.eq("subject_id", focusedSubject.id);
  }

  const { data: lessons, error: lessonsError } = await lessonQuery;

  if (lessonsError) {
    throw new Error(lessonsError.message);
  }

  if (lessons.length === 0) {
    return [];
  }

  const unitsResponse = await supabase
    .from("units")
    .select("*")
    .in(
      "id",
      Array.from(new Set(lessons.map((lesson) => lesson.unit_id))),
    );

  if (unitsResponse.error) {
    throw new Error(unitsResponse.error.message);
  }

  const unitsById = byId(unitsResponse.data);
  const subjectsById = byId(subjects);

  return lessons
    .flatMap((lesson) => {
      const unit = unitsById.get(lesson.unit_id);
      const subject = subjectsById.get(lesson.subject_id);

      if (!unit || !subject) {
        return [];
      }

      const lessonWithContext: AssignableLesson = { ...lesson, unit, subject };
      return [lessonWithContext];
    })
    .sort(sortLessons);
}

export async function getStudentClasses(studentId: string): Promise<JoinedClass[]> {
  const supabase = await createClient();
  const { data: memberships, error: membershipError } = await supabase
    .from("class_memberships")
    .select("*")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });

  if (membershipError) {
    throw new Error(membershipError.message);
  }

  if (memberships.length === 0) {
    return [];
  }

  const classIds = memberships.map((membership) => membership.class_id);
  const [classesResponse, allMembershipsResponse] = await Promise.all([
    supabase.from("classes").select("*").in("id", classIds),
    supabase.from("class_memberships").select("*").in("class_id", classIds),
  ]);

  if (classesResponse.error) {
    throw new Error(classesResponse.error.message);
  }

  if (allMembershipsResponse.error) {
    throw new Error(allMembershipsResponse.error.message);
  }

  const educatorIds = Array.from(
    new Set(classesResponse.data.map((classroom) => classroom.educator_id)),
  );

  const { data: educators, error: educatorsError } = await supabase
    .from("profiles")
    .select("*")
    .in("id", educatorIds);

  if (educatorsError) {
    throw new Error(educatorsError.message);
  }

  const educatorsById = byId<Profile>(educators);
  const memberCountByClass = allMembershipsResponse.data.reduce<Map<string, number>>(
    (map, membership) => {
      map.set(membership.class_id, (map.get(membership.class_id) ?? 0) + 1);
      return map;
    },
    new Map(),
  );

  return classesResponse.data.flatMap((classroom) => {
    const educator = educatorsById.get(classroom.educator_id);
    if (!educator) {
      return [];
    }

    return [
      {
        ...classroom,
        educator,
        memberCount: memberCountByClass.get(classroom.id) ?? 0,
      },
    ];
  });
}

export async function getEducatorClasses(educatorId: string): Promise<JoinedClass[]> {
  const supabase = await createClient();
  const { data: classes, error } = await supabase
    .from("classes")
    .select("*")
    .eq("educator_id", educatorId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  if (classes.length === 0) {
    return [];
  }

  const { data: memberships, error: membershipError } = await supabase
    .from("class_memberships")
    .select("*")
    .in("class_id", classes.map((classroom) => classroom.id));

  if (membershipError) {
    throw new Error(membershipError.message);
  }

  const { data: educator, error: educatorError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", educatorId)
    .single();

  if (educatorError) {
    throw new Error(educatorError.message);
  }

  const memberCountByClass = memberships.reduce<Map<string, number>>((map, membership) => {
    map.set(membership.class_id, (map.get(membership.class_id) ?? 0) + 1);
    return map;
  }, new Map());

  return classes.map((classroom) => ({
    ...classroom,
    educator,
    memberCount: memberCountByClass.get(classroom.id) ?? 0,
  }));
}

export async function getEducatorClassDetail(
  classId: string,
  educatorId: string,
): Promise<EducatorClassDetail | null> {
  const supabase = await createClient();
  const { data: classroom, error } = await supabase
    .from("classes")
    .select("*")
    .eq("id", classId)
    .eq("educator_id", educatorId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!classroom) {
    return null;
  }

  const [membershipsResponse, educatorResponse, assignmentRows, availableLessons] = await Promise.all([
    supabase
      .from("class_memberships")
      .select("*")
      .eq("class_id", classId)
      .order("joined_at", { ascending: true }),
    supabase.from("profiles").select("*").eq("id", educatorId).single(),
    getAssignmentsWithLessons(classId),
    getAvailableLessonsForClassroom(classroom),
  ]);

  if (membershipsResponse.error) {
    throw new Error(membershipsResponse.error.message);
  }

  if (educatorResponse.error) {
    throw new Error(educatorResponse.error.message);
  }

  const memberships = membershipsResponse.data;
  const assignedLessonIds = new Set(assignmentRows.map(({ lesson }) => lesson.id));

  if (memberships.length === 0) {
    const assignments: EducatorClassAssignment[] = assignmentRows.map(({ assignment, lesson }) => ({
      ...assignment,
      lesson,
      performance: {
        assignedStudentCount: 0,
        completedStudentCount: 0,
        attemptedStudentCount: 0,
        averageBestScore: 0,
      },
    }));

    return {
      ...classroom,
      educator: educatorResponse.data,
      memberCount: 0,
      students: [],
      assignments,
      availableLessons,
    };
  }

  const studentIds = memberships.map((membership) => membership.student_id);
  const [studentsResponse, progressResponse, attemptsResponse] = await Promise.all([
    supabase.from("profiles").select("*").in("id", studentIds),
    supabase.from("lesson_progress").select("*").in("student_id", studentIds),
    supabase
      .from("lesson_attempts")
      .select("*")
      .in("student_id", studentIds)
      .order("created_at", { ascending: false }),
  ]);

  if (studentsResponse.error) {
    throw new Error(studentsResponse.error.message);
  }

  if (progressResponse.error) {
    throw new Error(progressResponse.error.message);
  }

  if (attemptsResponse.error) {
    throw new Error(attemptsResponse.error.message);
  }

  const studentsById = byId<Profile>(studentsResponse.data);
  const growthRows: EducatorStudentGrowthRow[] = memberships.flatMap((membership) => {
    const student = studentsById.get(membership.student_id);

    if (!student) {
      return [];
    }

    const progress = progressResponse.data.filter((item) => item.student_id === student.id);
    const assignedProgress = progress.filter((item) => assignedLessonIds.has(item.lesson_id));
    const attempts = attemptsResponse.data.filter((item) => item.student_id === student.id);
    const totalBestScore = progress.reduce((sum, item) => sum + item.best_score, 0);
    const assignedBestScore = assignedProgress.reduce((sum, item) => sum + item.best_score, 0);
    const latestActivityAt = attempts[0]?.created_at ?? progress[0]?.updated_at ?? null;

    return [
      {
        student,
        membership,
        completedLessons: progress.filter((item) => item.completed).length,
        attemptedLessons: progress.length,
        averageBestScore: progress.length > 0 ? Math.round(totalBestScore / progress.length) : 0,
        assignedCompletedLessons: assignedProgress.filter((item) => item.completed).length,
        assignedAttemptedLessons: assignedProgress.length,
        assignedAverageBestScore:
          assignedProgress.length > 0 ? Math.round(assignedBestScore / assignedProgress.length) : 0,
        latestActivityAt,
      },
    ];
  });

  const progressByLesson = progressResponse.data.reduce<Map<string, LessonProgress[]>>((map, item) => {
    map.set(item.lesson_id, [...(map.get(item.lesson_id) ?? []), item]);
    return map;
  }, new Map());

  const assignments: EducatorClassAssignment[] = assignmentRows.map(({ assignment, lesson }) => {
    const lessonProgress = progressByLesson.get(lesson.id) ?? [];
    const totalBestScore = lessonProgress.reduce((sum, item) => sum + item.best_score, 0);

    return {
      ...assignment,
      lesson,
      performance: {
        assignedStudentCount: memberships.length,
        completedStudentCount: lessonProgress.filter((item) => item.completed).length,
        attemptedStudentCount: lessonProgress.length,
        averageBestScore: lessonProgress.length > 0 ? Math.round(totalBestScore / lessonProgress.length) : 0,
      },
    };
  });

  return {
    ...classroom,
    educator: educatorResponse.data,
    memberCount: memberships.length,
    students: growthRows,
    assignments,
    availableLessons,
  };
}

export async function getStudentClassDetail(
  classId: string,
  studentId: string,
): Promise<StudentClassDetail | null> {
  const classes = await getStudentClasses(studentId);
  const classroom = classes.find((item) => item.id === classId);

  if (!classroom) {
    return null;
  }

  const assignmentRows = await getAssignmentsWithLessons(classId);

  if (assignmentRows.length === 0) {
    return {
      ...classroom,
      assignments: [],
    };
  }

  const supabase = await createClient();
  const { data: progressRows, error: progressError } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("student_id", studentId)
    .in(
      "lesson_id",
      assignmentRows.map(({ lesson }) => lesson.id),
    );

  if (progressError) {
    throw new Error(progressError.message);
  }

  const progressByLesson = new Map(progressRows.map((row) => [row.lesson_id, row]));
  const assignments: StudentClassAssignment[] = assignmentRows.map(({ assignment, lesson }) => ({
    ...assignment,
    lesson,
    progress: progressByLesson.get(lesson.id) ?? null,
  }));

  return {
    ...classroom,
    assignments,
  };
}
