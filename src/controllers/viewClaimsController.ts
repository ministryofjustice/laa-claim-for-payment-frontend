import { claimService } from "#src/services/claimService.js";
import type { NextFunction, Request, Response } from "express";
import { ClaimsTableViewModel } from "#src/viewmodels/claimsViewModel.js";
import { parseNumberQueryParam, processApiError, processError } from "#src/helpers/index.js";
import { InvalidPageError } from "#src/types/errors.js";
import { buildRoute, ROUTES } from "#routes/helper.js";

/**
 * Handle claim view with API data
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 * @returns {Promise<void>} Page to be returned
 */
export async function handleYourClaimsPage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    
    const requestPage = parseNumberQueryParam(req.query.page, 1)-1;
    const limit = 10; //todo get this from somewhere, probs config
    const response = await claimService.getClaims(req.axiosMiddleware, requestPage, limit);
    if (response.status === "success") {
      const claimsTableViewModel: ClaimsTableViewModel = new ClaimsTableViewModel(
        response.body.data,
        response.body.meta,
        req.path
      );

      res.render("main/index.njk", {
        table: claimsTableViewModel.table,
        pagination: claimsTableViewModel.pagination,
        createClaimHref: buildRoute(ROUTES.CHOOSE_UPLOAD, {
          claimId: 3, //todo test only
        }),
      });
    } else {
      next(processApiError(response, `fetching claims details for user`));
    }
  } catch (error) {
    if (error instanceof InvalidPageError) {
      console.info(error.message);
      res.redirect(`${ROUTES.CLAIMS}?page=${error.pageToRedirectTo}`);
    } else {
      next(processError(error, `fetching claims details for user`));
    }
  }
}
