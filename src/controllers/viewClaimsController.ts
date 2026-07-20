import { claimService } from "#src/services/claimService.js";
import type { NextFunction, Request, Response } from "express";
import { ClaimsTableViewModel } from "#src/viewmodels/claimsViewModel.js";
import { parseNumberQueryParam, processApiError, processError } from "#src/helpers/index.js";
import { InvalidPageError } from "#src/types/errors.js";
import { buildRoute, ROUTES } from "#routes/helper.js";
import type { ViewClaimsActionRequest } from "#src/types/requests.js";

/**
 * Handle claims view with API data
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

/**
 * Handle claims view action
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 * @returns {Promise<void>} Page to be returned
 */
export async function handleYourClaimsActionPage(
  req: Request<unknown, unknown, ViewClaimsActionRequest>,
  res: Response,
  next: NextFunction
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/prefer-destructuring -- ignore
  const { action } = req.body;

  switch (action) {
    case "create": {
      res.redirect(
        buildRoute(ROUTES.CHOOSE_UPLOAD, {
          claimId: "019f5c43-d9f0-732e-88b2-1ca29c6c41de", //todo test only
        }),
      );
      return;
    }
    case "import": {
      res.redirect("/import");
      return;
    }
    case "poa": {
      const response = await claimService.createClaim(req.axiosMiddleware);
      if (response.status === "success") {
        res.redirect(
          buildRoute(ROUTES.POA_CLAIM_TYPE, {
            claimId: response.body.toString(),
          }),
        );
        return;
      }
      next(processApiError(response, "Creating draft claim"));
    }
  }
}
