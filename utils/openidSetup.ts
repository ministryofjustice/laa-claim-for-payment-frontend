// utils/oidc.ts
import type { Application, Request, Response, RequestHandler, NextFunction } from 'express';
import * as oidc from 'openid-client';
import { constants as Http } from 'node:http2';

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
 * @param {string} name - The name of the environment variable.
 * @returns {string} The value of the environment variable.
 * @throws If the environment variable is not set.
 */
function env(name: string): string {
  const { env } = process;
  // eslint-disable-next-line @typescript-eslint/prefer-destructuring -- can't use des
  const v= env[name];
  if (v == null) throw new Error(`Missing required env var: ${name}`);
  return v;
}


let discoveredConfig: Promise<oidc.Configuration> | undefined = undefined;

/**
 * Retrieves and caches the OIDC configuration using discovery.
 * @returns {Function} A promise resolving to the OIDC configuration.
 */
export async function getConfig(): Promise<oidc.Configuration> {
  if (discoveredConfig === undefined) {
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
 * @param {oidc.Configuration} config - The OIDC configuration object.
 * @param {string} accessToken - The access token to use for the UserInfo request.
 * @returns {Promise<Record<string, unknown>} A promise resolving to user info claims as an object, or null if not available.
 */
async function fetchUserInfo(
  config: oidc.Configuration,
  accessToken: string,
): Promise<Record<string, unknown> | null> {
  const meta = config.serverMetadata();
  const { userinfo_endpoint : ep = ''} = meta;
  const res = await oidc.fetchProtectedResource(
    config,
    accessToken,
    new URL(ep),
    'GET',
  );
  if (!res.ok) return null;
  return res.json() as Promise<Record<string, unknown>>;
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
  const loginPath = env("OIDC_LOGIN_PATH");
  const enabled = env("AUTH_ENABLED") === "true"; // ensure boolean

  return (req: Request, res: Response, next: NextFunction): void => {
    if (isAuthed(req) || !enabled) {
      next();
      return;
    }

    if (isJsonRequest(req)) {
      res.status(Http.HTTP_STATUS_UNAUTHORIZED).json({ error: "unauthenticated" });
      return;
    }

    res.redirect(loginPath);
  };
}

/**
 * Sets up OIDC authentication routes on the provided Express application.
 * @param app - The Express application instance.
 */
export const oidcSetup = (app: Application): void => {
  const BASE_URL = env('BASE_URL'); 
  const SCOPE = env('OIDC_SCOPE');
  const CALLBACK_PATH = env('OIDC_CALLBACK_PATH');
  const LOGIN_PATH = env('OIDC_LOGIN_PATH');
  const LOGOUT_PATH = env('OIDC_LOGOUT_PATH');

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
      const {session: {oidc : sess}} = req;
      
      if (sess?.code_verifier == null || sess.state == null || sess.redirect_uri == null) {
        return res.status(Http.HTTP_STATUS_BAD_REQUEST).send('Login session not found or expired.');
      }

      const config = await getConfig();

      // current URL that received the authorization response (includes code & state)
      const currentUrl = new URL(`${BASE_URL}${req.originalUrl}`);

      const tokens = await oidc.authorizationCodeGrant(config, currentUrl, {
        pkceCodeVerifier: sess?.code_verifier,
        expectedState: sess?.state,
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
  const { session } = req;
  const idToken = session?.oidc?.tokens?.id_token; // read-only; do not mutate

  const endSession = (await getConfig()).serverMetadata().end_session_endpoint;

  // Build the redirect first (so we can include id_token_hint), then destroy the session
  let redirectTo = '/';
  if (endSession) {
    const url = new URL(endSession);
    const postLogout =
      env('BASE_URL');
    url.searchParams.set('post_logout_redirect_uri', postLogout);

    // Many OPs require id_token_hint
    if (idToken) url.searchParams.set('id_token_hint', idToken);

    redirectTo = url.href;
  }

  req.session.destroy(() => res.redirect(redirectTo));
});

}
