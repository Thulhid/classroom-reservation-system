import { describe, expect, it } from "vitest";

import { parseBookingPeriod, parseLocalDateTime } from "./dateTime";

describe("parseLocalDateTime", () => {
  it("returns a Date for valid date and time input", () => {
    const result = parseLocalDateTime("2026-05-03", "09:30");

    expect(result).toBeInstanceOf(Date);
  });

  it("returns null for invalid date input", () => {
    const result = parseLocalDateTime("2026-02-30", "09:30");

    expect(result).toBeNull();
  });
});

describe("parseBookingPeriod", () => {
  it("returns a valid booking period when input is correct", () => {
    const result = parseBookingPeriod({
      date: "2026-05-03",
      startTime: "09:00",
      endTime: "10:00",
    });

    expect(result.error).toBeNull();
    expect(result.period?.date).toBe("2026-05-03");
    expect(result.period?.startTime).toBe("09:00");
    expect(result.period?.endTime).toBe("10:00");
  });

  it("returns an error when end time is before start time", () => {
    const result = parseBookingPeriod({
      date: "2026-05-03",
      startTime: "11:00",
      endTime: "10:00",
    });

    expect(result.period).toBeNull();
    expect(result.error).toBe("End time must be after start time.");
  });

  it("returns an error when required fields are missing", () => {
    const result = parseBookingPeriod({
      date: "",
      startTime: "09:00",
      endTime: "10:00",
    });

    expect(result.period).toBeNull();
    expect(result.error).toBe(
      "Please choose a date, start time, and end time.",
    );
  });
});
