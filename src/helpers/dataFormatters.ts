/**
 * Data Formatting Helpers
 *
 * Utility functions for formatting claim data in a consistent way across the application.
 */

import type { BooleanChoice } from "#src/models/booleanChoice.js";
import type { LocalDate } from "#src/types/date.js";

/**
 * Format date for display in table cells and UI components
 * @param {LocalDate} date Date
 * @returns {string} Formatted date in DD/MM/YYYY format (e.g., "06/01/1986")
 */
export function formatDate(date: LocalDate): string {
  return `${date.toDayString()}/${date.toMonthString()}/${date.toYearString()}`;
}

/**
 * Format date for readable display
 * @param {Date} date Date object
 * @returns {string} Formatted date in D MMMM YYYY format (e.g., "6 January 1986")
 */
export function formatDateReadable(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
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
 * @param {number} value optional value representing the claimed amount
 * @returns {string} Transformed currency value
 */
export function formatClaimed(value: number): string {
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
  return formatOptionalValue(value, value => value);
}

/**
 * Format optional value as a string
 * @param {string | null | undefined} value Optional string to format
 * @param {(value) => string} f Function used to format the value.
 * @returns {string} String value or empty if undefined
 */
export function formatOptionalValue<T>(
  value: T | null | undefined,
  f: (value: T) => string,
): string {
  if (value == null) {
    return "";
  }

  return f(value);
}

/**
 * Format boolean in human-readable format for use in radio options
 * @param {boolean | null | undefined} value the value to convert
 * @returns {string | undefined} the converted value
 */
export function formatBooleanChoice(value: boolean | null | undefined): BooleanChoice | undefined {
  if (value == null) {
    return undefined;
  }
  return value ? "yes" : "no";
}

/**
 * Format boolean in human-readable format for use in radio options
 * @param {boolean} value the value to convert
 * @returns {string | undefined} the converted value
 */
export function formatBoolean(value: boolean): string {
  return value ? "common.yes" : "common.no";
}
