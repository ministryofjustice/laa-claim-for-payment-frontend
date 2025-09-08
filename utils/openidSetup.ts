// utils/oidc.ts
import type { Application, Request, Response, RequestHandler, NextFunction } from 'express';
import * as oidc from 'openid-client';

const issuer = new URL(process.env.ISSUER_BASE_URL!);

// Only relax HTTPS when (a) it’s http:// and (b) not production
const options =
  issuer.protocol === 'http:' && process.env.NODE_ENV !== 'production'
    ? { execute: [oidc.allowInsecureRequests] }
    : undefined;


export interface SessionOIDC {
  code_verifier?: string;
  state?: string;
  redirect_uri?: string;
  tokens?: oidc.TokenEndpointResponse;
  userinfo?: Record<string, unknown> | null;
}

declare module 'express-session' {
  interface SessionData {
    oidc?: SessionOIDC;
  }
}

/**
 * Retrieves the value of an environment variable by name, throwing an error if it is missing.
 * @param name - The name of the environment variable.
 * @returns The value of the environment variable.
 * @throws If the environment variable is not set.
 */
function env(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}


let discoveredConfig: Promise<oidc.Configuration> | undefined;

/**
 * Retrieves and caches the OIDC configuration using discovery.
 * @returns A promise resolving to the OIDC configuration.
 */
async function getConfig(): Promise<oidc.Configuration> {
  if (!discoveredConfig) {
    const clientId = env('CLIENT_ID');
    const clientSecret = env('OIDC_CLIENT_SECRET');
    const clientAuth = oidc.ClientSecretPost(clientSecret);
    discoveredConfig = oidc.discovery(issuer, clientId, clientSecret, clientAuth, options);
  }
  return discoveredConfig;
}

/**
 * Optionally call the UserInfo endpoint to get profile claims.
 * (Safer than decoding id_token yourself; works across OPs.)
 * @param config - The OIDC configuration object.
 * @param accessToken - The access token to use for the UserInfo request.
 * @returns A promise resolving to user info claims as an object, or null if not available.
 */
async function fetchUserInfo(
  config: oidc.Configuration,
  accessToken?: string,
): Promise<Record<string, unknown> | null> {
  if (!accessToken) return null;
  const meta = config.serverMetadata();
  const ep = meta.userinfo_endpoint;
  if (!ep) return null;
  const res = await oidc.fetchProtectedResource(
    config,
    accessToken,
    new URL(ep),
    'GET',
  );
  if (!res.ok) return null;
  return res.json() as Promise<Record<string, unknown>>;
}

export function requiresAuth(opts?: {
  loginPath?: string;          // where to send browsers
  enabled?: boolean;           // feature-flag (default true)
  api?: boolean;               // if true, return 401 JSON instead of redirect
}): RequestHandler {
  const loginPath = opts?.loginPath ?? process.env.OIDC_LOGIN_PATH ?? '/login';
  const enabled = opts?.enabled ?? (process.env.AUTH_ENABLED ?? 'true') !== 'false';
  const asApi = opts?.api ?? false;

  return (req: Request, res: Response, next: NextFunction) => {
    if (!enabled) return next();

    const authed =
      Boolean(req.session?.oidc?.userinfo) ||
      Boolean(req.session?.oidc?.tokens?.access_token);

    if (authed) return next();

    if (asApi || req.xhr || req.get('accept')?.includes('application/json')) {
      return res.status(401).json({ error: 'unauthenticated' });
    }

    // For HTML requests, bounce to login
    return res.redirect(loginPath);
  };
}

/**
 * Sets up OIDC authentication routes on the provided Express application.
 * @param app - The Express application instance.
 */
export const oidcSetup = (app: Application): void => {
  const BASE_URL = env('BASE_URL'); // e.g. https://app.example.com
  const SCOPE = process.env.OIDC_SCOPE ?? 'openid profile email';
  const CALLBACK_PATH = process.env.OIDC_CALLBACK_PATH ?? '/callback';
  const LOGIN_PATH = process.env.OIDC_LOGIN_PATH ?? '/login';
  const LOGOUT_PATH = process.env.OIDC_LOGOUT_PATH ?? '/logout';

  // GET /login -> redirect to OP
  app.get(LOGIN_PATH, async (req: Request, res: Response) => {
    const config = await getConfig();

    const redirectUri = `${BASE_URL}${CALLBACK_PATH}`;
    const codeVerifier = oidc.randomPKCECodeVerifier();
    const codeChallenge = await oidc.calculatePKCECodeChallenge(codeVerifier);
    const state = oidc.randomState();

    // Persist flow state in the session
    req.session.oidc = {
      ...(req.session.oidc ?? {}),
      code_verifier: codeVerifier,
      state,
      redirect_uri: redirectUri,
    };

const cfg = await getConfig();
const authz = cfg.serverMetadata().authorization_endpoint;
const base = process.env.BASE_URL ?? 'http://localhost:3000';
const cb   = new URL(process.env.OIDC_CALLBACK_PATH ?? '/callback', base).toString();

console.log('issuer            :', issuer.href);
console.log('authorization_ep  :', authz);
console.log('redirect_uri (Node):', cb);

const aurl = oidc.buildAuthorizationUrl(cfg, { /* … */ });
console.log('built auth URL    :', aurl.href);

    const url = oidc.buildAuthorizationUrl(config, {
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
      const sess = req.session.oidc;
      if (!sess?.code_verifier || !sess?.state || !sess?.redirect_uri) {
        return res.status(400).send('Login session not found or expired.');
      }

      const config = await getConfig();

      // current URL that received the authorization response (includes code & state)
      const currentUrl = new URL(`${BASE_URL}${req.originalUrl}`);

      const tokens = await oidc.authorizationCodeGrant(config, currentUrl, {
        pkceCodeVerifier: sess.code_verifier,
        expectedState: sess.state,
      });

      // Optional: call UserInfo for stable user claims
      const userinfo = await fetchUserInfo(config, tokens.access_token);

      req.session.oidc = {
        ...sess,
        tokens,
        userinfo: userinfo ?? null,
      };

      // redirect to wherever makes sense post-login
      res.redirect('/');
    } catch (err) {
      next(err);
    }
  });

  // GET /logout -> clear session, optionally call OP logout if available
  app.get(LOGOUT_PATH, async (req: Request, res: Response) => {
    const endSession = (await getConfig()).serverMetadata().end_session_endpoint;
    req.session.destroy(() => {
      if (endSession) {
        // Some OPs accept post_logout_redirect_uri; others vary
        const url = new URL(endSession);
        const postLogout = process.env.OIDC_POST_LOGOUT_REDIRECT_URI ?? `${BASE_URL}/`;
        url.searchParams.set('post_logout_redirect_uri', postLogout);
        res.redirect(url.href);
      } else {
        res.redirect('/');
      }
    });
  });
}
