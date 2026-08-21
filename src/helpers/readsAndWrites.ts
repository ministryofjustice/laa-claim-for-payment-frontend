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
  await redisClient.json.set(key, redisPath, {}, { NX: true });
  for (let i = 0; i < path.length; i += 1) {
    const lastIteration = i === path.length - 1;
    // eslint-disable-next-line @typescript-eslint/prefer-destructuring -- ignore
    const segment = path[i];
    if (typeof segment === "number") {
      const index = segment;
      // eslint-disable-next-line no-await-in-loop -- Redis path must be built sequentially
      let length = await getArrayLength(redisClient, key, redisPath);
      if (length == null) {
        // eslint-disable-next-line no-await-in-loop -- Redis path must be built sequentially
        await redisClient.json.set(key, redisPath, []);
        length = 0;
      }
      if (index > length) {
        break;
      }
      const updatedRedisPath = `${redisPath  }[${index}]`;
      // eslint-disable-next-line no-await-in-loop -- Redis path must be built sequentially
      if (await exists(redisClient, key, updatedRedisPath)) {
        if (lastIteration) {
          // eslint-disable-next-line no-await-in-loop -- Redis path must be built sequentially
          await redisClient.json.set(key, updatedRedisPath, value);
        }
      } else {
        // eslint-disable-next-line no-await-in-loop -- Redis path must be built sequentially
        await redisClient.json.arrAppend(
          key,
          redisPath,
          lastIteration ? value : {},
        );
      }
      redisPath = updatedRedisPath;
    } else {
      redisPath += `.${segment}`;
      if (lastIteration) {
        // eslint-disable-next-line no-await-in-loop -- Redis path must be built sequentially
        await redisClient.json.set(key, redisPath, value);
      } else {
        // eslint-disable-next-line no-await-in-loop -- Redis path must be built sequentially
        await redisClient.json.set(key, redisPath, {}, { NX: true });
      }
    }
  }
};

const exists = async (
  redisClient: RedisClientType,
  key: string,
  path: string,
): Promise<boolean> => (await get(redisClient, key, path)) != null;

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
