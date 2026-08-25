import type { NextFunction, Request, Response, Router } from "express";
import express from "express";
import config from "#config.js";
import { evidenceUpload } from "#src/helpers/multerUpload.js";
import { howManyClientsRetained, submitHowManyClientsRetained } from "#src/controllers/poa/howManyClientsRetainedController.js";
import { poaClaimTypePage, submitPoaClaimType } from "#src/controllers/poa/poaClaimTypeController.js";
import { profitCostDetails, submitProfitCostDetails } from "#src/controllers/poa/profitCostDetailsController.js";
import { multipleClientHearings, submitMultipleClientHearings } from "#src/controllers/poa/multipleClientHearingsController.js";
import { numberOfClientsStartOfCase, submitNumberOfClientsStartOfCase } from "#src/controllers/poa/numberOfClientsStartOfCaseController.js";
import { poaSubmissionSuccessfulPage } from "#src/controllers/poa/submissionSuccessfulController.js";
import { escapingFixedFee, submitEscapingFixedFee } from "#src/controllers/poa/escapingFixedFeeController.js";
import { profitCostBillLine, submitProfitCostBillLine } from "#src/controllers/poa/profitCostBillLineController.js";
import { checkYourDetailsPage, submitYourDetails } from "#src/controllers/poa/checkDetailsController.js";
import { disbursementDetails, submitDisbursementDetails } from "#src/controllers/poa/disbursementDetailsController.js";
import { poaEvidenceUploadPage, submitPoaEvidenceUpload } from "#src/controllers/poa/poaEvidenceUploadController.js";
import { deleteEvidenceFileFromClaim, uploadEvidenceFile } from "#src/controllers/claims/ajaxFileUploadController.js";
import { confirmRemoveExpertLineItem, submitRemoveExpertLineItem } from "#src/controllers/poa/removeDisbursementController.js";
import { addAnotherDisbursement, submitAddAnotherDisbursement } from "#src/controllers/poa/addAnotherDisbursementController.js";
import { multerErrorHandler, registerIf, ROUTES } from "./helper.js";

/**
 * Builds the POA router.
 *
 * @returns {Router} Configured POA router.
 */
export const buildPoaRouter = (): Router => {
  const router = express.Router();

  router.get(
    ROUTES.POA.EVIDENCE_UPLOAD,
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      await poaEvidenceUploadPage(req, res, next);
    },
  );

  router.post(ROUTES.POA.EVIDENCE_UPLOAD, submitPoaEvidenceUpload);

  router.post(
    ROUTES.POA.AJAX_UPLOAD_EVIDENCE,
    evidenceUpload.single("documents"),
    multerErrorHandler,
    uploadEvidenceFile,
  );

  router.post(
    ROUTES.POA.AJAX_DELETE_EVIDENCE,
    deleteEvidenceFileFromClaim,
  );

  router.get(
    ROUTES.POA.CLAIM_TYPE,
    async (req, res, next): Promise<void> => {
      await poaClaimTypePage(req, res, next);
    },
  );

  router.post(
    ROUTES.POA.CLAIM_TYPE,
    async (req, res, next): Promise<void> => {
      await submitPoaClaimType(req, res, next);
    },
  );

  registerIf(config.featureFlags.poaProfitCostEnabled, () => {
    router.get(
      ROUTES.POA.PROFIT_COST.HOW_MANY_CLIENTS_RETAINED,
      async (
        req: Request,
        res: Response,
        next: NextFunction,
      ): Promise<void> => {
        await howManyClientsRetained(req, res, next);
      },
    );

    router.post(
      ROUTES.POA.PROFIT_COST.HOW_MANY_CLIENTS_RETAINED,
      async (
        req: Request,
        res: Response,
        next: NextFunction,
      ): Promise<void> => {
        await submitHowManyClientsRetained(req, res, next);
      },
    );

    router.get(
      ROUTES.POA.PROFIT_COST.DETAILS,
      async (
        req: Request,
        res: Response,
        next: NextFunction,
      ): Promise<void> => {
        await profitCostDetails(req, res, next);
      },
    );

    router.post(
      ROUTES.POA.PROFIT_COST.DETAILS,
      async (
        req: Request,
        res: Response,
        next: NextFunction,
      ): Promise<void> => {
        await submitProfitCostDetails(req, res, next);
      },
    );

    router.get(
      ROUTES.POA.PROFIT_COST.MULTIPLE_CLIENT_HEARINGS,
      async (
        req: Request,
        res: Response,
        next: NextFunction,
      ): Promise<void> => {
        await multipleClientHearings(req, res, next);
      },
    );

    router.post(
      ROUTES.POA.PROFIT_COST.MULTIPLE_CLIENT_HEARINGS,
      async (
        req: Request,
        res: Response,
        next: NextFunction,
      ): Promise<void> => {
        await submitMultipleClientHearings(req, res, next);
      },
    );

    router.get(
      ROUTES.POA.PROFIT_COST.CPGFS_BILL_LINE,
      async (
        req: Request,
        res: Response,
        next: NextFunction,
      ): Promise<void> => {
        await profitCostBillLine(req, res, next);
      },
    );

    router.post(
      ROUTES.POA.PROFIT_COST.CPGFS_BILL_LINE,
      async (
        req: Request,
        res: Response,
        next: NextFunction,
      ): Promise<void> => {
        await submitProfitCostBillLine(req, res, next);
      },
    );

    router.get(
      ROUTES.POA.PROFIT_COST.NUMBER_OF_CLIENTS_START_OF_CASE,
      async (
        req: Request,
        res: Response,
        next: NextFunction,
      ): Promise<void> => {
        await numberOfClientsStartOfCase(req, res, next);
      },
    );

    router.post(
      ROUTES.POA.PROFIT_COST.NUMBER_OF_CLIENTS_START_OF_CASE,
      async (
        req: Request,
        res: Response,
        next: NextFunction,
      ): Promise<void> => {
        await submitNumberOfClientsStartOfCase(req, res, next);
      },
    );

    router.get(
      ROUTES.POA.PROFIT_COST.ESCAPING_FIXED_FEE,
      async (
        req: Request,
        res: Response,
        next: NextFunction,
      ): Promise<void> => {
        await escapingFixedFee(req, res, next);
      },
    );

    router.post(
      ROUTES.POA.PROFIT_COST.ESCAPING_FIXED_FEE,
      async (
        req: Request,
        res: Response,
        next: NextFunction,
      ): Promise<void> => {
        await submitEscapingFixedFee(req, res, next);
      },
    );
  });

  router.get(
    ROUTES.POA.DISBURSEMENTS.DETAILS,
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      await disbursementDetails(req, res, next);
    },
  );

  router.post(
    ROUTES.POA.DISBURSEMENTS.DETAILS,
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      await submitDisbursementDetails(req, res, next);
    },
  );

  router.get(
    ROUTES.POA.DISBURSEMENTS.ADD,
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      await addAnotherDisbursement(req, res, next);
    },
  );

  router.post(
    ROUTES.POA.DISBURSEMENTS.ADD,
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      await submitAddAnotherDisbursement(req, res, next);
    },
  );

  router.get(
    ROUTES.POA.DISBURSEMENTS.REMOVE,
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      await confirmRemoveExpertLineItem(req, res, next);
    },
  );

  router.post(
    ROUTES.POA.DISBURSEMENTS.REMOVE,
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      await submitRemoveExpertLineItem(req, res, next);
    },
  );

  router.get(
    ROUTES.POA.CHECK_DETAILS,
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      await checkYourDetailsPage(req, res, next);
    },
  );

  router.post(
    ROUTES.POA.CHECK_DETAILS,
    (req: Request, res: Response, next: NextFunction): void => {
      submitYourDetails(req, res, next);
    },
  );

  router.get(
    ROUTES.POA.SUBMISSION_SUCCESSFUL,
    (req: Request, res: Response, next: NextFunction): void => {
      poaSubmissionSuccessfulPage(req, res, next);
    },
  );

  return router;
};