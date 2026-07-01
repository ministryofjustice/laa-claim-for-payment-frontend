import type { Path } from "#src/services/answersCache.js";
import type { RedisClientType, RedisJSON } from "redis";

/**
 * Gets a value at the given path for the given redis key.
 * @param {RedisClientType} redisClient Redis client used to store cached answers.
 * @param {string} key Object key
 * @param {Path} path Path of individual path segments
 * @returns {Promise<RedisJSON>} the value from redis
 */
export const get = async (
  redisClient: RedisClientType,
  key: string,
  path: string,
): Promise<RedisJSON> => {
  const response = await redisClient.json.get(key, {
    path,
  });

  return normalizeRedisResponse(response);
};

/**
 * Sets a value at the given path for the given redis key.
 * @param {RedisClientType} redisClient Redis client used to store cached answers.
 * @param {string} key Object key
 * @param {Path} path Path of individual path segments
 * @param {RedisJSON} value value to set at the given path
 */
export const set = async (
  redisClient: RedisClientType,
  key: string,
  path: Path,
  value: RedisJSON,
): Promise<void> => {
  let redisPath = "$";

  for (let i = 0; i < path.length; i += 1) {
    const lastIteration = i === path.length - 1;
    // eslint-disable-next-line @typescript-eslint/prefer-destructuring -- ignore
    const pathSegment = path[i];

    if (typeof pathSegment === "number") {
      const index = pathSegment;
      let length = await getArrayLength(redisClient, key, redisPath);
      if (length == null) {
        await redisClient.json.set(key, redisPath, []);
        length = 0;
      }
      if (index > length) {
        break;
      }

      const updatedRedisPath = redisPath + `[${index}]`;
      if (await exists(redisClient, key, updatedRedisPath)) {
        if (lastIteration) {
          await redisClient.json.set(key, updatedRedisPath, value);
        }
      } else {
        await redisClient.json.arrAppend(
          key,
          redisPath,
          lastIteration ? value : {},
        );
      }
      redisPath = updatedRedisPath;
    } else {
      redisPath += `.${pathSegment}`;
      if (lastIteration) {
        await redisClient.json.set(key, redisPath, value);
      } else {
        await redisClient.json.set(
          key,
          redisPath,
          {},
          {
            NX: true,
          },
        );
      }
    }
  }
};

/**
 * Creates an empty object for the given redis key if none exists already.
 * @param {RedisClientType} redisClient Redis client used to store cached answers.
 * @param {string} key Object key
 */
export const createKeyIfNonePresent = async (
  redisClient: RedisClientType,
  key: string,
): Promise<void> => {
  await redisClient.json.set(
    key,
    "$",
    {},
    {
      NX: true,
    },
  );
};

const exists = async (
  redisClient: RedisClientType,
  key: string,
  path: string,
): Promise<boolean> => (await get(redisClient, key, path)) != null;

/**
 * Converts array of path segments to a redis path.
 * @param {Path} path Path of individual path segments
 * @returns {string} the redis path
 */
export const toRedisPath = (path: Path): string => "$" +
    path
      .map((segment) =>
        typeof segment === "number" ? `[${segment}]` : `.${segment}`,
      )
      .join("");

const getArrayLength = async (
  redisClient: RedisClientType,
  key: string,
  path: string,
): Promise<number | null> => {
  const response = await redisClient.json.arrLen(key, {
    path,
  });

  return normalizeRedisResponse(response);
};

const normalizeRedisResponse = <T,>(value: T | T[] | null): T | null => {
  if (value == null || (Array.isArray(value) && value.length === 0)) {
    return null;
  }

  return Array.isArray(value) ? value[0] : value;
};
