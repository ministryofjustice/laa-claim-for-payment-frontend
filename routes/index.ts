import { rateLimit } from "express-rate-limit";
import { viewClaimPage } from "#src/controllers/claims/viewClaimController.js";
import { handleYourClaimsPage } from "#src/controllers/viewClaimsController.js";
import type { NextFunction, Request, Response } from "express";
import express from "express";
import { viewUploadEvidenceIndividuallyPage } from "#src/controllers/claims/uploadEvidenceIndividuallyController.js";
import { chooseFileUpload, submitChooseFileUpload } from "#src/controllers/claims/chooseUploadController.js";
import { ROUTES, multerErrorHandler } from "./helper.js";
import { fileUploadForLineItemPage, uploadEvidenceFile, deleteEvidenceFile, uploadDir, continueFromFileUpload,
  linkEvidenceToLineItem
} from "#src/controllers/claims/fileUploadForLineItemController.js";
import multer from 'multer';

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per minute
});

const router = express.Router();

// TODO: move this logic somewhere in controller
//.     Replace all loca storage uploading to backend calls
const localUpload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (_req, file, callback) => {
      callback(null, file.originalname);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // limit max file size to 10MB... also not working
  },
  // TODO: Figure out where this goes
  fileFilter: (_req, file, callback) => {
    if (file.mimetype !== 'application/pdf') {
      callback(new Error('Only PDF files can be uploaded')); 
      return;
    }

    callback(null, true);
  },
});

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
  '/ajax-upload',
  localUpload.single('documents'),
  multerErrorHandler,
  uploadEvidenceFile,
);

router.post('/ajax-delete', deleteEvidenceFile);

router.post(
  '/claims/:claimId/upload-evidence-individually/:lineItemId/file-upload',
  continueFromFileUpload,
);

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
