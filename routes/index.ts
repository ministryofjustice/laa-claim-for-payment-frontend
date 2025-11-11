import { viewClaimsPage } from "#src/controllers/claims/viewClaimController.js";
import { handleYourClaimsPage } from "#src/controllers/claimServiceController.js";
import express from "express";
import type { Request, Response, NextFunction } from "express";

// Create a new router
const router = express.Router();

/* GET home page. */
router.get("/", async function (req: Request, res: Response, next: NextFunction): Promise<void> {
  await handleYourClaimsPage(req, res, next);
});

/* GET view claim page. */
router.get("/claims/:claimId", async function (req: Request, res: Response, next: NextFunction): Promise<void> {
  await viewClaimsPage(req, res, next);
});

// Make an API call with `Axios` and `middleware-axios`
// GET users from external API
router.get(
  "/users",
  async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Use the Axios instance attached to the request object
      const response = await req.axiosMiddleware.get("https://jsonplaceholder.typicode.com/users");
      res.json(response.data);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
