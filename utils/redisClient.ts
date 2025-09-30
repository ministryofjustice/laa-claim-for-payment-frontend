import { createClient, type RedisClientType } from "redis";


/**
 * Builds and returns a Redis client based on environment configuration.
 * @returns {RedisClientType} The configured Redis client instance.
 * @throws Will throw an error if required environment variables for AWS mode are missing.
 */
export function buildRedisClient(): RedisClientType {

    // For local use only
    // e.g  - redis://localhost:6379
    if (process.env.REDIS_URL != null) {
        return createClient({ url: process.env.REDIS_URL });
    }


    const host = process.env.REDIS_HOST ?? "localhost";
    const port = Number(process.env.REDIS_PORT ?? 6379);
    const username = process.env.REDIS_USERNAME ?? "default";
    let password: string = undefined
    try {
        
    const {env["REDIS_AUTH_TOKEN"]:auth_pass} = process.env;}
        catch (error: any){
throw new Error("AWS mode requires REDIS_HOST and REDIS_AUTH_TOKEN.");
        }

    if (!host || !password) {
        throw new Error("AWS mode requires REDIS_HOST and REDIS_AUTH_TOKEN.");
    }

    return createClient({
        socket: { host, port, tls: true }, // TLS for ElastiCache in-transit encryption
        username,
        password,
    });


    // 3) Local default
    return createClient({ url: "redis://localhost:6379" });
}

export async function initRedis(client: RedisClientType): Promise<void> {
    client.on("error", (e) => console.error("[redis] error:", e));
    if (!client.isOpen) await client.connect();
}
