import { viewClaimPage } from "#src/controllers/claims/viewClaimController.js";
import { handleYourClaimsActionPage, handleYourClaimsPage } from "#src/controllers/viewClaimsController.js";
import type { NextFunction, Request, Response, Router } from "express";
import express from "express";
import { viewUploadEvidenceIndividuallyPage } from "#src/controllers/claims/uploadEvidenceIndividuallyController.js";
import { chooseFileUpload, submitChooseFileUpload } from "#src/controllers/claims/chooseUploadController.js";
import { multerErrorHandler, registerIf, ROUTES } from "./helper.js";
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
import { expertCostDetails, submitExpertCostDetails } from "#src/controllers/poa/expertCostDetailsController.js";
import { poaEvidenceUploadPage, submitPoaEvidenceUpload } from "#src/controllers/poa/poaEvidenceUploadController.js";
import {
  deleteEvidenceFileFromClaim,
  getFileRow,
  unlinkEvidenceFileFromLineItem,
  uploadEvidenceFile,
  uploadEvidenceFileForLineItem,
} from "#src/controllers/claims/ajaxFileUploadController.js";
import type { ViewClaimsActionRequest } from "#src/types/requests.js";

import { confirmRemoveExpertLineItem, submitRemoveExpertLineItem } from "#src/controllers/poa/removeExpertLineItemController.js";
import {
  addAnotherExpertCost,
  submitAddAnotherExpertCost,
} from "#src/controllers/poa/addAnotherExpertCostController.js";
import config from "#config.js";

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
    async function (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> {
      await handleYourClaimsPage(req, res, next);
    },
  );

  router.post(
    ROUTES.CLAIMS,
    async function (
      req: Request<unknown, unknown, ViewClaimsActionRequest>,
      res: Response,
      next: NextFunction,
    ): Promise<void> {
      await handleYourClaimsActionPage(req, res, next);
    },
  );

  /* GET view claim page. */
  router.get(
    ROUTES.VIEW_CLAIM,
    async function (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> {
      await viewClaimPage(req, res, next);
    },
  );

  /* GET view upload evidence individually page.*/
  registerIf(config.featureFlags.lineItemUploadEnabled, () =>
    router.get(
      ROUTES.UPLOAD_EVIDENCE_INDIVIDUALLY, //TODO: Needs to be renamed to line items or something similar
      async function (
        req: Request,
        res: Response,
        next: NextFunction,
      ): Promise<void> {
        await viewUploadEvidenceIndividuallyPage(req, res, next);
      },
    )
  );

  /* GET choose how to upload file page. */
  registerIf(config.featureFlags.lineItemUploadEnabled, () =>
    router.get(
      ROUTES.CHOOSE_UPLOAD,
      function (req: Request, res: Response, next: NextFunction): void {
        chooseFileUpload(req, res, next);
      },
    )
  );

  /* POST choose how to upload file page. */
  registerIf(config.featureFlags.lineItemUploadEnabled, () =>
    router.post(
      ROUTES.CHOOSE_UPLOAD,
      function (req: Request, res: Response, next: NextFunction): void {
        submitChooseFileUpload(req, res, next);
      },
    )
  );

  registerIf(config.featureFlags.lineItemUploadEnabled, () =>
    router.post(
      ROUTES.AJAX_UPLOAD_FILE_FOR_LINE_ITEM,
      evidenceUpload.single("documents"),
      multerErrorHandler,
      uploadEvidenceFileForLineItem,
    )
  );

  registerIf(config.featureFlags.lineItemUploadEnabled, () =>
    router.post(
      ROUTES.AJAX_DELETE_FILE_FOR_LINE_ITEM,
      unlinkEvidenceFileFromLineItem,
    )
  );

  registerIf(config.featureFlags.lineItemUploadEnabled, () =>
    router.get(
      ROUTES.UPLOAD_FILE_FOR_LINE_ITEM,
      async function (
        req: Request,
        res: Response,
        next: NextFunction,
      ): Promise<void> {
        await fileUploadForLineItemPage(req, res, next);
      },
    )
  );

  /* POST linked evidence. */
  registerIf(config.featureFlags.lineItemUploadEnabled, () =>
    router.post(
      ROUTES.UPLOAD_FILE_FOR_LINE_ITEM,
      async function (
        req: Request,
        res: Response,
        next: NextFunction,
      ): Promise<void> {
        await linkEvidenceToLineItem(req, res, next);
      },
    )
  );

  router.get(
    ROUTES.POA_EVIDENCE_UPLOAD,
    async function (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> {
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

  registerIf(config.featureFlags.poaProfitCostEnabled, () =>
    router.get(
      ROUTES.HOW_MANY_CLIENTS_RETAINED,
      async function (
        req: Request,
        res: Response,
        next: NextFunction,
      ): Promise<void> {
        await howManyClientsRetained(req, res, next);
      },
    )
  );

  registerIf(config.featureFlags.poaProfitCostEnabled, () =>
    router.post(
      ROUTES.HOW_MANY_CLIENTS_RETAINED,
      async function (
        req: Request,
        res: Response,
        next: NextFunction,
      ): Promise<void> {
        await submitHowManyClientsRetained(req, res, next);
      },
    )
  );

  router.get(
    ROUTES.POA_CLAIM_TYPE,
    async function (req, res, next): Promise<void> {
      await poaClaimTypePage(req, res, next);
    },
  );

  router.post(
    ROUTES.POA_CLAIM_TYPE,
    async function (req, res, next): Promise<void> {
      await submitPoaClaimType(req, res, next);
    },
  );

  registerIf(config.featureFlags.poaProfitCostEnabled, () =>
    router.get(
      ROUTES.PROFIT_COST_DETAILS,
      async function (
        req: Request,
        res: Response,
        next: NextFunction,
      ): Promise<void> {
        await profitCostDetails(req, res, next);
      },
    )
  );

  registerIf(config.featureFlags.poaProfitCostEnabled, () =>
    router.post(
      ROUTES.PROFIT_COST_DETAILS,
      async function (
        req: Request,
        res: Response,
        next: NextFunction,
      ): Promise<void> {
        await submitProfitCostDetails(req, res, next);
      },
    )
  );

  router.get(
    ROUTES.EXPERT_COST_DETAILS,
    async function (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> {
      await expertCostDetails(req, res, next);
    },
  );

  router.post(
    ROUTES.EXPERT_COST_DETAILS,
    async function (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> {
      await submitExpertCostDetails(req, res, next);
    },
  );

  router.get(
    ROUTES.ADD_ANOTHER_EXPERT_COST_DETAILS,
    async function (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> {
      await addAnotherExpertCost(req, res, next);
    },
  );

  router.post(
    ROUTES.ADD_ANOTHER_EXPERT_COST_DETAILS,
    async function (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> {
      await submitAddAnotherExpertCost(req, res, next);
    },
  );

  router.get(
    ROUTES.REMOVE_EXPERT_COST_DETAILS,
    async function (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> {
      await confirmRemoveExpertLineItem(req, res, next);
    },
  );

  router.post(
    ROUTES.REMOVE_EXPERT_COST_DETAILS,
    async function (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> {
      await submitRemoveExpertLineItem(req, res, next);
    },
  );

  registerIf(config.featureFlags.poaProfitCostEnabled, () =>
    router.get(
      ROUTES.MULTIPLE_CLIENT_HEARINGS,
      async function (
        req: Request,
        res: Response,
        next: NextFunction,
      ): Promise<void> {
        await multipleClientHearings(req, res, next);
      },
    )
  );

  registerIf(config.featureFlags.poaProfitCostEnabled, () =>
    router.post(
      ROUTES.MULTIPLE_CLIENT_HEARINGS,
      async function (
        req: Request,
        res: Response,
        next: NextFunction,
      ): Promise<void> {
        await submitMultipleClientHearings(req, res, next);
      },
    )
  );

  registerIf(config.featureFlags.poaProfitCostEnabled, () =>
    router.get(
      ROUTES.CPGFS_PROFIT_COST_BILL_LINE,
      async function (
        req: Request,
        res: Response,
        next: NextFunction,
      ): Promise<void> {
        await profitCostBillLine(req, res, next);
      },
    )
  );

  registerIf(config.featureFlags.poaProfitCostEnabled, () =>
    router.post(
      ROUTES.CPGFS_PROFIT_COST_BILL_LINE,
      async function (
        req: Request,
        res: Response,
        next: NextFunction,
      ): Promise<void> {
        await submitProfitCostBillLine(req, res, next);
      },
    )
  );

  registerIf(config.featureFlags.poaProfitCostEnabled, () =>
    router.get(
      ROUTES.NUMBER_OF_CLIENTS_START_OF_CASE,
      async function (
        req: Request,
        res: Response,
        next: NextFunction,
      ): Promise<void> {
        await numberOfClientsStartOfCase(req, res, next);
      },
    )
  );

  registerIf(config.featureFlags.poaProfitCostEnabled, () =>
    router.post(
      ROUTES.NUMBER_OF_CLIENTS_START_OF_CASE,
      async function (
        req: Request,
        res: Response,
        next: NextFunction,
      ): Promise<void> {
        await submitNumberOfClientsStartOfCase(req, res, next);
      },
    )
  );

  registerIf(config.featureFlags.poaProfitCostEnabled, () =>
    router.get(
      ROUTES.ESCAPING_FIXED_FEE,
      async function (
        req: Request,
        res: Response,
        next: NextFunction,
      ): Promise<void> {
        await escapingFixedFee(req, res, next);
      },
    )
  );

  registerIf(config.featureFlags.poaProfitCostEnabled, () =>
    router.post(
      ROUTES.ESCAPING_FIXED_FEE,
      async function (
        req: Request,
        res: Response,
        next: NextFunction,
      ): Promise<void> {
        await submitEscapingFixedFee(req, res, next);
      },
    )
  );

  router.get(
    ROUTES.POA_CHECK_YOUR_DETAILS,
    async function (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> {
      await checkYourDetailsPage(req, res, next);
    },
  );

  router.post(
    ROUTES.POA_CHECK_YOUR_DETAILS,
    function (req: Request, res: Response, next: NextFunction): void {
      submitYourDetails(req, res, next);
    },
  );

  router.get(
    ROUTES.POA_SUBMISSION_SUCCESSFUL,
    function (req: Request, res: Response, next: NextFunction): void {
      poaSubmissionSuccessfulPage(req, res, next);
    },
  );

  router.get(
    ROUTES.AJAX_GET_FILE_ROW,
    function (req: Request, res: Response, next: NextFunction): void {
      getFileRow(req, res, next);
    },
  );

  // Make an API call with `Axios` and `middleware-axios`
  // GET users from external API
  router.get(
    "/users",
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
    res.render("main/user.njk");
  });

  return router;
};

