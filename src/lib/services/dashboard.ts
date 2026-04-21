import { getEducatorClasses, getStudentClasses } from "@/lib/services/classroom";
import {
  getAllCourseSummaries,
  getLessonSummaries,
  getSelectedCourseSummaries,
  getStudentProgress,
} from "@/lib/services/lessons";
import { createClient } from "@/lib/supabase/server";
import type { DashboardStats, GradeLevel } from "@/types/domain";

export async function getStudentDashboardData(studentId: string, gradeLevel?: GradeLevel | null) {
  const supabase = await createClient();
  const [lessons, progressRows, attemptsResponse, allCourses, selectedCourses, classes] = await Promise.all([
    getLessonSummaries({ studentId }),
    getStudentProgress(studentId),
    supabase
      .from("lesson_attempts")
      .select("*")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false })
      .limit(5),
    getAllCourseSummaries(studentId),
    getSelectedCourseSummaries(studentId),
    getStudentClasses(studentId),
  ]);

  if (attemptsResponse.error) {
    throw new Error(attemptsResponse.error.message);
  }

  const totalBestScore = progressRows.reduce(
    (sum, item) => sum + item.progress.best_score,
    0,
  );

  const stats: DashboardStats = {
    totalLessons: lessons.length,
    attemptedLessons: progressRows.length,
    completedLessons: progressRows.filter((item) => item.progress.completed).length,
    averageBestScore:
      progressRows.length > 0 ? Math.round(totalBestScore / progressRows.length) : 0,
  };

  const lessonsById = new Map(lessons.map((lesson) => [lesson.id, lesson]));
  const suggestedCourses = gradeLevel
    ? allCourses.filter((course) => course.unit.grade_level === gradeLevel)
    : allCourses;
  const homeCourses = selectedCourses.length > 0 ? selectedCourses : suggestedCourses;
  const recentAttempt = attemptsResponse.data.find((attempt) => lessonsById.has(attempt.lesson_id));
  const featuredCourse =
    (recentAttempt
      ? homeCourses.find((course) =>
          course.lessons.some((lesson) => lesson.id === recentAttempt.lesson_id),
        )
      : null) ??
    homeCourses.find((course) => course.completedCount < course.lessonCount) ??
    homeCourses[0] ??
    null;

  return {
    stats,
    selectedCourses,
    suggestedCourses,
    homeCourses,
    featuredCourse,
    classes,
  };
}

export async function getEducatorDashboardData(educatorId: string) {
  const classes = await getEducatorClasses(educatorId);
  const classIds = classes.map((classroom) => classroom.id);

  if (classIds.length === 0) {
    return {
      classes,
      classCount: 0,
      studentCount: 0,
      averageClassSize: 0,
    };
  }

  const supabase = await createClient();
  const { data: memberships, error } = await supabase
    .from("class_memberships")
    .select("*")
    .in("class_id", classIds);

  if (error) {
    throw new Error(error.message);
  }

  const studentCount = new Set(memberships.map((membership) => membership.student_id)).size;

  return {
    classes,
    classCount: classes.length,
    studentCount,
    averageClassSize: classes.length > 0 ? Math.round(memberships.length / classes.length) : 0,
  };
}
