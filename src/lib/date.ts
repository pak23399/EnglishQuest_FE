import {
  addYears,
  differenceInCalendarDays,
  differenceInMonths,
  differenceInYears,
  format,
  isSameDay,
  isValid,
  parse,
} from 'date-fns';

export function formatDateTime(date: Date | undefined | null, fallback = '') {
  return date ? format(date, 'HH:mm, dd/MM/yyyy') : fallback;
}

export function formatDateOnly(date: Date | undefined | null, fallback = '') {
  return date ? format(date, 'dd/MM/yyyy') : fallback;
}

export function formatMonthYear(date: Date | undefined | null, fallback = '') {
  return date ? format(date, "'Tháng' M/yyyy") : fallback;
}

export function toDate(val: Date | string | null | undefined): Date | null {
  if (!val) return null;
  if (val instanceof Date) return val;
  if (typeof val === 'string') {
    // Try to parse as dd/MM/yyyy first to avoid US-style month/day swap
    try {
      const parsed = parse(val, 'dd/MM/yyyy', new Date());
      if (isValid(parsed)) return parsed;
    } catch (e) {
      // ignore and fallback
    }
    const fallback = new Date(val);
    return isValid(fallback) ? fallback : null;
  }
  return null;
}

export function toDateWithNull(str: string | Date | null) {
  if (!str) return null;
  if (str instanceof Date) return str;
  // Chuyển sang định dạng chuẩn trước khi parse
  return new Date(str);
}

export function monthsToYear(numOfMoths: number | null | undefined) {
  if (numOfMoths === null || numOfMoths === undefined) return '';

  return Math.floor(numOfMoths / 12);
}

export function displayMonthYear(numOfMoths: number | null | undefined) {
  if (numOfMoths === null || numOfMoths === undefined) return '';

  const years = Math.floor(numOfMoths / 12);
  const months = numOfMoths % 12;

  if (years === 0) {
    return `${months} tháng`;
  }
  if (months === 0) {
    return `${years} năm`;
  }
  return `${years} năm ${months} tháng`;
}

export function formatDiffInYearMonth(from: Date, to: Date | null) {
  const endDate = to || new Date();

  const years = differenceInYears(endDate, from);
  const months = differenceInMonths(endDate, addYears(from, years));

  if (years === 0) {
    return `${months} tháng`;
  }
  if (months === 0) {
    return `${years} năm`;
  }
  return `${years} năm ${months} tháng`;
}

export function convertDatesToISODate(obj: any): any {
  if (obj instanceof Date) {
    return obj.toISOString();
  }
  if (Array.isArray(obj)) {
    return obj.map(convertDatesToISODate);
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, convertDatesToISODate(v)]),
    );
  }
  return obj;
}

const ISO_DATE_RE =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/;

export function convertISOStringsToDates(obj: any): any {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'string') {
    // Treat server's SQL/DB 'zero' date (year 0001) as null. Server returns
    // strings like "0001-01-01T00:00:00" for null dates — convert them to null
    // so the frontend receives null instead of an invalid/meaningless Date.
    const ZERO_DATE_RE = /^0001-01-01T00:00:00(?:\.0+)?(?:Z|[+-]\d{2}:\d{2})?$/;
    if (ZERO_DATE_RE.test(obj)) return null;

    if (ISO_DATE_RE.test(obj)) {
      // If the server sent a timezone-less datetime like "2025-01-01T17:00:00"
      // many environments will parse that as local time which can shift the
      // intended date. Treat timezone-less datetimes as UTC by appending 'Z'
      // so they are parsed consistently as UTC instants.
      const TIMEZONE_LESS_RE =
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?$/;
      const toParse = TIMEZONE_LESS_RE.test(obj) ? `${obj}Z` : obj;
      const d = new Date(toParse);
      if (!Number.isNaN(d.getTime())) return d;
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(convertISOStringsToDates);
  }

  if (typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, convertISOStringsToDates(v)]),
    );
  }

  return obj;
}

export function calculateDaysLeft({
  startDate,
  endDate,
}: {
  startDate?: Date | null;
  endDate?: Date | null;
}) {
  if (!startDate || !endDate) return null;
  const today = new Date();

  if (today < startDate) return null;

  return Math.max(0, differenceInCalendarDays(endDate, today));
}

export function isTodayInRange({
  startDate,
  endDate,
}: {
  startDate?: Date | null;
  endDate?: Date | null;
}) {
  if (!startDate || !endDate) return false;
  const today = new Date();

  return today >= startDate && today <= endDate;
}

export function displayDateTime(date: Date | undefined | null) {
  if (!date) return '';
  return format(date, "HH:mm', ngày' dd/MM/yyyy");
}

export function displayDateTimeRange(start?: Date | null, end?: Date | null) {
  if (!start) {
    // Nếu không có startDate thì không hiển thị gì
    return '';
  }

  if (!end) {
    // Nếu chỉ có startDate thì hiển thị 1 mốc thời gian
    return format(start, "HH:mm', ngày' dd/MM/yyyy");
  }

  // Nếu cả 2 đều có
  // Nếu cùng ngày và cùng giờ (exact same timestamp)
  if (start.getTime() === end.getTime()) {
    return format(start, "HH:mm', ngày' dd/MM/yyyy");
  }

  // Nếu cùng ngày nhưng khác giờ
  if (isSameDay(start, end)) {
    return `${format(start, 'HH:mm')} đến ${format(end, 'HH:mm')}, ${format(start, "'ngày' dd/MM/yyyy")}`;
  }

  // Khác ngày: show full datetime for both sides
  return `${format(start, "HH:mm', ngày' dd/MM/yyyy")} đến ${format(end, "HH:mm', ngày' dd/MM/yyyy")}`;
}
