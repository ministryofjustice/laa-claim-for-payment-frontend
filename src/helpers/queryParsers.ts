/**
 * Query parameter parser helpers
 *
 * Functions for parsing query parameters
 
/**
 * Parse query parameter as a number
 * @param {unknown} value Value from request query
 * @param {number} defaultValue Default value to return if `value` is invalid
 * @returns {number} The query parameter parsed as a number or, failing that, the default value
 */
export function parseNumberQueryParam(value: unknown, defaultValue: number): number {
  if (typeof value === "string") {
    const number = parseInt(value, 10);
    return Number.isNaN(number) ? defaultValue : number;
  }
  return defaultValue;
}
