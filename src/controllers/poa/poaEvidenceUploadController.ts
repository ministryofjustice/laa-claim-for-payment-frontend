import { buildRoute, ROUTES } from "#routes/helper.js";
import { processApiError, processError } from "#src/helpers/index.js";
import { formatFileSize } from "#src/helpers/fileSizeFormatter.js";
import { claimService } from "#src/services/claimService.js";
import { PoaEvidenceUploadViewModel } from "#src/viewmodels/profitCostDetails/profitCostDetailsEvidenceUploadViewModel.js";
import type { NextFunction, Request, Response } from "express";

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
    const claimId = Number(req.params.claimId);
    const response = await claimService.getClaim(req.axiosMiddleware, claimId);

     if (response.status !== "success") {
      next(processApiError(response, "fetching POA evidence upload details"));
      return;
    }

    const uploadedFiles =
      response.body.evidence?.map((evidence) => ({
        id: evidence.id,
        name: evidence.fileKey,
        size: formatFileSize(evidence.fileSize),
      })) ?? [];

    const vm = new PoaEvidenceUploadViewModel({
      uploadUrl: buildRoute(ROUTES.AJAX_UPLOAD_POA_EVIDENCE, { claimId }),
      deleteUrl: buildRoute(ROUTES.AJAX_DELETE_POA_EVIDENCE, { claimId }),
      saveAndContinueHref: buildRoute(ROUTES.POA_CHECK_YOUR_DETAILS, { claimId }),
      saveAndComeBackLaterHref: "#",
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
    const claimId = Number(req.params.claimId);
    const response = await claimService.getClaim(req.axiosMiddleware, claimId);

    if (response.status !== "success") {
      next(processApiError(response, "fetching POA evidence upload details"));
      return;
    }

    const uploadedFiles = response.body.evidence ?? [];

    if (uploadedFiles.length === 0) {
      const vm = new PoaEvidenceUploadViewModel({
        uploadUrl: buildRoute(ROUTES.AJAX_UPLOAD_POA_EVIDENCE, { claimId }),
        deleteUrl: buildRoute(ROUTES.AJAX_DELETE_POA_EVIDENCE, { claimId }),
        saveAndContinueHref: buildRoute(ROUTES.POA_CHECK_YOUR_DETAILS, {
          claimId,
        }),
        saveAndComeBackLaterHref: "#",
        errors: [
          {
            fieldName: "documents",
            href: "#documents",
            text: {
              key: "multiFileUpload.errors.noFileSelected",
            },
          },
        ],
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
