import { rateLimit } from "express-rate-limit";
import { viewClaimPage } from "#src/controllers/claims/viewClaimController.js";
import { handleYourClaimsPage } from "#src/controllers/viewClaimsController.js";
import type { NextFunction, Request, Response, Router } from "express";
import express from "express";
import { viewUploadEvidenceIndividuallyPage } from "#src/controllers/claims/uploadEvidenceIndividuallyController.js";
import { chooseFileUpload, submitChooseFileUpload } from "#src/controllers/claims/chooseUploadController.js";
import { ROUTES, multerErrorHandler } from "./helper.js";
import { fileUploadForLineItemPage, continueFromFileUpload } from "#src/controllers/claims/fileUploadForLineItemController.js";
import { evidenceUpload } from '#src/helpers/multerUpload.js';
import { howManyClientsRetained, submitHowManyClientsRetained } from "#src/controllers/poa/howManyClientsRetainedController.js";
import { poaClaimTypePage, submitPoaClaimType } from "#src/controllers/poa/poaClaimTypeController.js";
import { profitCostDetails, submitProfitCostDetails } from "#src/controllers/poa/profitCostDetailsController.js";
import { multipleClientHearings, submitMultipleClientHearings } from "#src/controllers/poa/multipleClientHearingsController.js";
import { numberOfClientsStartOfCase, submitNumberOfClientsStartOfCase } from "#src/controllers/poa/numberOfClientsStartOfCaseController.js";
import { poaSubmissionSuccessfulPage } from "#src/controllers/poa/submissionSuccessfulController.js";
import { escapingFixedFee, submitEscapingFixedFee } from "#src/controllers/poa/escapingFixedFeeController.js";
import { profitCostBillLine, submitProfitCostBillLine } from "#src/controllers/poa/profitCostBillLineController.js";
import { checkYourDetailsPage, submitYourDetails } from "#src/controllers/poa/checkDetailsController.js";
import { expertCostDetails, submitExpertCostDetails } from "#src/controllers/poa/expertCostDetailsController.js";
import { deleteEvidenceFile, uploadEvidenceFileForLineItem } from "#src/controllers/claims/ajaxFileUploadController.js";
import type { AnswersCache } from "#src/services/answersCache.js";

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per minute
});

interface RouterDependencies {
  answersCache: AnswersCache;
}

/**
 * Builds the main application router.
 *
 * @param {RouterDependencies} root0 Router dependencies.
 * @param {AnswersCache} root0.answersCache Cache used for storing journey answers.
 * @returns {Router} Configured Express router.
 */
export const buildRouter = ({ answersCache }: RouterDependencies): Router => {
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

  /* GET view upload evidence individually page.*/
  router.get(
    ROUTES.UPLOAD_EVIDENCE_INDIVIDUALLY,//TODO: Needs to be renamed to line items or something similar
    limiter,
    async function (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> {
      await viewUploadEvidenceIndividuallyPage(req, res, next);
    },
  );

  router.get(
    ROUTES.UPLOAD_FILE_FOR_LINE_ITEM,
    limiter,
    async function(
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> {
      await fileUploadForLineItemPage(req, res, next);
    }
  )
/* GET choose how to upload file page. */
router.get(ROUTES.CHOOSE_UPLOAD, limiter, function (req: Request, res: Response, next: NextFunction): void {
  chooseFileUpload(req, res, next);
});

/* POST choose how to upload file page. */
router.post(ROUTES.CHOOSE_UPLOAD, limiter, function (req: Request, res: Response, next: NextFunction): void {
  submitChooseFileUpload(req, res, next);
});

router.post(
  ROUTES.AJAX_UPLOAD_FILE_FOR_LINE_ITEM,
  evidenceUpload.single('documents'),
  multerErrorHandler,
  uploadEvidenceFileForLineItem
);

router.post(
  ROUTES.AJAX_DELETE_FILE_FOR_LINE_ITEM,
  deleteEvidenceFile,
)

router.get(
  ROUTES.UPLOAD_FILE_FOR_LINE_ITEM,
  limiter,
  async function(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    await fileUploadForLineItemPage(req, res, next);
  }
)


router.get(
  ROUTES.HOW_MANY_CLIENTS_RETAINED,
  limiter,
  function (req: Request, res: Response, next: NextFunction): void {
    howManyClientsRetained(req, res, next);
  },
);

router.post(
  ROUTES.HOW_MANY_CLIENTS_RETAINED,
  limiter,
  function (req: Request, res: Response, next: NextFunction): void {
    submitHowManyClientsRetained(req, res, next);
  },
);

router.get(
  ROUTES.POA_CLAIM_TYPE,
  limiter,
  function (req, res, next): void {
    poaClaimTypePage(req, res, next);
  },
);

router.post(
  ROUTES.POA_CLAIM_TYPE,
  limiter,
  function (req, res, next): void {
    submitPoaClaimType(req, res, next);
  },
);

router.get(ROUTES.PROFIT_COST_DETAILS,limiter, function(req: Request, res: Response, next: NextFunction,): void {
  profitCostDetails(req, res, next);
});

router.post(ROUTES.PROFIT_COST_DETAILS, limiter, function (req: Request, res: Response, next: NextFunction): void {
  submitProfitCostDetails(req, res, next);
});

router.get(
  ROUTES.EXPERT_COST_DETAILS,
  limiter,
  function (req: Request, res: Response, next: NextFunction): void {
    expertCostDetails(req, res, next);
  },
);

router.post(
  ROUTES.EXPERT_COST_DETAILS,
  limiter,
  function (req: Request, res: Response, next: NextFunction): void {
    submitExpertCostDetails(req, res, next);
  },
);

router.get(
  ROUTES.MULTIPLE_CLIENT_HEARINGS,
  limiter,
  function (req: Request, res: Response, next: NextFunction): void {
    multipleClientHearings(req, res, next);
  },
);

router.post(
  ROUTES.MULTIPLE_CLIENT_HEARINGS,
  limiter,
  function (req: Request, res: Response, next: NextFunction): void {
    submitMultipleClientHearings(req, res, next);
  },
);

router.get(
  ROUTES.CPGFS_PROFIT_COST_BILL_LINE,
  limiter,
  function (req: Request, res: Response, next: NextFunction): void {
    profitCostBillLine(req, res, next);
  },
);

router.post(
  ROUTES.CPGFS_PROFIT_COST_BILL_LINE,
  limiter,
  function (req: Request, res: Response, next: NextFunction): void {
    submitProfitCostBillLine(req, res, next);
  },
);

router.get(ROUTES.NUMBER_OF_CLIENTS_START_OF_CASE, limiter, function(req: Request, res: Response, next: NextFunction): void {
  numberOfClientsStartOfCase(req, res, next);
});

router.post(ROUTES.NUMBER_OF_CLIENTS_START_OF_CASE, limiter, function(req: Request, res: Response, next: NextFunction): void {
  submitNumberOfClientsStartOfCase(req, res, next);
});

router.get(
  ROUTES.ESCAPING_FIXED_FEE,
  limiter,
  function (req: Request, res: Response, next: NextFunction): void {
    escapingFixedFee(req, res, next);
  },
);

router.post(
  ROUTES.ESCAPING_FIXED_FEE,
  limiter,
  function (req: Request, res: Response, next: NextFunction): void {
    submitEscapingFixedFee(req, res, next);
  },
);

router.get(ROUTES.POA_CHECK_YOUR_DETAILS, limiter, async function(req: Request, res: Response, next: NextFunction): Promise<void> {
  await checkYourDetailsPage(req, res, next);
});

router.post(ROUTES.POA_CHECK_YOUR_DETAILS, limiter, function(req: Request, res: Response, next: NextFunction): void {
  submitYourDetails(req, res, next);
});

router.get(ROUTES.POA_SUBMISSION_SUCCESSFUL, limiter, function(req: Request, res: Response, next: NextFunction): void {
  poaSubmissionSuccessfulPage(req, res, next);
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
  )

  /* POST linked evidence. */
  router.post(ROUTES.UPLOAD_FILE_FOR_LINE_ITEM, limiter, async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    await linkEvidenceToLineItem(req, res, next);
  });

  /* GET choose how to upload file page. */
  router.get(ROUTES.CHOOSE_UPLOAD, limiter, function (req: Request, res: Response, next: NextFunction): void {
    chooseFileUpload(req, res, next);
  });

  /* POST choose how to upload file page. */
  router.post(ROUTES.CHOOSE_UPLOAD, limiter, function (req: Request, res: Response, next: NextFunction): void {
    submitChooseFileUpload(req, res, next);
  });

  router.post(
    '/claims/:claimId/upload-evidence-individually/:lineItemId/file-upload',
    continueFromFileUpload,
  );

  router.get(
    ROUTES.HOW_MANY_CLIENTS_RETAINED,
    limiter,
    function (req: Request, res: Response, next: NextFunction): void {
      howManyClientsRetained(req, res, next);
    },
  );

  router.post(
    ROUTES.HOW_MANY_CLIENTS_RETAINED,
    limiter,
    function (req: Request, res: Response, next: NextFunction): void {
      submitHowManyClientsRetained(req, res, next);
    },
  );

  router.get(
    ROUTES.POA_CLAIM_TYPE,
    limiter,
    async function (req, res, next): Promise<void> {
      await poaClaimTypePage(req, res, next, {answersCache});
    },
  );

  router.post(
    ROUTES.POA_CLAIM_TYPE,
    limiter,
    async function (req, res, next): Promise<void> {
      await submitPoaClaimType(req, res, next, {answersCache});
    },
  );

  router.get(ROUTES.PROFIT_COST_DETAILS,limiter, function(req: Request, res: Response, next: NextFunction,): void {
    profitCostDetails(req, res, next);
  });

  router.post(ROUTES.PROFIT_COST_DETAILS, limiter, function (req: Request, res: Response, next: NextFunction): void {
    submitProfitCostDetails(req, res, next);
  });

  router.get(
    ROUTES.EXPERT_COST_DETAILS,
    limiter,
    async function (req: Request, res: Response, next: NextFunction): Promise<void> {
      await expertCostDetails(req, res, next, {answersCache});
    },
  );

  router.post(
    ROUTES.EXPERT_COST_DETAILS,
    limiter,
    async function (req: Request, res: Response, next: NextFunction): Promise<void> {
      await submitExpertCostDetails(req, res, next, {answersCache});
    },
  );

  router.get(
    ROUTES.MULTIPLE_CLIENT_HEARINGS,
    limiter,
    function (req: Request, res: Response, next: NextFunction): void {
      multipleClientHearings(req, res, next);
    },
  );

  router.post(
    ROUTES.MULTIPLE_CLIENT_HEARINGS,
    limiter,
    function (req: Request, res: Response, next: NextFunction): void {
      submitMultipleClientHearings(req, res, next);
    },
  );

  router.get(
    ROUTES.CPGFS_PROFIT_COST_BILL_LINE,
    limiter,
    function (req: Request, res: Response, next: NextFunction): void {
      profitCostBillLine(req, res, next);
    },
  );

  router.post(
    ROUTES.CPGFS_PROFIT_COST_BILL_LINE,
    limiter,
    function (req: Request, res: Response, next: NextFunction): void {
      submitProfitCostBillLine(req, res, next);
    },
  );

  router.get(ROUTES.NUMBER_OF_CLIENTS_START_OF_CASE, limiter, function(req: Request, res: Response, next: NextFunction): void {
    numberOfClientsStartOfCase(req, res, next);
  });

  router.post(ROUTES.NUMBER_OF_CLIENTS_START_OF_CASE, limiter, function(req: Request, res: Response, next: NextFunction): void {
    submitNumberOfClientsStartOfCase(req, res, next);
  });

  router.get(
    ROUTES.ESCAPING_FIXED_FEE,
    limiter,
    function (req: Request, res: Response, next: NextFunction): void {
      escapingFixedFee(req, res, next);
    },
  );

  router.post(
    ROUTES.ESCAPING_FIXED_FEE,
    limiter,
    function (req: Request, res: Response, next: NextFunction): void {
      submitEscapingFixedFee(req, res, next);
    },
  );

  router.get(ROUTES.POA_CHECK_YOUR_DETAILS, limiter, async function(req: Request, res: Response, next: NextFunction): Promise<void> {
    await checkYourDetailsPage(req, res, next);
  });

  router.post(ROUTES.POA_CHECK_YOUR_DETAILS, limiter, function(req: Request, res: Response, next: NextFunction): void {
    submitYourDetails(req, res, next);
  });

  router.get(ROUTES.POA_SUBMISSION_SUCCESSFUL, limiter, function(req: Request, res: Response, next: NextFunction): void {
    poaSubmissionSuccessfulPage(req, res, next);
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
    res.render("main/user.njk");
  });

  return router;
}

