import {
  addHours,
  areIntervalsOverlapping,
  isAfter,
} from "date-fns";

export type BookingPeriodInput = {
  date?: string;
  startTime?: string;
  endTime?: string;
};

export type BookingPeriod = {
  date: string;
  startTime: string;
  endTime: string;
  startsAt: Date;
  endsAt: Date;
};

type SearchParamValue = string | string[] | undefined;
type ZonedDateTimeParts = {
  day: number;
  hour: number;
  minute: number;
  month: number;
  second: number;
  year: number;
};

const fallbackBookingTimeZone = "Asia/Colombo";
const configuredBookingTimeZone =
  process.env.NEXT_PUBLIC_BOOKING_TIME_ZONE?.trim();
const dateInputPattern = /^(\d{4})-(\d{2})-(\d{2})$/;
const timeInputPattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

function resolveBookingTimeZone() {
  const timeZone = configuredBookingTimeZone || fallbackBookingTimeZone;

  try {
    new Intl.DateTimeFormat("en-US", { timeZone }).format(new Date());
    return timeZone;
  } catch {
    return fallbackBookingTimeZone;
  }
}

export const bookingTimeZone = resolveBookingTimeZone();

const zonedDateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
  hour: "2-digit",
  hourCycle: "h23",
  minute: "2-digit",
  month: "2-digit",
  second: "2-digit",
  timeZone: bookingTimeZone,
  year: "numeric",
});

const bookingDateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  timeZone: bookingTimeZone,
  weekday: "short",
  year: "numeric",
});

const bookingTimeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: bookingTimeZone,
});

const bookingHourFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  timeZone: bookingTimeZone,
});

function padDatePart(value: number) {
  return String(value).padStart(2, "0");
}

function getFormatterPart(
  parts: Intl.DateTimeFormatPart[],
  type: Intl.DateTimeFormatPartTypes,
) {
  return parts.find((part) => part.type === type)?.value ?? "";
}

function getZonedDateTimeParts(date: Date): ZonedDateTimeParts {
  const parts = zonedDateTimeFormatter.formatToParts(date);

  return {
    day: Number(getFormatterPart(parts, "day")),
    hour: Number(getFormatterPart(parts, "hour")) % 24,
    minute: Number(getFormatterPart(parts, "minute")),
    month: Number(getFormatterPart(parts, "month")),
    second: Number(getFormatterPart(parts, "second")),
    year: Number(getFormatterPart(parts, "year")),
  };
}

function formatDateInputParts({ day, month, year }: ZonedDateTimeParts) {
  return `${year}-${padDatePart(month)}-${padDatePart(day)}`;
}

function formatTimeInputParts({ hour, minute }: ZonedDateTimeParts) {
  return `${padDatePart(hour)}:${padDatePart(minute)}`;
}

function getTimeZoneOffsetMs(date: Date) {
  const parts = getZonedDateTimeParts(date);
  const zonedTimestamp = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );

  return zonedTimestamp - date.getTime();
}

function parseDateParts(date: string) {
  const match = dateInputPattern.exec(date);

  if (!match) {
    return null;
  }

  const [, yearValue, monthValue, dayValue] = match;
  const year = Number(yearValue);
  const month = Number(monthValue);
  const day = Number(dayValue);
  const utcDate = new Date(Date.UTC(year, month - 1, day));

  if (
    utcDate.getUTCFullYear() !== year ||
    utcDate.getUTCMonth() !== month - 1 ||
    utcDate.getUTCDate() !== day
  ) {
    return null;
  }

  return { day, month, year };
}

function parseTimeParts(time: string) {
  const match = timeInputPattern.exec(time);

  if (!match) {
    return null;
  }

  const [, hourValue, minuteValue] = match;

  return {
    hour: Number(hourValue),
    minute: Number(minuteValue),
  };
}

export function toDateInputValue(date: Date) {
  return formatDateInputParts(getZonedDateTimeParts(date));
}

export function toTimeInputValue(date: Date) {
  return formatTimeInputParts(getZonedDateTimeParts(date));
}

function getFirstValue(value: SearchParamValue) {
  return Array.isArray(value) ? value[0] : value;
}

export function getDefaultBookingPeriod(now = new Date()): BookingPeriod {
  const nowParts = getZonedDateTimeParts(now);
  const currentHour =
    parseLocalDateTime(
      formatDateInputParts(nowParts),
      `${padDatePart(nowParts.hour)}:00`,
    ) ?? now;
  const startsAt = isAfter(now, currentHour)
    ? addHours(currentHour, 1)
    : currentHour;
  const endsAt = addHours(startsAt, 1);

  return {
    date: toDateInputValue(startsAt),
    startTime: toTimeInputValue(startsAt),
    endTime: toTimeInputValue(endsAt),
    startsAt,
    endsAt,
  };
}

export function parseLocalDateTime(date: string, time: string) {
  const dateParts = parseDateParts(date);
  const timeParts = parseTimeParts(time);

  if (!dateParts || !timeParts) {
    return null;
  }

  const wallClockTimestamp = Date.UTC(
    dateParts.year,
    dateParts.month - 1,
    dateParts.day,
    timeParts.hour,
    timeParts.minute,
  );
  const firstPassOffset = getTimeZoneOffsetMs(new Date(wallClockTimestamp));
  let parsedDate = new Date(wallClockTimestamp - firstPassOffset);
  const secondPassOffset = getTimeZoneOffsetMs(parsedDate);

  if (secondPassOffset !== firstPassOffset) {
    parsedDate = new Date(wallClockTimestamp - secondPassOffset);
  }

  if (
    toDateInputValue(parsedDate) !== date ||
    toTimeInputValue(parsedDate) !== time
  ) {
    return null;
  }

  return parsedDate;
}

export function parseBookingPeriod(input: BookingPeriodInput) {
  const date = input.date?.trim();
  const startTime = input.startTime?.trim();
  const endTime = input.endTime?.trim();

  if (!date || !startTime || !endTime) {
    return {
      error: "Please choose a date, start time, and end time.",
      period: null,
    };
  }

  const startsAt = parseLocalDateTime(date, startTime);
  const endsAt = parseLocalDateTime(date, endTime);

  if (!startsAt || !endsAt) {
    return {
      error: "Please choose a valid date and time.",
      period: null,
    };
  }

  if (!isAfter(endsAt, startsAt)) {
    return {
      error: "End time must be after start time.",
      period: null,
    };
  }

  return {
    error: null,
    period: {
      date,
      startTime,
      endTime,
      startsAt,
      endsAt,
    } satisfies BookingPeriod,
  };
}

export function resolveAvailabilityPeriod(
  searchParams: Record<string, SearchParamValue>,
) {
  const date = getFirstValue(searchParams.date);
  const startTime = getFirstValue(searchParams.startTime);
  const endTime = getFirstValue(searchParams.endTime);
  const hasAnySearchValue = Boolean(date || startTime || endTime);
  const parsed = parseBookingPeriod({ date, startTime, endTime });

  if (parsed.period) {
    return {
      error: null,
      period: parsed.period,
    };
  }

  return {
    error: hasAnySearchValue ? parsed.error : null,
    period: getDefaultBookingPeriod(),
  };
}

export function isOverlappingPeriod(
  startsAt: Date,
  endsAt: Date,
  period: Pick<BookingPeriod, "startsAt" | "endsAt">,
) {
  return areIntervalsOverlapping(
    { start: startsAt, end: endsAt },
    { start: period.startsAt, end: period.endsAt },
  );
}

export function formatBookingDate(date: Date) {
  return bookingDateFormatter.format(date);
}

export function formatBookingTime(
  date: Date,
  { includeMinutes = true } = {},
) {
  return (includeMinutes ? bookingTimeFormatter : bookingHourFormatter).format(
    date,
  );
}

export function formatBookingTimeRange(startsAt: Date, endsAt: Date) {
  return `${formatBookingTime(startsAt)} - ${formatBookingTime(endsAt)}`;
}
