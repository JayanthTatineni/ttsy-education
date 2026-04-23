import { z } from "zod";
import { GRADES } from "@/lib/constants";

const uuid = z.string().uuid("Invalid id.");

export const createClassSchema = z.object({
  id: uuid.optional(),
  name: z.string().min(3, "Use at least 3 letters for the class name.").max(80),
  description: z.string().max(240).optional().or(z.literal("")),
  gradeLevel: z.enum(GRADES).optional().nullable(),
  subjectFocus: z.enum(["math", "science"]).optional().nullable(),
});

export const joinClassSchema = z.object({
  joinCode: z
    .string()
    .min(4, "Enter the class code.")
    .max(12, "Class codes are short.")
    .transform((value) => value.trim().toUpperCase()),
});

export const assignStudentSchema = z.object({
  email: z
    .string()
    .email("Enter a valid student email.")
    .transform((value) => value.trim().toLowerCase()),
});

export type CreateClassValues = z.output<typeof createClassSchema>;
export type JoinClassValues = z.output<typeof joinClassSchema>;
export type AssignStudentValues = z.output<typeof assignStudentSchema>;
