import { z } from "zod";

export const forgotPasswordRequestSchema = z.object({
  universityId: z.string().trim().min(1, "University ID is required."),
});

export const forgotPasswordResetSchema = z
  .object({
    challengeToken: z.string().min(1, "Reset session is missing."),
    pin: z
      .string()
      .trim()
      .regex(/^\d{6}$/, "Enter the 6 digit PIN from your email."),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .max(72, "Password is too long."),
    confirmNewPassword: z.string().min(1, "Please confirm the password."),
  })
  .superRefine(({ newPassword, confirmNewPassword }, context) => {
    if (newPassword !== confirmNewPassword) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmNewPassword"],
        message: "Passwords do not match.",
      });
    }
  });

export type ForgotPasswordRequestPayload = z.output<
  typeof forgotPasswordRequestSchema
>;
export type ForgotPasswordResetPayload = z.output<
  typeof forgotPasswordResetSchema
>;

export function parseForgotPasswordRequestPayload(payload: unknown) {
  return forgotPasswordRequestSchema.safeParse(payload);
}

export function parseForgotPasswordResetPayload(payload: unknown) {
  return forgotPasswordResetSchema.safeParse(payload);
}

export function getForgotPasswordValidationMessage(error: z.ZodError) {
  return error.issues[0]?.message ?? "Please review the reset details.";
}
