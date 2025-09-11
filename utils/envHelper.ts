/**
 * Retrieves the value of an environment variable by name, throwing an error if it is missing.
 * @param {string} name - The name of the environment variable.
 * @returns {string} The value of the environment variable.
 * @throws If the environment variable is not set.
 */
export function getRequiredEnv(name: string): string {
  const { env } = process;
  // eslint-disable-next-line @typescript-eslint/prefer-destructuring -- can't use des
  const v= env[name];
  if (v == null) throw new Error(`Missing required env var: ${name}`);
  return v;
}