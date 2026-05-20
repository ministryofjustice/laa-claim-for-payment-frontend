/**
 * Formats a file size in bytes into a human-readable KB or MB string.
 *
 * @param {number} sizeInBytes - The file size in bytes.
 * @returns {string} The formatted file size string.
 */
export function formatFileSize(sizeInBytes: number): string {
  const sizeInKilobytes = sizeInBytes / 1024;

  if (sizeInKilobytes < 1024) {
    return `${Math.max(1, Math.round(sizeInKilobytes))}KB`;
  }

  return `${Math.round(sizeInKilobytes / 1024)}MB`;
}