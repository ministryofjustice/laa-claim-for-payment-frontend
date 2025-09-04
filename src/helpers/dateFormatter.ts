/**
 * Date Formatting Helpers
 *
 * Utility functions for formatting dates in a consistent way across the application.
 */

// Linter requires 'no magic numbers'
const alignToZeroIndex = 1;

/**
 * Format date for display in table cells and UI components
 * @param {string} dateString ISO date string
 * @returns {string} Formatted date in DD/MM/YYYY format (e.g., "6 Jan 1986")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return dateString;
  }

  const day = date.toLocaleString("en-GB", { day: "2-digit" });
  const month = date.toLocaleString("en-GB", { month: "2-digit" });
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * Format date for display in table cells and UI components
 * @param {string} string ISO date string
 * @returns {Date} A date type object to allow complex use case
 */
export function parseDateString(string: string): Date {
  const [day, month, year] = string.split("/").map(Number);

  return new Date(year, month - alignToZeroIndex, day);
}
