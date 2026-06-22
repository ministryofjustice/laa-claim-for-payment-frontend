/**
 * Data Formatting Helpers
 *
 * Utility functions for formatting claim data in a consistent way across the application.
 */

/**
 * Format date for display in table cells and UI components
 * @param {Date} date Date object
 * @returns {string} Formatted date in DD/MM/YYYY format (e.g., "06/01/1986")
 */
export function formatDate(date: Date | null | undefined): string {
  if (date == null) {
    return "";
  } else {
    const day = date.toLocaleString('en-GB', { day: '2-digit' });
    const month = date.toLocaleString('en-GB', { month: '2-digit' });
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
}

/**
 * Format date for readable display
 * @param {Date} date Date object
 * @returns {string} Formatted date in D MMMM YYYY format (e.g., "6 January 1986")
 */
export function formatDateReadable(date: Date | null | undefined): string {
  if (date == null) {
    return "No data available";
  } else {
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
}

/**
 * Format claim ID for display in table cells and UI components
 * @param {number} value claim ID
 * @returns {string} Transformed claim ID
 */
export function formatClaimId(value: number): string {
  const maxPaddingLength = 3;
  return `LAA-${value.toString().padStart(maxPaddingLength, "0")}`;
}

/**
 * Format claimed amount for display in table cells and UI components
 * @param {number | undefined} value optional value representing the claimed amount
 * @returns {string} Transformed currency value
 */
export function formatClaimed(value: number | null | undefined): string {
  if (value == null) {
    return "";
  }
  
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value);
}

/**
 * Format optional string as a string
 * @param {string | undefined} value Optional string to format
 * @returns {string} String value or empty if undefined
 */
export function formatOptionalString(value: string | null | undefined): string {
  if (value == null) {
    return "";
  }

  return value;
}
