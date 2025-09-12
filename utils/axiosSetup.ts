// middleware/axios.ts
import { type AxiosInstanceWrapper, create } from 'middleware-axios';
import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { Request, Response, NextFunction } from 'express';
import * as oidc from 'openid-client';
import { constants as Http } from 'node:http2';
import { getConfig } from './openidSetup.js';
import { getRequiredEnv } from '#utils/envHelper.js';


const DEFAULT_TIMEOUT = 5000;

declare global {
  namespace Express {
    interface Request {
      axiosMiddleware: AxiosInstanceWrapper;
    }
  }
}


/**
 * Middleware to attach an Axios instance to the request object.
 * The Axios instance automatically includes the current access token
 * in the Authorization header and handles token refresh on 401 responses.
 *  @param {import('express').Request} req - The Express request object
 *  @param {import('express').Response} _res - The Express response object
 *  @param {import('express').NextFunction} next - The next middleware function
 */
export const axiosMiddleware = (req: Request, _res: Response, next: NextFunction): void => {

  const { protocol } = req;
  const host = req.get("host");
  const apiURL = `${protocol}://${host}`;
  console.log(`Axios baseURL set to ${apiURL}`);
  // Primary client (has interceptor)
  const client = create({
    baseURL: apiURL,
    timeout: DEFAULT_TIMEOUT,
  });

  const retryClient = create({
    baseURL: apiURL,
    timeout: DEFAULT_TIMEOUT,
  });

  const { axiosInstance: axiosInstanceMain } = client;
   const { axiosInstance: axiosRetryInstance } = retryClient;

  // Attach current access token to every request
  const attachToken = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const access = req.session.oidc?.tokens?.access_token;
     
    if (typeof access === 'string' && access.length > 0) {
      const headers = axios.AxiosHeaders.from(config.headers);
      headers.set('Authorization', `Bearer ${access}`);
      config.headers = headers;
    }
    return config;
  };

  axiosInstanceMain.interceptors.request.use(attachToken);
  axiosRetryInstance.interceptors.request.use(attachToken);

  // Single-flight refresh gate per incoming HTTP request
  let refreshing: Promise<void> | null = null;

  

// Helper to strip methods like claims() / expiresIn()
function toPlainTokens(tokens: oidc.TokenEndpointResponse): oidc.TokenEndpointResponse {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- to fix
  return Object.fromEntries(
    Object.entries(tokens).filter(([, v]) => typeof v !== 'function')
  ) as oidc.TokenEndpointResponse;
}

  axiosInstanceMain.interceptors.response.use(
    r => r,

    async (error: AxiosError) => {
      const { response, config } = error;

      if ((getRequiredEnv('AUTH_ENABLED') !== 'true') || response == null || response.status !== Http.HTTP_STATUS_UNAUTHORIZED || config == null) {
        return await Promise.reject(error);
      }

      const rt = req.session.oidc?.tokens?.refresh_token;
      if (rt == null) return await Promise.reject(error); // nothing to do

      // Run exactly one refresh; concurrent 401s await the same promise

      refreshing ??= (async () => {
        const cfg = await getConfig();
        
        const refreshed = await oidc.refreshTokenGrant(cfg, rt);
        const prev = req.session.oidc?.tokens;
        req.session.oidc = {
          ...(req.session.oidc ?? {}),
           tokens: {
    ...(prev !== undefined ? toPlainTokens(prev) : {}),
    ...toPlainTokens(refreshed),
  } ,
        };
      })().finally(() => {
        refreshing = null;
      });


      try {
        await refreshing;
      } catch {
        return await Promise.reject(error); // refresh failed
      }

      // Retry the original request ONCE using the bare client (no interceptor loop)
      const newAccess = req.session.oidc?.tokens?.access_token;
      const headers = axios.AxiosHeaders.from(config.headers);
       
      if (typeof newAccess === 'string' && newAccess.length > 0) {
        headers.set('Authorization', `Bearer ${newAccess}`);
      }
      return await retryClient.request({ ...config, headers });
    }
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-type-assertion -- to fix
  (req as any).axiosMiddleware = client;
  next();
};