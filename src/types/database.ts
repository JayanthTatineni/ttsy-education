export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type GradeLevel = "K" | "1" | "2" | "3" | "4" | "5";
export type ProfileRole = "student" | "educator" | "admin";
export type QuestionType = "multiple_choice" | "true_false" | "numeric";
export type Difficulty = "easy" | "medium" | "challenge";
export type SubjectFocus = "math" | "science";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: ProfileRole;
          grade_level: GradeLevel | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          role?: ProfileRole;
          grade_level?: GradeLevel | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string;
          full_name?: string;
          role?: ProfileRole;
          grade_level?: GradeLevel | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      subjects: {
        Row: {
          id: string;
          slug: string;
          name: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
        };
        Update: {
          slug?: string;
          name?: string;
        };
        Relationships: [];
      };
      units: {
        Row: {
          id: string;
          subject_id: string;
          grade_level: GradeLevel;
          title: string;
          description: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          subject_id: string;
          grade_level: GradeLevel;
          title: string;
          description: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          subject_id?: string;
          grade_level?: GradeLevel;
          title?: string;
          description?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      lessons: {
        Row: {
          id: string;
          unit_id: string;
          subject_id: string;
          grade_level: GradeLevel;
          title: string;
          slug: string;
          description: string;
          video_url: string;
          thumbnail_url: string | null;
          estimated_minutes: number;
          is_published: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          unit_id: string;
          subject_id: string;
          grade_level: GradeLevel;
          title: string;
          slug: string;
          description: string;
          video_url: string;
          thumbnail_url?: string | null;
          estimated_minutes?: number;
          is_published?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          unit_id?: string;
          subject_id?: string;
          grade_level?: GradeLevel;
          title?: string;
          slug?: string;
          description?: string;
          video_url?: string;
          thumbnail_url?: string | null;
          estimated_minutes?: number;
          is_published?: boolean;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      questions: {
        Row: {
          id: string;
          lesson_id: string;
          type: QuestionType;
          prompt: string;
          image_url: string | null;
          explanation: string;
          correct_answer: string;
          answer_options: Json;
          difficulty: Difficulty;
          skill_tag: string;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lesson_id: string;
          type: QuestionType;
          prompt: string;
          image_url?: string | null;
          explanation: string;
          correct_answer: string;
          answer_options?: Json;
          difficulty?: Difficulty;
          skill_tag: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          lesson_id?: string;
          type?: QuestionType;
          prompt?: string;
          image_url?: string | null;
          explanation?: string;
          correct_answer?: string;
          answer_options?: Json;
          difficulty?: Difficulty;
          skill_tag?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      lesson_attempts: {
        Row: {
          id: string;
          student_id: string;
          lesson_id: string;
          score: number;
          total_questions: number;
          correct_answers: number;
          completed: boolean;
          started_at: string;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          lesson_id: string;
          score: number;
          total_questions: number;
          correct_answers: number;
          completed: boolean;
          started_at?: string;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          score?: number;
          total_questions?: number;
          correct_answers?: number;
          completed?: boolean;
          completed_at?: string | null;
        };
        Relationships: [];
      };
      question_attempts: {
        Row: {
          id: string;
          lesson_attempt_id: string;
          question_id: string;
          student_id: string;
          selected_answer: string;
          is_correct: boolean;
          answered_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          lesson_attempt_id: string;
          question_id: string;
          student_id: string;
          selected_answer: string;
          is_correct: boolean;
          answered_at?: string;
          created_at?: string;
        };
        Update: {
          selected_answer?: string;
          is_correct?: boolean;
          answered_at?: string;
        };
        Relationships: [];
      };
      lesson_progress: {
        Row: {
          id: string;
          student_id: string;
          lesson_id: string;
          best_score: number;
          last_score: number;
          completed: boolean;
          times_attempted: number;
          last_attempted_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          lesson_id: string;
          best_score: number;
          last_score: number;
          completed: boolean;
          times_attempted?: number;
          last_attempted_at?: string;
          updated_at?: string;
        };
        Update: {
          best_score?: number;
          last_score?: number;
          completed?: boolean;
          times_attempted?: number;
          last_attempted_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      classes: {
        Row: {
          id: string;
          educator_id: string;
          name: string;
          description: string;
          grade_level: GradeLevel | null;
          subject_focus: SubjectFocus | null;
          join_code: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          educator_id: string;
          name: string;
          description?: string;
          grade_level?: GradeLevel | null;
          subject_focus?: SubjectFocus | null;
          join_code: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          description?: string;
          grade_level?: GradeLevel | null;
          subject_focus?: SubjectFocus | null;
          join_code?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      class_memberships: {
        Row: {
          id: string;
          class_id: string;
          student_id: string;
          joined_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          class_id: string;
          student_id: string;
          joined_at?: string;
          created_at?: string;
        };
        Update: {
          joined_at?: string;
        };
        Relationships: [];
      };
      student_course_selections: {
        Row: {
          id: string;
          student_id: string;
          unit_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          unit_id: string;
          created_at?: string;
        };
        Update: never;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
