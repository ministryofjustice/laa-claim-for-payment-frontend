import type { RedisClientType } from "redis";

const ANSWERS_CACHE_TTL_SECONDS = 60 * 60 * 3;

const getAnswersCacheKey = (
  sessionId: string,
  journeyKey: string,
): string => `answers:${sessionId}:${journeyKey}`;

/**
 * Builds a Redis-backed answers cache.
 *
 * @param {RedisClientType} redisClient Redis client used to store cached answers.
 * @returns {AnswersCache} Answers cache backed by Redis.
 */
export const buildAnswersCache = (
  redisClient: RedisClientType,
): AnswersCache => ({
    get: async <T,>( sessionId: string, journeyKey: string): Promise<T | null> => {
    const value = await redisClient.get(getAnswersCacheKey(sessionId, journeyKey));

    if (value === null) {
      return null;
    }


    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Redis stores JSON strings, so callers provide the expected deserialised type.
        return JSON.parse(value) as unknown as T;
    } catch {
        return null;
    }
  },

  set: async (
    sessionId: string,
    journeyKey: string,
    answers: unknown,
  ): Promise<void> => {
    await redisClient.set(
      getAnswersCacheKey(sessionId, journeyKey),
      JSON.stringify(answers),
      {
        EX: ANSWERS_CACHE_TTL_SECONDS,
      },
    );
  },

  clear: async (sessionId: string, journeyKey: string): Promise<void> => {
    await redisClient.del(getAnswersCacheKey(sessionId, journeyKey));
  },
});

export interface AnswersCache {
  get: <T>(sessionId: string, journeyKey: string) => Promise<T | null>;
  set: (
    sessionId: string,
    journeyKey: string,
    answers: unknown,
  ) => Promise<void>;
  clear: (sessionId: string, journeyKey: string) => Promise<void>;
}