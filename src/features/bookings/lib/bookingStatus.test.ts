import { describe, expect, it } from "vitest";

import { getBookingDisplayStatus } from "./bookingStatus";

describe("getBookingDisplayStatus", () => {
  const now = new Date("2026-05-03T10:00:00");

  it("returns Upcoming when the booking starts in the future", () => {
    const status = getBookingDisplayStatus(
      {
        startsAt: new Date("2026-05-03T11:00:00"),
        endsAt: new Date("2026-05-03T12:00:00"),
      },
      now,
    );

    expect(status.label).toBe("Upcoming");
  });

  it("returns Ongoing when current time is inside booking time", () => {
    const status = getBookingDisplayStatus(
      {
        startsAt: new Date("2026-05-03T09:00:00"),
        endsAt: new Date("2026-05-03T11:00:00"),
      },
      now,
    );

    expect(status.label).toBe("Ongoing");
  });

  it("returns Completed when the booking has already ended", () => {
    const status = getBookingDisplayStatus(
      {
        startsAt: new Date("2026-05-03T08:00:00"),
        endsAt: new Date("2026-05-03T09:00:00"),
      },
      now,
    );

    expect(status.label).toBe("Completed");
  });
});
