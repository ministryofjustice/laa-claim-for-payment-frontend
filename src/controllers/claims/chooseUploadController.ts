import { buildRoute, ROUTES } from "#routes/helper.js";
import { createProcessedError } from "#src/helpers/errorHandler.js";
import {
  ChooseUploadViewModel,
  FileUploadChoice,
  fileUploadFieldName,
  isValidFileUploadChoice,
} from "#src/viewmodels/chooseUploadViewModel.js";
import type { Request, Response, NextFunction } from "express";

/**
 * Choose file upload journey view
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 */
export function chooseFileUpload(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    res.render("main/claims/chooseUploadView.njk", {
      csrfToken: res.locals.csrfToken,
      vm: new ChooseUploadViewModel(),
    });
  } catch (error) {
    const processedError = createProcessedError(
      error,
      "rendering choose file upload page"
    );
    next(processedError);
  }
}

/**
 * Submit choose file upload journey
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 */
export function submitChooseFileUpload(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const { params } = req;
    const { claimId } = params;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Express request bodies are untyped at the controller boundary.
    const selectedChoice: unknown = req.body?.[fileUploadFieldName];

    if (!isValidFileUploadChoice(selectedChoice)) {
      res.status(400).render("main/claims/chooseUploadView.njk", {
        csrfToken: res.locals.csrfToken,
        vm: new ChooseUploadViewModel({
          selectedValue: typeof selectedChoice === "string" ? selectedChoice : undefined,
          error: {
            text: "pages.chooseUpload.error.empty",
          },
        }),
      });
      return;
    }

    const redirectByFileUploadChoice: Record<FileUploadChoice, string> = {
      [FileUploadChoice.AllAtOnce]: "/all-at-once-file-upload",
      [FileUploadChoice.AssociatedToLineItems]: buildRoute(ROUTES.UPLOAD_EVIDENCE_INDIVIDUALLY, {claimId}),
    };

    res.redirect(redirectByFileUploadChoice[selectedChoice]);
  } catch (error) {
    const processedError = createProcessedError(
      error,
      "submitting choose file upload page"
    );
    next(processedError);
  }
}