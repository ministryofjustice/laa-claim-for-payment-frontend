import type { NextFunction, Request, Response } from "express";
import { processError } from "#src/helpers/index.js";

/**
 * POA successful submission view
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 */
export function poaSubmissionSuccessfulPage(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    // TODO - include some retrieval here to ensure the page corresponds to an actual submission
    res.render("main/poa/submissionSuccessfulView.njk", {
      claimId: req.params.claimId
    });
  } catch (error) {
    const processedError = processError(
      error,
      "rendering submission successful page"
    );
    next(processedError);
  }
}