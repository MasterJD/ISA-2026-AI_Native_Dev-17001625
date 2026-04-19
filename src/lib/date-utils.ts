import {
  addDays,
  differenceInCalendarDays,
  eachDayOfInterval,
  isBefore,
  startOfDay,
} from "date-fns";

export function normalizeDate(value: Date): Date {
  return startOfDay(value);
}

export function isPastRentalDate(value: Date): boolean {
  return isBefore(normalizeDate(value), normalizeDate(new Date()));
}

export function calculateRentalDays(startDate: Date, endDate: Date): number {
  const start = normalizeDate(startDate);
  const end = normalizeDate(endDate);

  if (isBefore(end, start)) {
    return 0;
  }

  return differenceInCalendarDays(end, start) + 1;
}

export function calculateRentalPrice(
  dailyRate: number,
  startDate: Date,
  endDate: Date,
): number {
  const totalDays = calculateRentalDays(startDate, endDate);
  return Number((dailyRate * totalDays).toFixed(2));
}

export function enumerateRentalDates(startDate: Date, endDate: Date): Date[] {
  const start = normalizeDate(startDate);
  const end = normalizeDate(endDate);

  if (isBefore(end, start)) {
    return [];
  }

  return eachDayOfInterval({ start, end });
}

export function minEndDateForRental(startDate: Date): Date {
  return addDays(normalizeDate(startDate), 0);
}