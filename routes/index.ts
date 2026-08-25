import { viewClaimPage } from "#src/controllers/claims/viewClaimController.js";
import { handleYourClaimsActionPage, handleYourClaimsPage } from "#src/controllers/viewClaimsController.js";
import type { NextFunction, Request, Response, Router } from "express";
import express from "express";
import { ROUTES } from "./helper.js";
import { getFileRow } from "#src/controllers/claims/ajaxFileUploadController.js";
import type { ViewClaimsActionRequest } from "#src/types/requests.js";
import { buildLineItemUploadRouter } from "./lineItemUpload.js";
import { buildPoaRouter } from "./poa.js";

/**
 * Builds the main application router.
 *
 * @returns {Router} Configured Express router.
 */
export const buildRouter = (): Router => {
  const router = express.Router();

  /* GET home page. */
  router.get(
    ROUTES.INDEX,
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      await handleYourClaimsPage(req, res, next);
    },
  );

  router.post(
    ROUTES.INDEX,
    async (
      req: Request<unknown, unknown, ViewClaimsActionRequest>,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      await handleYourClaimsActionPage(req, res, next);
    },
  );

  /* GET view claim page. */
  router.get(
    ROUTES.VIEW_CLAIM,
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      await viewClaimPage(req, res, next);
    },
  );

  router.use(buildLineItemUploadRouter());

  router.use(buildPoaRouter());

  router.get(
    ROUTES.AJAX_GET_FILE_ROW,
    (req: Request, res: Response, next: NextFunction): void => {
      getFileRow(req, res, next);
    },
  );

  // Make an API call with `Axios` and `middleware-axios`
  // GET users from external API
  router.get(
    "/users",
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      try {
        // Use the Axios instance attached to the request object
        const response = await req.axiosMiddleware.get(
          "https://jsonplaceholder.typicode.com/users",
        );
        res.json(response.data);
      } catch (error) {
        next(error);
      }
    },
  );

  /* TEST show user properties */
  router.get("/user", (req: Request, res: Response): void => {
    res.render("main/user.njk");
  });

  return router;
};