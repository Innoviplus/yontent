
/**
 * Formats a number with thousand separators
 * @param value The number to format
 * @returns Formatted string with thousand separators
 */
export const formatNumber = (value: number | undefined | null): string => {
  if (value === undefined || value === null) return '0';
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
