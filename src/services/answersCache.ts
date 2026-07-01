import type { RedisClientType, RedisJSON } from "redis";
import type { z } from "zod";
import {
  createKeyIfNonePresent,
  get,
  set,
  toRedisPath,
} from "#src/helpers/readsAndWrites.js";

const ANSWERS_CACHE_TTL_SECONDS = 60 * 60 * 3;

const getAnswersCacheKey = (sessionId: string, claimId: number): string =>
  `answers:${sessionId}:${claimId}`;

export type Path = Array<string | number>;

/**
 * Builds a Redis-backed answers cache.
 *
 * @param {RedisClientType} redisClient Redis client used to store cached answers.
 * @returns {AnswersCache} Answers cache backed by Redis.
 */
export const buildAnswersCache = (
  redisClient: RedisClientType,
): AnswersCache => ({
  get: async <T extends z.ZodType>(
    sessionId: string,
    claimId: number,
    path: Path,
    schema: T,
  ): Promise<z.infer<T> | null> => {
    try {
      const key = getAnswersCacheKey(sessionId, claimId);

      const value = await get(redisClient, key, toRedisPath(path));

      return schema.parse(value);
    } catch {
      return null;
    }
  },

  set: async (
    sessionId: string,
    claimId: number,
    path: Path,
    value: RedisJSON,
  ): Promise<void> => {
    const key = getAnswersCacheKey(sessionId, claimId);

    await createKeyIfNonePresent(redisClient, key);

    await set(redisClient, key, path, value);

    await redisClient.expire(key, ANSWERS_CACHE_TTL_SECONDS);
  },

  clear: async (sessionId, claimId): Promise<void> => {
    await redisClient.del(getAnswersCacheKey(sessionId, claimId));
  },
});

export interface AnswersCache {
  get: <T extends z.ZodType>(
    sessionId: string,
    claimId: number,
    path: Path,
    schema: T,
  ) => Promise<z.infer<T> | null>;

  set: (
    sessionId: string,
    claimId: number,
    path: Path,
    value: RedisJSON,
  ) => Promise<void>;

  clear: (sessionId: string, claimId: number) => Promise<void>;
}
