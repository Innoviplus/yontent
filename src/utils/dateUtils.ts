
import { subYears } from "date-fns";

/**
 * Checks if a date indicates that a user is at least 18 years old
 */
export const isAtLeast18 = (date: Date): boolean => {
  const eighteenYearsAgo = subYears(new Date(), 18);
  return date <= eighteenYearsAgo;
};

/**
 * Generates an array of years from maxYear to minYear
 */
export const generateYearRange = (minYear: number, maxYear: number): number[] => {
  return Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i);
};

/**
 * Generates an array of days based on month and year
 */
export const getDaysInMonth = (month: number | null, year: number | null): number => {
  if (month === null || year === null) return 31; // Default to 31 days
  return new Date(year, month + 1, 0).getDate();
};

/**
 * Generates a list of month objects with values and labels
 */
export const getMonthsList = (): Array<{ value: number; label: string }> => {
  return [
    { value: 0, label: "January" },
    { value: 1, label: "February" },
    { value: 2, label: "March" },
    { value: 3, label: "April" },
    { value: 4, label: "May" },
    { value: 5, label: "June" },
    { value: 6, label: "July" },
    { value: 7, label: "August" },
    { value: 8, label: "September" },
    { value: 9, label: "October" },
    { value: 10, label: "November" },
    { value: 11, label: "December" }
  ];
};
