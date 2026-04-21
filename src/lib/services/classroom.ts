import { createClient } from "@/lib/supabase/server";
import type {
  EducatorClassDetail,
  EducatorStudentGrowthRow,
  JoinedClass,
  Profile,
} from "@/types/domain";

function byId<T extends { id: string }>(rows: T[]) {
  return new Map(rows.map((row) => [row.id, row]));
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

  const { data: memberships, error: membershipError } = await supabase
    .from("class_memberships")
    .select("*")
    .eq("class_id", classId)
    .order("joined_at", { ascending: true });

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

  if (memberships.length === 0) {
    return {
      ...classroom,
      educator,
      memberCount: 0,
      students: [],
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
    const attempts = attemptsResponse.data.filter((item) => item.student_id === student.id);
    const totalBestScore = progress.reduce((sum, item) => sum + item.best_score, 0);
    const latestActivityAt = attempts[0]?.created_at ?? progress[0]?.updated_at ?? null;

    return [
      {
        student,
        membership,
        completedLessons: progress.filter((item) => item.completed).length,
        attemptedLessons: progress.length,
        averageBestScore: progress.length > 0 ? Math.round(totalBestScore / progress.length) : 0,
        latestActivityAt,
      },
    ];
  });

  return {
    ...classroom,
    educator,
    memberCount: memberships.length,
    students: growthRows,
  };
}
