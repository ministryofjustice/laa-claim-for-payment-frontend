/**
 * @file Locale middleware for Express applications
 * Provides internationalization (i18n) support by injecting locale data into templates
 */

import type { Request, Response, NextFunction } from 'express';

/**
 * Express middleware to inject locale data into template locals
 * This makes the locale data available in all Nunjucks templates
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 * @returns {void}
 */
export function setupLocaleMiddleware(req: Request, res: Response, next: NextFunction): void {
  res.locals = { lang: req.language, t: req.t };
  req.locale = { t: req.t };

  next();
}
