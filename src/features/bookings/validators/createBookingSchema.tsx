import z from "zod";

export const bookingFormSchema = z
  .object({
    roomId: z.string().min(1, "Select a classroom."),
    date: z.string().min(1, "Select a date."),
    startTime: z.string().min(1, "Select a start time."),
    endTime: z.string().min(1, "Select an end time."),
    purpose: z
      .string()
      .trim()
      .min(1, "Enter a purpose.")
      .max(120, "Purpose must be 120 characters or less."),
  })
  .refine(({ startTime, endTime }) => startTime < endTime, {
    message: "End time must be after start time.",
    path: ["endTime"],
  });

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
