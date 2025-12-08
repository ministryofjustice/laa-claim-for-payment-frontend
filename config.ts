import dotenv from "dotenv";
import type { Config, RedisEnvConfig, RedisLocalConfig } from "#src/types/config-types.js";
import { getRequiredEnv } from '#utils/envHelper.js';
dotenv.config();

const DEFAULT_RATE_LIMIT_MAX = 100;
const DEFAULT_RATE_WINDOW_MS_MINUTE = 15;
const MILLISECONDS_IN_A_MINUTE = 60000;
const DEFAULT_PORT = 3000;
const DEFAULT_NUMBER_OF_RESULTS_PER_PAGE = 20;

function getRedisConfig(): RedisLocalConfig | RedisEnvConfig {
  if (process.env.REDIS_URL != null) {
    return {
      local: true,
      url: process.env.REDIS_URL
    }
  }

  return {
    local: false,
    token: getRequiredEnv('REDIS_AUTH_TOKEN'),
    host: process.env.REDIS_HOST ?? "localhost",
    port: Number(process.env.REDIS_PORT ?? 6379),
    username: process.env.REDIS_USERNAME ?? "default",
  }
}

// Get environment variables
const config: Config = {
  CONTACT_EMAIL: process.env.CONTACT_EMAIL,
  CONTACT_PHONE: process.env.CONTACT_PHONE,
  DEPARTMENT_NAME: process.env.DEPARTMENT_NAME,
  DEPARTMENT_URL: process.env.DEPARTMENT_URL,
  RATELIMIT_HEADERS_ENABLED: process.env.RATELIMIT_HEADERS_ENABLED,
  RATELIMIT_STORAGE_URI: process.env.RATELIMIT_STORAGE_URI,
  RATE_LIMIT_MAX: Number(process.env.RATE_LIMIT_MAX ?? DEFAULT_RATE_LIMIT_MAX),
  // Default rate window: 15 minutes in milliseconds
  RATE_WINDOW_MS: Number(
    process.env.RATE_WINDOW_MS ?? String(DEFAULT_RATE_WINDOW_MS_MINUTE * MILLISECONDS_IN_A_MINUTE)
  ),
  SERVICE_NAME: process.env.SERVICE_NAME,
  SERVICE_PHASE: process.env.SERVICE_PHASE,
  SERVICE_URL: process.env.SERVICE_URL,
  session: {
    secret: process.env.SESSION_SECRET ?? "",
    name: process.env.SESSION_NAME ?? "",
    resave: false,
    saveUninitialized: false,
  },
  app: {
    port: Number(process.env.PORT ?? DEFAULT_PORT),
    environment: process.env.NODE_ENV ?? "development",
    appName: process.env.SERVICE_NAME ?? "Your service name",
    useHttps: process.env.NODE_ENV === "production", // Use HTTPS in production
  },
  csrf: {
    cookieName: "_csrf",
    secure: process.env.NODE_ENV === "production", // Only secure in production
    httpOnly: true, // Restrict client-side access
  },
  paths: {
    static: "public", // Path for serving static files
    views: "src/views", // Path for Nunjucks views
  },
  api: {
    baseUrl: process.env.API_URL ?? "",
  },
  ...(process.env.DISABLE_REDIS === "false"
    ? { redis: getRedisConfig() }
    : {}),
  pagination: {
    numberOfClaimsPerPage: Number(
      process.env.NUMBER_OF_CLAIMS_PER_PAGE ?? DEFAULT_NUMBER_OF_RESULTS_PER_PAGE
    ),
  },
};

export default config;
