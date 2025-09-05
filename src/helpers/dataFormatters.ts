/**
 * Data Formatting Helpers
 *
 * Utility functions for formatting claim data in a consistent way across the application.
 */

/**
 * Format date for display in table cells and UI components
 * @param {Date} date Date object
 * @returns {string} Formatted date in DD/MM/YYYY format (e.g., "6 Jan 1986")
 */
export function formatDate(date: Date | undefined): string {
  if (date === undefined) {
    return "";
  } else {
    const day = date.toLocaleString('en-GB', { day: '2-digit' });
    const month = date.toLocaleString('en-GB', { month: '2-digit' });
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
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
export function formatClaimed(value: number | undefined): string {
  if (value === undefined) {
    return "";
  }
  
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value);
}

/**
 * Safely get optional string value from unknown data
 * @param {string | undefined} value Optional string to format
 * @returns {string} String value or empty if undefined
 */
export function formatOptionalString(value: string | undefined): string {
  if (value === undefined) {
    return "";
  }

  return value;
}
