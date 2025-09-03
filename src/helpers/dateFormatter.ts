/**
 * Date Formatting Helpers
 *
 * Utility functions for formatting dates in a consistent way across the application.
 */

/**
 * Format date for display in table cells and UI components
 * @param {string} dateString ISO date string
 * @returns {string} Formatted date in DD/MM/YYYY format (e.g., "6 Jan 1986")
 */
export function formatDate(date?: Date): string {
  if (!date) {
    return "";
  }

  const day = date.toLocaleString('en-GB', { day: '2-digit' });;
  const month = date.toLocaleString('en-GB', { month: '2-digit' });
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}
