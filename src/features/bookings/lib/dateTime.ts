import {
  addHours,
  areIntervalsOverlapping,
  format,
  isAfter,
  isValid,
  parse,
  startOfHour,
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

const dateInputFormat = "yyyy-MM-dd";
const timeInputFormat = "HH:mm";
const localDateTimeFormat = `${dateInputFormat} ${timeInputFormat}`;

export function toDateInputValue(date: Date) {
  return format(date, dateInputFormat);
}

export function toTimeInputValue(date: Date) {
  return format(date, timeInputFormat);
}

function getFirstValue(value: SearchParamValue) {
  return Array.isArray(value) ? value[0] : value;
}

export function getDefaultBookingPeriod(now = new Date()): BookingPeriod {
  const currentHour = startOfHour(now);
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
  const parsedDate = parse(
    `${date} ${time}`,
    localDateTimeFormat,
    new Date(),
  );

  if (!isValid(parsedDate)) {
    return null;
  }

  return toDateInputValue(parsedDate) === date &&
    toTimeInputValue(parsedDate) === time
    ? parsedDate
    : null;
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
  return format(date, "EEE, MMM d, yyyy");
}

export function formatBookingTimeRange(startsAt: Date, endsAt: Date) {
  return `${format(startsAt, "h:mm a")} - ${format(endsAt, "h:mm a")}`;
}
