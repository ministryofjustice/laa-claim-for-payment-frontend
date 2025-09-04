/**
 * Data Transformation Helpers
 *
 * Utility functions for safely transforming and validating data from JSON fixtures
 */

/**
 * Transform raw claim ID to display format
 * @param {number} value claim id
 * @returns {string} Transformed claim id
 */
export function formatClaimId(value: number): string {
  const maxPaddingLength = 3;
  return `LAA-${value.toString().padStart(maxPaddingLength, "0")}`;
}

/**
 * Transform raw value for claimed to display format
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
