import { buildRoute, ROUTES } from "#routes/helper.js";
import { processApiError, processError } from "#src/helpers/index.js";
import { formatFileSize } from "#src/helpers/fileSizeFormatter.js";
import { claimService } from "#src/services/claimService.js";
import {
  PoaEvidenceUploadViewModel
} from "#src/viewmodels/profitCostDetails/profitCostDetailsEvidenceUploadViewModel.js";
import type { NextFunction, Request, Response } from "express";
import { UUID } from "uuidv7";
import type { ReusableDocument } from "#src/viewmodels/components/taskList.js";
import { Form } from "#src/helpers/validation.js";
import { UploadField } from "#src/helpers/fields.js";

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
    const uploadedFiles: ReusableDocument[] = claim.evidence.map(
      (evidence) => ({
        id: evidence.id,
        name: evidence.fileKey,
        size: formatFileSize(evidence.fileSize),
      }),
    );

    const field = buildField();
    const form = new Form({ field });

    const vm = new PoaEvidenceUploadViewModel({
      claimId,
      form,
      uploadedFiles,
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

    const field = buildField();
    field.validate(claim);
    const form = new Form({ field }, field.validation,);

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

    res.redirect(buildRoute(ROUTES.POA_CHECK_YOUR_DETAILS, { claimId }));
  } catch (error) {
    next(processError(error, "submitting POA evidence upload page"));
  }
}

function buildField(): UploadField {
  return new UploadField(
    "multiFileUpload",
    "documents",
    "documents",
  );
}
