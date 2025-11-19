import en from "#locales/en.json" with { type: "json" };

const isRecord = (val: unknown): val is Record<string, unknown> =>
  typeof val === "object" && val !== null;


/**
 * Get the English value from locales/en
 * @param {string} key the lang file key
 * @returns {string | undefined} translation or undefined if not present
 */
export function getEnValue(key: string): string | undefined {
  let value: unknown = en;
  for (const part of key.split(".")) {
    if (!isRecord(value)) return undefined;
    const next: unknown = value[part];
    if (next === undefined || next === null) return undefined;
    value = next;
  }

  return typeof value === "string" ? value : undefined;
}
