import { z } from "zod";

import { MANAGED_USER_ROLES } from "@/features/users/lib/adminUsers";

const adminUserBaseSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required.")
    .max(60, "First name is too long."),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required.")
    .max(60, "Last name is too long."),
  uniID: z
    .string()
    .trim()
    .min(3, "University ID is required.")
    .max(30, "University ID is too long."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email address.")
    .max(120, "Email address is too long."),
});

export const adminUserFormSchema = adminUserBaseSchema;

export const adminCreateUserFormSchema = adminUserBaseSchema
  .extend({
    role: z.enum(MANAGED_USER_ROLES),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .max(72, "Password is too long."),
    confirmPassword: z.string().min(1, "Please confirm the password."),
  })
  .superRefine(({ password, confirmPassword }, context) => {
    if (password !== confirmPassword) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match.",
      });
    }
  });

export type AdminUserFormValues = z.infer<typeof adminUserFormSchema>;
export type AdminUserPayload = z.output<typeof adminUserFormSchema>;
export type AdminCreateUserFormValues = z.infer<typeof adminCreateUserFormSchema>;
export type AdminCreateUserPayload = z.output<typeof adminCreateUserFormSchema>;

export function parseAdminUserPayload(payload: unknown) {
  return adminUserFormSchema.safeParse(payload);
}

export function parseAdminCreateUserPayload(payload: unknown) {
  return adminCreateUserFormSchema.safeParse(payload);
}

function getValidationMessage(error: z.ZodError) {
  return error.issues[0]?.message ?? "Please review the account details.";
}

export function getAdminUserValidationMessage(error: z.ZodError) {
  return getValidationMessage(error);
}

export function getAdminCreateUserValidationMessage(error: z.ZodError) {
  return getValidationMessage(error);
}
