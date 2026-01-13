import fs from 'node:fs';

const RANDOM_NUMBER_UPPER_BOUND = 10000;
const FIRST_IN_ARRAY = 0;

/**
 * Generate a random build number as a string.
 * @returns {string} - A random build number.
 */
export const getBuildNumber = (): string => Math.floor(Math.random() * RANDOM_NUMBER_UPPER_BOUND).toString();

/**
 * Get the latest build file from the specified directory.
 * @param {string} directory - The directory to search in.
 * @param {string} prefix - The prefix of the build files.
 * @param {string} extension - The extension of the build files.
 * @returns {string} - The name of the latest build file or an empty string if none found.
 */
export const getLatestBuildFile = (
  directory: string,
  prefix: string,
  extension: string
): string => {
  const files = fs.readdirSync(directory);

  const matchingFiles = files
    .filter(file => new RegExp(`^${prefix}\\.\\d+\\.${extension}$`).test(file))
    .map(file => ({
      file,
      mtime: fs.statSync(`${directory}/${file}`).mtime.getTime(),
    }))
    .sort((a, b) => b.mtime - a.mtime);

  return matchingFiles.length ? matchingFiles[0].file : "";
};