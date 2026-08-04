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

/**
 * Check whether keys are present in query params.
 * @param {Record} params query params
 * @param {Array} keys keys to check if present
 * @returns {boolean} whether keys are present in query params
 */
export function hasQueryParams<T extends string>(
  params: Record<string, unknown>,
  keys: T[],
): params is Record<T, string> {
  return keys.every(
    (key) => typeof params[key] === "string",
  );
}

/**
 * Check whether a value is a valid enum value.
 * @param {object} enumObject enum object
 * @param {unknown} value value to check
 * @returns {boolean} whether the value is a valid enum value
 */
export function isEnumValue<T extends Record<string, string>>(
  enumObject: T,
  value: unknown,
): value is T[keyof T] {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- ignore
  return Object.values(enumObject).includes(value as T[keyof T]);
}
