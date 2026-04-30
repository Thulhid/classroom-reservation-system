import { z } from "zod";

export const loginFormSchema = z.object({
  universityId: z.string().trim().min(1, "University ID is required."),
  password: z.string().min(1, "Password is required."),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
