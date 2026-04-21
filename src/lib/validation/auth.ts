import { z } from "zod";
import { GRADES, PROFILE_ROLES } from "@/lib/constants";

export const loginSchema = z.object({
  email: z.string().email("Enter a real email address."),
  password: z.string().min(1, "Password is required."),
});

export const signupSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Use at least 2 letters for your name.")
      .max(80, "Names must be 80 characters or fewer."),
    email: z.string().email("Enter a real email address."),
    password: z
      .string()
      .min(8, "Use at least 8 characters.")
      .regex(/[A-Za-z]/, "Use at least one letter.")
      .regex(/[0-9]/, "Use at least one number."),
    role: z.enum(PROFILE_ROLES.map((item) => item.value) as ["student", "educator"]),
    gradeLevel: z.enum(GRADES).optional().nullable(),
  })
  .superRefine((value, context) => {
    if (value.role === "student" && !value.gradeLevel) {
      context.addIssue({
        code: "custom",
        path: ["gradeLevel"],
        message: "Choose the student's grade.",
      });
    }
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type SignupValues = z.infer<typeof signupSchema>;
