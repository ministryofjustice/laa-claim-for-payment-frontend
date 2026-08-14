import createHttpError from "http-errors";
import type { NextFunction, Request, Response } from "express";
import { SUPPORTED_LANGUAGES } from "#src/helpers/supportedLanguages.js";

/**
 * Validates that the language query parameter contains a supported language.
 *
 * @param {Request} req Express request object.
 * @param {Response} _res Express response object.
 * @param {NextFunction} next Express next function.
 * @returns {void}
 */
export function validateLanguage(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
    const { query: { lng } } = req

    if (lng === undefined) {
        next();
        return;
    }

    if (
        typeof lng !== "string" ||
        !SUPPORTED_LANGUAGES.includes(lng)
    ) {
        const { BadRequest } = createHttpError;
        next(new BadRequest("Unsupported language"));
        return;
    }
    
    next();
}