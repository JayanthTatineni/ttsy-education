import { z } from "zod";

export const courseSelectionSchema = z.object({
  unitId: z.string().uuid("Choose a valid course."),
  selected: z.boolean(),
});

export type CourseSelectionValues = z.infer<typeof courseSelectionSchema>;
