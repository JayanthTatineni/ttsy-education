import { z } from "zod";
import { DIFFICULTIES, GRADES, QUESTION_TYPES } from "@/lib/constants";

const uuid = z.string().uuid("Invalid id.");

export const lessonSchema = z.object({
  id: uuid.optional(),
  title: z.string().min(3, "Title needs at least 3 characters.").max(120),
  slug: z.string().min(2).max(140).optional().or(z.literal("")),
  description: z.string().min(12, "Add a short description.").max(800),
  gradeLevel: z.enum(GRADES),
  subjectId: uuid,
  unitId: uuid,
  videoUrl: z.string().url("Use a full video URL."),
  thumbnailUrl: z.string().url("Use a full image URL.").optional().or(z.literal("")),
  estimatedMinutes: z.coerce.number().int().min(1).max(60),
  sortOrder: z.coerce.number().int().min(0).max(999),
  isPublished: z.boolean(),
});

export const questionSchema = z
  .object({
    id: uuid.optional(),
    lessonId: uuid,
    type: z.enum(QUESTION_TYPES.map((type) => type.value) as [
      "multiple_choice",
      "true_false",
      "numeric",
    ]),
    prompt: z.string().min(4, "Question prompt is required.").max(600),
    imageUrl: z.string().url("Use a full image URL.").optional().or(z.literal("")),
    explanation: z.string().min(6, "Add an explanation.").max(700),
    correctAnswer: z.string().min(1, "Correct answer is required.").max(200),
    answerOptions: z.array(z.string().min(1).max(160)).max(6).default([]),
    difficulty: z.enum(DIFFICULTIES.map((item) => item.value) as [
      "easy",
      "medium",
      "challenge",
    ]),
    skillTag: z.string().min(2, "Skill tag is required.").max(80),
    sortOrder: z.coerce.number().int().min(0).max(999),
  })
  .superRefine((value, context) => {
    if (value.type === "multiple_choice") {
      const uniqueOptions = new Set(value.answerOptions.map((option) => option.trim()));
      if (uniqueOptions.size < 2) {
        context.addIssue({
          code: "custom",
          path: ["answerOptions"],
          message: "Add at least two different answer choices.",
        });
      }

      if (!uniqueOptions.has(value.correctAnswer.trim())) {
        context.addIssue({
          code: "custom",
          path: ["correctAnswer"],
          message: "Correct answer must match one answer choice exactly.",
        });
      }
    }

    if (
      value.type === "true_false" &&
      !["true", "false"].includes(value.correctAnswer.toLowerCase())
    ) {
      context.addIssue({
        code: "custom",
        path: ["correctAnswer"],
        message: "True/false answers must be true or false.",
      });
    }
  });

export type LessonFormInput = z.input<typeof lessonSchema>;
export type LessonFormValues = z.output<typeof lessonSchema>;
export type QuestionFormInput = z.input<typeof questionSchema>;
export type QuestionFormValues = z.output<typeof questionSchema>;
