import { rateLimit } from "express-rate-limit";
import { viewClaimPage } from "#src/controllers/claims/viewClaimController.js";
import { handleYourClaimsPage } from "#src/controllers/viewClaimsController.js";
import type { NextFunction, Request, Response } from "express";
import express from "express";
import { viewUploadEvidenceIndividuallyPage } from "#src/controllers/claims/uploadEvidenceIndividuallyController.js";
import { chooseFileUpload, submitChooseFileUpload } from "#src/controllers/claims/chooseUploadController.js";
import { ROUTES } from "./helper.js";


const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per minute
});

const router = express.Router();

/* GET home page. */
router.get(
  ROUTES.CLAIMS,
  limiter,
  async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    await handleYourClaimsPage(req, res, next);
  },
);

/* GET view claim page. */
router.get(
  ROUTES.VIEW_CLAIM,
  limiter,
  async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    await viewClaimPage(req, res, next);
  },
);

/* GET view upload evidence individually page. */
router.get(
  ROUTES.UPLOAD_EVIDENCE_INDIVIDUALLY,
  limiter,
  async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    await viewUploadEvidenceIndividuallyPage(req, res, next);
  },
);

/* GET choose how to upload file page. */
router.get(ROUTES.CHOOSE_UPLOAD, limiter, function (req: Request, res: Response, next: NextFunction): void {
  chooseFileUpload(req, res, next);
});

/* POST choose how to upload file page. */
router.post(ROUTES.CHOOSE_UPLOAD, limiter, function (req: Request, res: Response, next: NextFunction): void {
  submitChooseFileUpload(req, res, next);
});

// Make an API call with `Axios` and `middleware-axios`
// GET users from external API
router.get(
  "/users",
  limiter,
  async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
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
router.get("/user", function (req: Request, res: Response): void {
  res.render("main/user");
});

export default router;
