import { createClient, type RedisClientType } from "redis";
import type { RedisEnvConfig, RedisLocalConfig } from "#src/types/config-types.js";

/**
 * Builds and returns a Redis client based on environment configuration.
 * @param {RedisLocalConfig | RedisEnvConfig} redisConfig - The Redis configuration object
 * @returns {RedisClientType} The configured Redis client instance.
 * @throws Will throw an error if required environment variables for AWS mode are missing.
 */
export function buildRedisClient(redisConfig: RedisLocalConfig | RedisEnvConfig): RedisClientType {
    if (redisConfig.local) {
        return createClient({ url: redisConfig.url });
    }
    const { token: password, host, port } = redisConfig;

    return createClient({
        socket: { host, port, tls: true }, // TLS for ElastiCache in-transit encryption
        password,
    });
}

/**
 * Initiate the redis client
 * @param {RedisClientType} client the client to inititate
 * @returns {Promise<void>} async side effect of connection
 */
export async function initRedis(client: RedisClientType): Promise<void> {
    client.on("error", (e) => { console.error("[redis] error:", e); });
    if (!client.isOpen) await client.connect();
}
