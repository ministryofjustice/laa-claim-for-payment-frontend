import { csrfSync } from "csrf-sync";
import type { Application, Request, Response, NextFunction } from "express";
// Import CSRF token type definitions
import "#src/types/csrf-types.js";

/**
 * Type guard to check if an object has a _csrf property
 * @param {unknown} body - The request body to check
 * @returns {boolean} True if body has _csrf property
 */
const hasCSRFToken = (body: unknown): body is { _csrf: unknown } =>
  body !== null && body !== undefined && typeof body === "object" && "_csrf" in body;

/**
 * Sets up CSRF protection for an Express application.
 *
 * - Protects against CSRF attacks using `csrfSync`.
 * - Ensures CSRF tokens are available in views for forms.
 *
 * @param {Application} app - The Express application instance.
 * @param {Function} [csrfFactory=csrfSync] - Factory function used to create
 * the CSRF protection middleware. Defaults to `csrfSync`. This can be overridden in tests
 */
export const setupCsrf = (app: Application, csrfFactory = csrfSync): void => {
  const { csrfSynchronisedProtection } = csrfFactory({
    /**
     * Extracts the CSRF token from the request body.
     *
     * @param {Request} req - The incoming request object.
     * @returns {string|undefined} The CSRF token if present, otherwise undefined.
     */
    getTokenFromRequest: (req: Request): string | undefined => {
      const body = req.body as unknown;

      if (hasCSRFToken(body)) {
        const { _csrf } = body;
        return typeof _csrf === "string" ? _csrf : undefined;
      }

      if (req.session.csrfToken != null) {
        return req.session.csrfToken;
      }

      return undefined;
    },
  });

  /**
   * Middleware to enforce CSRF protection on incoming requests.
   * This applies the `csrfSynchronisedProtection` middleware globally.
   */
  app.use(csrfSynchronisedProtection);

  /**
   * Middleware to expose the CSRF token to views.
   * Adds `res.locals.csrfToken`, making it accessible in templates.
   *
   * @param {Request} req - The incoming request object.
   * @param {Response} res - The response object.
   * @param {NextFunction} next - Callback to pass control to the next middleware.
   */
  app.use((req: Request, res: Response, next: NextFunction): void => {
    if (typeof req.csrfToken === "function") {
      res.locals.csrfToken = req.csrfToken(); // Makes CSRF token available in views
    }
    next();
  });
};
