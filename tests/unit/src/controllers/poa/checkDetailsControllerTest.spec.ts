import { afterEach, beforeEach, describe, it } from "mocha";
import { expect } from "chai";
import * as sinon from "sinon";
import type { Request, Response } from "express";
import "#utils/axiosSetup.js";
import { claimService } from "#src/services/claimService.js";
import { getClaimSuccessResponseData } from "#tests/assets/getClaimsResponseData.js";
import { ApiResponse } from "#src/types/api-types.js";
import { Claim } from "#src/types/Claim.js";
import { HttpError } from "http-errors";
import {
  checkYourDetailsPage,
  submitYourDetails,
} from "#src/controllers/poa/checkDetailsController.js";
import { ROUTES } from "#routes/helper.js";

describe("Check Details Controller", () => {
  let req: Partial<Request>;
  let res: any;
  let next: any;
  let renderStub: sinon.SinonStub;
  let statusStub: sinon.SinonStub;
  let claimServiceStub: sinon.SinonStub;

  beforeEach(() => {
    req = {
      axiosMiddleware: {} as any,
      path: "/claims/1/poa-check-details",
      params: { claimId: "1" },
    };

    renderStub = sinon.stub();
    statusStub = sinon.stub().returns({ render: renderStub });

    res = {
      render: renderStub,
      status: statusStub,
      redirect: sinon.spy(),
    };

    next = sinon.stub();

    claimServiceStub = sinon.stub(claimService, "getClaim");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("Check Details controller test", () => {
    it("should render the page with data and correct template", async () => {
      const mockApiResponse = getClaimSuccessResponseData;

      claimServiceStub.resolves(mockApiResponse);

      await checkYourDetailsPage(req as Request, res as Response, next);

      expect(claimServiceStub.calledOnce).to.be.true;
      expect(claimServiceStub.calledWith(req.axiosMiddleware)).to.be.true;
      expect(renderStub.calledWith("main/poa/checkDetailsView.njk")).to.be.true;
    });

    it("should redirect to appropriate page when no claim is returned", async () => {
      const mockApiResponse: ApiResponse<Claim> = {
        status: "error",
        statusCode: 500,
        message: "not found",
      };

      claimServiceStub.resolves(mockApiResponse);

      await checkYourDetailsPage(req as Request, res as Response, next);

      expect(claimServiceStub.calledOnce).to.be.true;
      expect(claimServiceStub.calledWith(req.axiosMiddleware)).to.be.true;
      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.instanceOf(HttpError);
      expect(next.firstCall.args[0].message).to.include("not found");
    });

    it("should delegate API errors to Express error handling middleware with user-friendly message", async () => {
      const error = new Error("API Error");
      claimServiceStub.rejects(error);

      await checkYourDetailsPage(req as Request, res as Response, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.instanceOf(Error);
      expect(next.firstCall.args[0].message).to.include("API Error");
    });

    it("should redirect to success page with claimId", () => {
      submitYourDetails(req as Request, res as Response, next);

      const expectedRoute = ROUTES.POA_SUBMISSION_SUCCESSFUL.replace(
        ":claimId",
        "1",
      );

      expect(res.redirect.calledOnce).to.be.true;
      expect(res.redirect.calledWith(expectedRoute)).to.be.true;
      expect(next.notCalled).to.be.true;
    });
  });
});
