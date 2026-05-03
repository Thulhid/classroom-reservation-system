import { describe, expect, it } from "vitest";

import { bookingFormSchema } from "./createBookingSchema";

describe("bookingFormSchema", () => {
  it("accepts a valid booking form payload", () => {
    const result = bookingFormSchema.safeParse({
      roomId: "room-1",
      date: "2026-05-03",
      startTime: "09:00",
      endTime: "10:00",
      purpose: "Group study session",
    });

    expect(result.success).toBe(true);
  });

  it("rejects when end time is before start time", () => {
    const result = bookingFormSchema.safeParse({
      roomId: "room-1",
      date: "2026-05-03",
      startTime: "11:00",
      endTime: "10:00",
      purpose: "Group study session",
    });

    expect(result.success).toBe(false);
  });

  it("rejects when purpose is empty", () => {
    const result = bookingFormSchema.safeParse({
      roomId: "room-1",
      date: "2026-05-03",
      startTime: "09:00",
      endTime: "10:00",
      purpose: "",
    });

    expect(result.success).toBe(false);
  });
});
