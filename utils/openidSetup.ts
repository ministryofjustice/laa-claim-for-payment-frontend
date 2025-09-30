// utils/oidc.ts
import type { Application, Request, Response, NextFunction } from 'express';
import { allowInsecureRequests, authorizationCodeGrant, buildAuthorizationUrl, calculatePKCECodeChallenge, ClientSecretPost, type Configuration, discovery, fetchProtectedResource, randomPKCECodeVerifier, randomState, type TokenEndpointResponse } from 'openid-client';
import { constants as Http } from 'node:http2';
import { getRequiredEnv } from '#utils/envHelper.js';
import { z } from 'zod';




let discoveredConfig: Promise<Configuration> | undefined = undefined;
const UserInfoSchema = z.record(z.string(), z.unknown());
type UserInfo = z.infer<typeof UserInfoSchema>;




export interface SessionOIDC {
  code_verifier?: string;
  state?: string;
  redirect_uri?: string;
  tokens?: TokenEndpointResponse;
  userinfo?: Record<string, unknown>;
}

declare module 'express-session' {
  interface SessionData {
    oidc?: SessionOIDC;
  }
}


/**
 * Retrieves and caches the OIDC configuration using discovery.
 * @returns {Function} A promise resolving to the OIDC configuration.
 */
export async function getConfig(): Promise<Configuration> {
  const ISSUER = new URL(getRequiredEnv('ISSUER_BASE_URL'));

  const CLIENT_ID = getRequiredEnv('CLIENT_ID');
  const CLIENT_SECRET = getRequiredEnv('OIDC_CLIENT_SECRET');
  // Only relax HTTPS when (a) it’s http:// and (b) not production
  const options =
    ISSUER.protocol === 'http:'
      ? { execute: [allowInsecureRequests] }
      : undefined;
  if (discoveredConfig === undefined) {

    const clientAuth = ClientSecretPost(CLIENT_SECRET);
    discoveredConfig = discovery(ISSUER, CLIENT_ID, CLIENT_SECRET, clientAuth, options);
  }
  return await discoveredConfig;
}


async function fetchUserInfo(
  config: Configuration,
  accessToken: string,
): Promise<UserInfo | null> {

  const meta = config.serverMetadata();
  const { userinfo_endpoint: ep = '' } = meta;
  const res = await fetchProtectedResource(
    config,
    accessToken,
    new URL(ep),
    'GET',
  );
  if (!res.ok) return null;

  const parsed = UserInfoSchema.safeParse(await res.json());

  if (!parsed.success) {
    console.warn('Invalid user info response:', parsed.error);
    return null;
  }

  return parsed.data;

}


function isAuthed(req: Request): boolean {
  return Boolean(req.session.oidc?.userinfo) ||
    Boolean(req.session.oidc?.tokens?.access_token);
}

function isJsonRequest(req: Request): boolean {
  return (req.xhr || req.get("accept")?.includes("application/json")) ?? false;
}

/**
 * Middleware to require authentication on routes.
 * If not authenticated, redirects to login or returns 401 for API requests.
 * @returns {Function} An Express middleware function.
 */
export function requiresAuth() {

  // ensure boolean

  return (req: Request, res: Response, next: NextFunction): void => {
    if (isAuthed(req) || getRequiredEnv("AUTH_ENABLED") !== 'true') {
      next();
      return;
    }

    const loginPath = getRequiredEnv("OIDC_LOGIN_PATH");

    if (isJsonRequest(req)) {
      res.status(Http.HTTP_STATUS_UNAUTHORIZED).json({ error: "unauthenticated" });
      return;
    }

    res.redirect(loginPath);
  };
}

/**
 * Sets up OIDC authentication routes on the provided Express application.
 * @param {Application} app - The Express application instance.
 */
export const oidcSetup = (app: Application): void => {
  const BASE_URL = getRequiredEnv('BASE_URL');
  const SCOPE = getRequiredEnv('OIDC_SCOPE');
  const CALLBACK_PATH = getRequiredEnv('OIDC_CALLBACK_PATH');
  const LOGIN_PATH = getRequiredEnv('OIDC_LOGIN_PATH');
  const LOGOUT_PATH = getRequiredEnv('OIDC_LOGOUT_PATH');

  // GET /login -> redirect to OP
  app.get(LOGIN_PATH, async (req: Request, res: Response) => {
    const config = await getConfig();

    const redirectUri = `${BASE_URL}${CALLBACK_PATH}`;
    const codeVerifier = randomPKCECodeVerifier();
    const codeChallenge = await calculatePKCECodeChallenge(codeVerifier);
    const state = randomState();

    // Persist flow state in the session
    req.session.oidc = {
      ...(req.session.oidc ?? {}),
      code_verifier: codeVerifier,
      state,
      redirect_uri: redirectUri,
    };

    const url = buildAuthorizationUrl(config, {
      scope: SCOPE,
      redirect_uri: redirectUri,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      state, // still good practice to send state with PKCE
    });

    res.redirect(url.href);
  });

  // GET /callback -> exchange code for tokens, fetch userinfo, store in session
  app.get(CALLBACK_PATH, async (req: Request, res: Response, next) => {
    try {
      const { session: { oidc: sess } } = req;

      if (sess?.code_verifier == null || sess.state == null || sess.redirect_uri == null) {
        return res.status(Http.HTTP_STATUS_BAD_REQUEST).send('Login session not found or expired.');
      }

      const config = await getConfig();

      // current URL that received the authorization response (includes code & state)
      const currentUrl = new URL(`${BASE_URL}${req.originalUrl}`);

      const tokens = await authorizationCodeGrant(config, currentUrl, {
        pkceCodeVerifier: sess.code_verifier,
        expectedState: sess.state,
      });

      // call UserInfo for stable user claims
      const userinfo = await fetchUserInfo(config, tokens.access_token);

      req.session.oidc = {
        ...sess,
        tokens,
        userinfo: userinfo ?? undefined,
      };

      // redirect to home page
      res.redirect('/');
    } catch (err) {
      next(err);
    }
  });

  // GET /logout -> clear session, optionally call OP logout if available
  app.get(LOGOUT_PATH, async (req: Request, res: Response) => {
    const { session } = req;
    const idToken = session.oidc?.tokens?.id_token; // read-only; do not mutate
    const config = await getConfig();
    const { end_session_endpoint: endSession } = config.serverMetadata();

    // Build the redirect first (so we can include id_token_hint), then destroy the session
    let redirectTo = '/';
    if (endSession != null) {
      const url = new URL(endSession);
      const postLogout =
        getRequiredEnv('BASE_URL');
      url.searchParams.set('post_logout_redirect_uri', postLogout);

      // Many OPs require id_token_hint
      if (idToken != null) url.searchParams.set('id_token_hint', idToken);

      ({ href: redirectTo } = url);
    }

    req.session.destroy(() => { res.redirect(redirectTo); });
  });

}
