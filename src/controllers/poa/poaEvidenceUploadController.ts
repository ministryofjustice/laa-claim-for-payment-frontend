import { buildRoute, ROUTES } from "#routes/helper.js";
import { processApiError, processError } from "#src/helpers/index.js";
import { claimService } from "#src/services/claimService.js";
import {
  PoaEvidenceUploadViewModel
} from "#src/viewmodels/poa/evidenceUploadViewModel.js";
import type { NextFunction, Request, Response } from "express";
import { UUID } from "uuidv7";
import { UploadField } from "#src/helpers/fields.js";
import { UploadForm } from "#src/helpers/fileUploadValidation.js";

/**
 * Display POA evidence upload page.
 *
 * @param {Request} req Express request object.
 * @param {Response} res Express response object.
 * @param {NextFunction} next Express next function.
 */
export async function poaEvidenceUploadPage(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const claimId = UUID.parse(req.params.claimId);
    const response = await claimService.getDraftClaim(
      req.axiosMiddleware,
      claimId,
    );

    if (response.status !== "success") {
      next(processApiError(response, "fetching POA evidence upload details"));
      return;
    }

    const { body: claim } = response;

    const form = new UploadForm(buildField());
    form.fill(claim.evidence);

    const vm = new PoaEvidenceUploadViewModel({
      claimId,
      form,
    });

    res.render("main/poa/poaEvidenceUploadView.njk", {
      csrfToken: res.locals.csrfToken,
      vm,
    });
  } catch (error) {
    next(processError(error, "rendering POA evidence upload page"));
  }
}

/**
 * Submit POA evidence upload page.
 *
 * @param {Request} req Express request object.
 * @param {Response} res Express response object.
 * @param {NextFunction} next Express next function.
 */
export async function submitPoaEvidenceUpload(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const claimId = UUID.parse(req.params.claimId);
    const response = await claimService.getDraftClaim(
      req.axiosMiddleware,
      claimId,
    );

    if (response.status !== "success") {
      next(processApiError(response, "fetching POA evidence upload details"));
      return;
    }

    const { body: claim } = response;

    const form = new UploadForm(buildField());
    form.validate(claim.evidence);

    if (form.isNotValid()) {
      const vm = new PoaEvidenceUploadViewModel({
        claimId,
        form,
      });

      res.status(400).render("main/poa/poaEvidenceUploadView.njk", {
        csrfToken: res.locals.csrfToken,
        vm,
      });
      return;
    }

    res.redirect(buildRoute(ROUTES.POA.CHECK_DETAILS, { claimId }));
  } catch (error) {
    next(processError(error, "submitting POA evidence upload page"));
  }
}

function buildField(): UploadField {
  return new UploadField(
    "pages.poaEvidenceUpload",
    "documents",
    "documents",
  );
}
