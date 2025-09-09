// middleware/axios.ts
import { create } from 'middleware-axios';
import type { Request, Response, NextFunction } from 'express';
import * as oidc from 'openid-client';
import { getConfig } from './openidSetup.js';
import { decodeJwt } from 'jose';

const DEFAULT_TIMEOUT = 5000;
const { env: {API_URL: API_BASE}} = process;
const SKEW_SECONDS = 30;

declare global {
  namespace Express {
    interface Request {
      axiosMiddleware: ReturnType<typeof create>;
    }
  }
}

async function getValidAccessToken(
  req: Request,
  cfg: oidc.Configuration
): Promise<string> {
  const { session } = req;
  if (session?.oidc == null) throw new Error('No session available');

  const { oidc: sess } = session;
  const { tokens } = sess;
  if (!tokens?.access_token) throw new Error('No access token in session');

  const now = Math.floor(Date.now() / 1000);

  // Compute an ephemeral expiry without writing to the token object
  const expiresAtFromToken = (tokens as Record<string, unknown>)['expires_at'];
  const jwtExp = safeDecodeExp(tokens.access_token);
  const computedExpiresAt =
    (typeof expiresAtFromToken === 'number' ? expiresAtFromToken : undefined) ??
    jwtExp;

  // If we can determine expiry and it's near/over, refresh and REPLACE tokens
  if (typeof computedExpiresAt === 'number' && computedExpiresAt <= now + SKEW_SECONDS) {
    const { refresh_token: rt } = tokens;
    if (!rt) throw new Error('No refresh_token available');

    const refreshed = await oidc.refreshTokenGrant(cfg, rt);
    // Replace the whole tokens object; do not mutate its fields
    sess.tokens = { ...tokens, ...refreshed };

    return sess.tokens.access_token!;
  }

  // Otherwise assume current token is fine
  return tokens.access_token;
}

function safeDecodeExp(accessToken: string): number | undefined {
  try {
    const { exp } = decodeJwt(accessToken);
    return typeof exp === 'number' ? exp : undefined;
  } catch {
    return undefined;
  }
}

export const axiosMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  const client = create({
    baseURL: API_BASE,
    timeout: DEFAULT_TIMEOUT,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  });

  // IMPORTANT: reach the raw axios instance
  const axios = (client as any).axiosInstance ?? (client as any); // fall back if wrapper proxies it

  axios.interceptors.request.use(async (config: any) => {
    const authEnabled = (process.env.AUTH_ENABLED ?? 'true') !== 'false';
    if (!authEnabled) return config;

    const cfg = await getConfig();
    const token = await getValidAccessToken(req, cfg);
    config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` };
    return config;
  });

  axios.interceptors.response.use(
    (resp: any) => resp,
    (err: any) => {
      if (err?.response?.status === 401 && req.session?.oidc?.tokens) {
        (req.session.oidc.tokens as any).expires_at = 0; // force refresh on next try
      }
      return Promise.reject(err);
    },
  );

  req.axiosMiddleware = client;
  next();
};
