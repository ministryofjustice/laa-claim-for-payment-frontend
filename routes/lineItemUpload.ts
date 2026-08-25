import type { NextFunction, Request, Response, Router } from "express";
import express from "express";
import config from "#config.js";
import { viewUploadEvidenceIndividuallyPage } from "#src/controllers/claims/uploadEvidenceIndividuallyController.js";
import { chooseFileUpload, submitChooseFileUpload } from "#src/controllers/claims/chooseUploadController.js";
import { fileUploadForLineItemPage, linkEvidenceToLineItem } from "#src/controllers/claims/fileUploadForLineItemController.js";
import { unlinkEvidenceFileFromLineItem, uploadEvidenceFileForLineItem } from "#src/controllers/claims/ajaxFileUploadController.js";
import { evidenceUpload } from "#src/helpers/multerUpload.js";
import { multerErrorHandler, registerIf, ROUTES } from "./helper.js";

/**
 * Builds the line item upload router.
 *
 * @returns {Router} Configured line item upload router.
 */
export const buildLineItemUploadRouter = (): Router => {
  const router = express.Router();

  registerIf(config.featureFlags.lineItemUploadEnabled, () => {
    router.get(
      ROUTES.LINE_ITEM_UPLOAD.UPLOAD_EVIDENCE_INDIVIDUALLY,
      async (
        req: Request,
        res: Response,
        next: NextFunction,
      ): Promise<void> => {
        await viewUploadEvidenceIndividuallyPage(req, res, next);
      },
    );

    router.get(
      ROUTES.LINE_ITEM_UPLOAD.CHOOSE_UPLOAD,
      (req: Request, res: Response, next: NextFunction): void => {
        chooseFileUpload(req, res, next);
      },
    );

    router.post(
      ROUTES.LINE_ITEM_UPLOAD.CHOOSE_UPLOAD,
      (req: Request, res: Response, next: NextFunction): void => {
        submitChooseFileUpload(req, res, next);
      },
    );

    router.post(
      ROUTES.LINE_ITEM_UPLOAD.AJAX_UPLOAD,
      evidenceUpload.single("documents"),
      multerErrorHandler,
      uploadEvidenceFileForLineItem,
    );

    router.post(
      ROUTES.LINE_ITEM_UPLOAD.AJAX_DELETE,
      unlinkEvidenceFileFromLineItem,
    );

    router.get(
      ROUTES.LINE_ITEM_UPLOAD.FILE_UPLOAD,
      async (
        req: Request,
        res: Response,
        next: NextFunction,
      ): Promise<void> => {
        await fileUploadForLineItemPage(req, res, next);
      },
    );

    router.post(
      ROUTES.LINE_ITEM_UPLOAD.FILE_UPLOAD,
      async (
        req: Request,
        res: Response,
        next: NextFunction,
      ): Promise<void> => {
        await linkEvidenceToLineItem(req, res, next);
      },
    );
  });

  return router;
};