import { RedisStore } from "connect-redis"
import session from "express-session"
import type { RedisClientType } from "redis"
import type { Application } from 'express';
import { getRequiredEnv } from '#utils/envHelper.js';



/**
 * Sets up Redis-backed session management for the Express application.
 * @param {Application} app - The Express application instance.
 * @param {RedisClientType} redisClient - The Redis client instance.
 */
export const setupRedisSession = (app: Application, redisClient: RedisClientType): void => {

    const redisStore = new RedisStore({
        client: redisClient,
        prefix: "caa:",
    })
    app.use(
        session({
            store: redisStore,
            secret: (() => {
                const secret = getRequiredEnv("SESSION_SECRET");
                return secret;
            })(),
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: false,
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 3,
            },
        })
    )

    redisClient.connect().catch(console.error)
}