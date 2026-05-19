/**
 * Escapes HTML-sensitive characters to prevent HTML injection in rendered output.
 *
 * @param {string} value The raw string value to escape.
 * @returns {string} The escaped HTML-safe string.
 */
export function escapeHtml(value: string): string{
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}