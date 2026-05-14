import { describe, expect, it } from "vitest";

import {
  formatBookingDate,
  formatBookingTimeRange,
  getDefaultBookingPeriod,
  parseBookingPeriod,
  parseLocalDateTime,
  toDateInputValue,
  toTimeInputValue,
} from "./dateTime";

describe("parseLocalDateTime", () => {
  it("returns a Date for valid date and time input", () => {
    const result = parseLocalDateTime("2026-05-03", "09:30");

    expect(result).toBeInstanceOf(Date);
  });

  it("parses classroom wall-clock time in the booking timezone", () => {
    const result = parseLocalDateTime("2026-05-14", "07:00");

    expect(result?.toISOString()).toBe("2026-05-14T01:30:00.000Z");
  });

  it("returns null for invalid date input", () => {
    const result = parseLocalDateTime("2026-02-30", "09:30");

    expect(result).toBeNull();
  });
});

describe("booking date and time formatting", () => {
  it("formats database instants as classroom wall-clock values", () => {
    const startsAt = new Date("2026-05-14T01:30:00.000Z");
    const endsAt = new Date("2026-05-14T02:30:00.000Z");

    expect(toDateInputValue(startsAt)).toBe("2026-05-14");
    expect(toTimeInputValue(startsAt)).toBe("07:00");
    expect(toTimeInputValue(endsAt)).toBe("08:00");
    expect(formatBookingDate(startsAt)).toBe("Thu, May 14, 2026");
    expect(formatBookingTimeRange(startsAt, endsAt)).toBe(
      "7:00 AM - 8:00 AM",
    );
  });

  it("defaults to the next classroom hour", () => {
    const period = getDefaultBookingPeriod(
      new Date("2026-05-14T01:45:00.000Z"),
    );

    expect(period.date).toBe("2026-05-14");
    expect(period.startTime).toBe("08:00");
    expect(period.endTime).toBe("09:00");
    expect(period.startsAt.toISOString()).toBe("2026-05-14T02:30:00.000Z");
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
