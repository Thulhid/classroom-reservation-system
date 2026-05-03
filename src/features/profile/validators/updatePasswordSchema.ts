import { z } from "zod";

export const updatePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters.")
      .max(72, "New password is too long."),
    confirmNewPassword: z.string().min(1, "Please confirm the new password."),
  })
  .superRefine(({ newPassword, confirmNewPassword }, context) => {
    if (newPassword !== confirmNewPassword) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmNewPassword"],
        message: "New password and confirmation do not match.",
      });
    }
  });

export type UpdatePasswordFormValues = z.infer<
  typeof updatePasswordFormSchema
>;
export type UpdatePasswordPayload = z.output<typeof updatePasswordFormSchema>;

export function parseUpdatePasswordPayload(payload: unknown) {
  return updatePasswordFormSchema.safeParse(payload);
}

export function getUpdatePasswordValidationMessage(error: z.ZodError) {
  return error.issues[0]?.message ?? "Please review the password details.";
}
