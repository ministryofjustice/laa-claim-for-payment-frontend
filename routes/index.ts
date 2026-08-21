import { viewClaimPage } from "#src/controllers/claims/viewClaimController.js";
import { handleYourClaimsActionPage, handleYourClaimsPage } from "#src/controllers/viewClaimsController.js";
import type { NextFunction, Request, Response, Router } from "express";
import express from "express";
import { viewUploadEvidenceIndividuallyPage } from "#src/controllers/claims/uploadEvidenceIndividuallyController.js";
import { chooseFileUpload, submitChooseFileUpload } from "#src/controllers/claims/chooseUploadController.js";
import { multerErrorHandler, ROUTES } from "./helper.js";
import {
  fileUploadForLineItemPage,
  linkEvidenceToLineItem
} from "#src/controllers/claims/fileUploadForLineItemController.js";
import { evidenceUpload } from "#src/helpers/multerUpload.js";
import {
  howManyClientsRetained,
  submitHowManyClientsRetained
} from "#src/controllers/poa/howManyClientsRetainedController.js";
import { poaClaimTypePage, submitPoaClaimType } from "#src/controllers/poa/poaClaimTypeController.js";
import { profitCostDetails, submitProfitCostDetails } from "#src/controllers/poa/profitCostDetailsController.js";
import {
  multipleClientHearings,
  submitMultipleClientHearings
} from "#src/controllers/poa/multipleClientHearingsController.js";
import {
  numberOfClientsStartOfCase,
  submitNumberOfClientsStartOfCase
} from "#src/controllers/poa/numberOfClientsStartOfCaseController.js";
import { poaSubmissionSuccessfulPage } from "#src/controllers/poa/submissionSuccessfulController.js";
import { escapingFixedFee, submitEscapingFixedFee } from "#src/controllers/poa/escapingFixedFeeController.js";
import { profitCostBillLine, submitProfitCostBillLine } from "#src/controllers/poa/profitCostBillLineController.js";
import { checkYourDetailsPage, submitYourDetails } from "#src/controllers/poa/checkDetailsController.js";
import { disbursementDetails, submitDisbursementDetails } from "#src/controllers/poa/disbursementDetailsController.js";
import { poaEvidenceUploadPage, submitPoaEvidenceUpload } from "#src/controllers/poa/poaEvidenceUploadController.js";
import {
  deleteEvidenceFileFromClaim,
  getFileRow,
  unlinkEvidenceFileFromLineItem,
  uploadEvidenceFile,
  uploadEvidenceFileForLineItem,
} from "#src/controllers/claims/ajaxFileUploadController.js";
import type { ViewClaimsActionRequest } from "#src/types/requests.js";

import { confirmRemoveExpertLineItem, submitRemoveExpertLineItem } from "#src/controllers/poa/removeDisbursementController.js";
import {
  addAnotherDisbursement,
  submitAddAnotherDisbursement,
} from "#src/controllers/poa/addAnotherDisbursementController.js";

/**
 * Builds the main application router.
 *
 * @returns {Router} Configured Express router.
 */
export const buildRouter = (): Router => {
  const router = express.Router();

  /* GET home page. */
  router.get(
    ROUTES.CLAIMS,
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      await handleYourClaimsPage(req, res, next);
    },
  );

  router.post(
    ROUTES.CLAIMS,
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

  /* GET view upload evidence individually page.*/
  router.get(
    ROUTES.UPLOAD_EVIDENCE_INDIVIDUALLY, //TODO: Needs to be renamed to line items or something similar
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      await viewUploadEvidenceIndividuallyPage(req, res, next);
    },
  );

  /* GET choose how to upload file page. */
  router.get(
    ROUTES.CHOOSE_UPLOAD,
    (req: Request, res: Response, next: NextFunction): void => {
      chooseFileUpload(req, res, next);
    },
  );

  /* POST choose how to upload file page. */
  router.post(
    ROUTES.CHOOSE_UPLOAD,
    (req: Request, res: Response, next: NextFunction): void => {
      submitChooseFileUpload(req, res, next);
    },
  );

  router.post(
    ROUTES.AJAX_UPLOAD_FILE_FOR_LINE_ITEM,
    evidenceUpload.single("documents"),
    multerErrorHandler,
    uploadEvidenceFileForLineItem,
  );

  router.post(
    ROUTES.AJAX_DELETE_FILE_FOR_LINE_ITEM,
    unlinkEvidenceFileFromLineItem,
  );

  router.get(
    ROUTES.UPLOAD_FILE_FOR_LINE_ITEM,
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      await fileUploadForLineItemPage(req, res, next);
    },
  );

  /* POST linked evidence. */
  router.post(
    ROUTES.UPLOAD_FILE_FOR_LINE_ITEM,
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      await linkEvidenceToLineItem(req, res, next);
    },
  );

  router.get(
    ROUTES.POA_EVIDENCE_UPLOAD,
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      await poaEvidenceUploadPage(req, res, next);
    },
  );

  router.post(ROUTES.POA_EVIDENCE_UPLOAD, submitPoaEvidenceUpload);

  router.post(
    ROUTES.AJAX_UPLOAD_POA_EVIDENCE,
    evidenceUpload.single("documents"),
    multerErrorHandler,
    uploadEvidenceFile,
  );

  router.post(ROUTES.AJAX_DELETE_POA_EVIDENCE, deleteEvidenceFileFromClaim);

  router.get(
    ROUTES.HOW_MANY_CLIENTS_RETAINED,
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      await howManyClientsRetained(req, res, next);
    },
  );

  router.post(
    ROUTES.HOW_MANY_CLIENTS_RETAINED,
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      await submitHowManyClientsRetained(req, res, next);
    },
  );

  router.get(
    ROUTES.POA_CLAIM_TYPE,
    async (req, res, next): Promise<void> => {
      await poaClaimTypePage(req, res, next);
    },
  );

  router.post(
    ROUTES.POA_CLAIM_TYPE,
    async (req, res, next): Promise<void> => {
      await submitPoaClaimType(req, res, next);
    },
  );

  router.get(
    ROUTES.PROFIT_COST_DETAILS,
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      await profitCostDetails(req, res, next);
    },
  );

  router.post(
    ROUTES.PROFIT_COST_DETAILS,
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      await submitProfitCostDetails(req, res, next);
    },
  );

  router.get(
    ROUTES.DISBURSEMENT_DETAILS,
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      await disbursementDetails(req, res, next);
    },
  );

  router.post(
    ROUTES.DISBURSEMENT_DETAILS,
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      await submitDisbursementDetails(req, res, next);
    },
  );

  router.get(
    ROUTES.ADD_ANOTHER_DISBURSEMENT,
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      await addAnotherDisbursement(req, res, next);
    },
  );

  router.post(
    ROUTES.ADD_ANOTHER_DISBURSEMENT,
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      await submitAddAnotherDisbursement(req, res, next);
    },
  );

  router.get(
    ROUTES.REMOVE_DISBURSEMENT,
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      await confirmRemoveExpertLineItem(req, res, next);
    },
  );

  router.post(
    ROUTES.REMOVE_DISBURSEMENT,
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      await submitRemoveExpertLineItem(req, res, next);
    },
  );

  router.get(
    ROUTES.MULTIPLE_CLIENT_HEARINGS,
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      await multipleClientHearings(req, res, next);
    },
  );

  router.post(
    ROUTES.MULTIPLE_CLIENT_HEARINGS,
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      await submitMultipleClientHearings(req, res, next);
    },
  );

  router.get(
    ROUTES.CPGFS_PROFIT_COST_BILL_LINE,
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      await profitCostBillLine(req, res, next);
    },
  );

  router.post(
    ROUTES.CPGFS_PROFIT_COST_BILL_LINE,
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      await submitProfitCostBillLine(req, res, next);
    },
  );

  router.get(
    ROUTES.NUMBER_OF_CLIENTS_START_OF_CASE,
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      await numberOfClientsStartOfCase(req, res, next);
    },
  );

  router.post(
    ROUTES.NUMBER_OF_CLIENTS_START_OF_CASE,
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      await submitNumberOfClientsStartOfCase(req, res, next);
    },
  );

  router.get(
    ROUTES.ESCAPING_FIXED_FEE,
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      await escapingFixedFee(req, res, next);
    },
  );

  router.post(
    ROUTES.ESCAPING_FIXED_FEE,
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      await submitEscapingFixedFee(req, res, next);
    },
  );

  router.get(
    ROUTES.POA_CHECK_YOUR_DETAILS,
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      await checkYourDetailsPage(req, res, next);
    },
  );

  router.post(
    ROUTES.POA_CHECK_YOUR_DETAILS,
    (req: Request, res: Response, next: NextFunction): void => {
      submitYourDetails(req, res, next);
    },
  );

  router.get(
    ROUTES.POA_SUBMISSION_SUCCESSFUL,
    (req: Request, res: Response, next: NextFunction): void => {
      poaSubmissionSuccessfulPage(req, res, next);
    },
  );

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
