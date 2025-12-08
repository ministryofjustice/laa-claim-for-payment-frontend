import { createClient, type RedisClientType } from "redis";
import config from "config.js";


/**
 * Builds and returns a Redis client based on environment configuration.
 * @returns {RedisClientType} The configured Redis client instance.
 * @throws Will throw an error if required environment variables for AWS mode are missing.
 */
export function buildRedisClient(): RedisClientType {
    if (config.redis.local) {
        return createClient({ url: config.redis.url });
    } else {
        const {username, host, port} = config.redis;
        let password: string | undefined = undefined

        return createClient({
            socket: { host, port, tls: true }, // TLS for ElastiCache in-transit encryption
            username,
            password,
        });
    };
}

export async function initRedis(client: RedisClientType): Promise<void> {
    client.on("error", (e) => console.error("[redis] error:", e));
    if (!client.isOpen) await client.connect();
}
