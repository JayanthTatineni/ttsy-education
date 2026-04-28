import type {
  Difficulty,
  GradeLevel,
  ProfileRole,
  QuestionType,
  SubjectFocus,
  Tables,
} from "./database";

export type { Difficulty, GradeLevel, ProfileRole, QuestionType, SubjectFocus };

export type Subject = Tables<"subjects">;
export type Unit = Tables<"units">;
export type Lesson = Tables<"lessons">;
export type Question = Tables<"questions">;
export type Profile = Tables<"profiles">;
export type LessonProgress = Tables<"lesson_progress">;
export type LessonAttempt = Tables<"lesson_attempts">;
export type Class = Tables<"classes">;
export type ClassMembership = Tables<"class_memberships">;
export type ClassAssignment = Tables<"class_assignments">;
export type StudentCourseSelection = Tables<"student_course_selections">;

export type LessonSummary = Lesson & {
  subject: Subject;
  unit: Unit;
  progress?: LessonProgress | null;
  question_count?: number;
};

export type LessonDetail = Lesson & {
  subject: Subject;
  unit: Unit;
  questions: Question[];
  progress?: LessonProgress | null;
};

export type CourseSummary = {
  slug: string;
  unit: Unit;
  subject: Subject;
  lessonCount: number;
  completedCount: number;
  totalBestScore: number;
  lessons: LessonSummary[];
  topicLabels: string[];
};

export type CourseDetail = CourseSummary & {
  nextLessonId?: string | null;
};

export type LessonSequenceItem = {
  lesson: LessonSummary;
  order: number;
  locked: boolean;
};

export type DashboardStats = {
  totalLessons: number;
  attemptedLessons: number;
  completedLessons: number;
  averageBestScore: number;
};

export type QuizSubmission = {
  lessonId: string;
  answers: Record<string, string>;
};

export type QuizResult = {
  attemptId: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  completed: boolean;
  results: Array<{
    questionId: string;
    selectedAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string;
  }>;
};

export type PracticeQuestion = {
  id: string;
  teks: string;
  prompt: string;
  type: QuestionType;
  options?: string[];
  answer: string;
  explanation: string;
};

export type GameRound = {
  prompt: string;
  options: string[];
  correctAnswer: string;
  celebration: string;
};

export type TopicGame = {
  title: string;
  subtitle: string;
  goal: string;
  rounds: GameRound[];
};

export type JoinedClass = Class & {
  educator: Profile;
  memberCount: number;
};

export type StudentClassSnapshot = JoinedClass & {
  rosterProgress?: {
    completedLessons: number;
    averageBestScore: number;
  };
};

export type EducatorStudentGrowthRow = {
  student: Profile;
  membership: ClassMembership;
  completedLessons: number;
  attemptedLessons: number;
  averageBestScore: number;
  assignedCompletedLessons: number;
  assignedAttemptedLessons: number;
  assignedAverageBestScore: number;
  latestActivityAt: string | null;
};

export type AssignableLesson = Lesson & {
  subject: Subject;
  unit: Unit;
};

export type EducatorClassAssignment = ClassAssignment & {
  lesson: AssignableLesson;
  performance: {
    assignedStudentCount: number;
    completedStudentCount: number;
    attemptedStudentCount: number;
    averageBestScore: number;
  };
};

export type StudentClassAssignment = ClassAssignment & {
  lesson: AssignableLesson;
  progress: LessonProgress | null;
};

export type EducatorClassDetail = JoinedClass & {
  students: EducatorStudentGrowthRow[];
  assignments: EducatorClassAssignment[];
  availableLessons: AssignableLesson[];
};

export type StudentClassDetail = JoinedClass & {
  assignments: StudentClassAssignment[];
};
