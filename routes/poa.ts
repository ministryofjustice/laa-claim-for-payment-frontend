import type { Router } from "express";
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
import {
  loadDraftClaim,
  requireDisbursementCostType,
} from "#middleware/loadDraftClaim.js";

/**
 * Builds the POA router.
 *
 * @returns {Router} Configured POA router.
 */
export const buildPoaRouter = (): Router => {
  const router = express.Router();

  router.get(ROUTES.POA.EVIDENCE_UPLOAD, loadDraftClaim, poaEvidenceUploadPage);

  router.post(ROUTES.POA.EVIDENCE_UPLOAD, loadDraftClaim, submitPoaEvidenceUpload);

  router.post(
    ROUTES.POA.AJAX_UPLOAD_EVIDENCE,
    evidenceUpload.single("documents"),
    multerErrorHandler,
    uploadEvidenceFile,
  );

  router.post(ROUTES.POA.AJAX_DELETE_EVIDENCE, deleteEvidenceFileFromClaim);

  router.get(ROUTES.POA.CLAIM_TYPE, loadDraftClaim, poaClaimTypePage);

  router.post(ROUTES.POA.CLAIM_TYPE, loadDraftClaim, submitPoaClaimType);

  registerIf(config.featureFlags.poaProfitCostEnabled, () => {
    router.get(
      ROUTES.POA.PROFIT_COST.HOW_MANY_CLIENTS_RETAINED,
      loadDraftClaim,
      howManyClientsRetained,
    );

    router.post(
      ROUTES.POA.PROFIT_COST.HOW_MANY_CLIENTS_RETAINED,
      loadDraftClaim,
      submitHowManyClientsRetained,
    );

    router.get(ROUTES.POA.PROFIT_COST.DETAILS, loadDraftClaim, profitCostDetails);

    router.post(ROUTES.POA.PROFIT_COST.DETAILS, loadDraftClaim, submitProfitCostDetails);

    router.get(
      ROUTES.POA.PROFIT_COST.MULTIPLE_CLIENT_HEARINGS,
      loadDraftClaim,
      multipleClientHearings,
    );

    router.post(
      ROUTES.POA.PROFIT_COST.MULTIPLE_CLIENT_HEARINGS,
      loadDraftClaim,
      submitMultipleClientHearings,
    );

    router.get(ROUTES.POA.PROFIT_COST.CPGFS_BILL_LINE, loadDraftClaim, profitCostBillLine);

    router.post(
      ROUTES.POA.PROFIT_COST.CPGFS_BILL_LINE,
      loadDraftClaim,
      submitProfitCostBillLine,
    );

    router.get(
      ROUTES.POA.PROFIT_COST.NUMBER_OF_CLIENTS_START_OF_CASE,
      loadDraftClaim,
      numberOfClientsStartOfCase,
    );

    router.post(
      ROUTES.POA.PROFIT_COST.NUMBER_OF_CLIENTS_START_OF_CASE,
      loadDraftClaim,
      submitNumberOfClientsStartOfCase,
    );

    router.get(ROUTES.POA.PROFIT_COST.ESCAPING_FIXED_FEE, loadDraftClaim, escapingFixedFee);

    router.post(
      ROUTES.POA.PROFIT_COST.ESCAPING_FIXED_FEE,
      loadDraftClaim,
      submitEscapingFixedFee,
    );
  });

  router.get(ROUTES.POA.DISBURSEMENTS.DETAILS, loadDraftClaim, requireDisbursementCostType, disbursementDetails);

  router.post(ROUTES.POA.DISBURSEMENTS.DETAILS, loadDraftClaim, requireDisbursementCostType, submitDisbursementDetails);

  router.get(ROUTES.POA.DISBURSEMENTS.ADD, loadDraftClaim, requireDisbursementCostType, addAnotherDisbursement);

  router.post(ROUTES.POA.DISBURSEMENTS.ADD, loadDraftClaim, requireDisbursementCostType, submitAddAnotherDisbursement);

  router.get(ROUTES.POA.DISBURSEMENTS.REMOVE, loadDraftClaim, requireDisbursementCostType, confirmRemoveExpertLineItem);

  router.post(ROUTES.POA.DISBURSEMENTS.REMOVE, loadDraftClaim, requireDisbursementCostType, submitRemoveExpertLineItem);

  router.get(ROUTES.POA.CHECK_DETAILS, loadDraftClaim, checkYourDetailsPage);

  router.post(ROUTES.POA.CHECK_DETAILS, loadDraftClaim, submitYourDetails);

  router.get(ROUTES.POA.SUBMISSION_SUCCESSFUL, poaSubmissionSuccessfulPage);

  return router;
};
