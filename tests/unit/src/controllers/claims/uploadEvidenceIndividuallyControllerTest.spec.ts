import { afterEach, beforeEach, describe, it } from "mocha";
import { expect } from "chai";
import * as sinon from "sinon";
import type { Request, Response } from "express";
import { claimService } from "#src/services/claimService.js";
import "#utils/axiosSetup.js";
import { viewUploadEvidenceIndividuallyPage } from "#src/controllers/claims/uploadEvidenceIndividuallyController.js";
import { getClaimSuccessResponseData } from "#tests/assets/getClaimsResponseData.js";
import { ApiResponse } from "#src/types/api-types.js";
import { Claim } from "#src/types/Claim.js";

describe("Upload Evidence Individually controller test", () => {
  let req: Partial<Request>;
  let res: any;
  let next: any;
  let renderStub: sinon.SinonStub;
  let statusStub: sinon.SinonStub;
  let claimServiceStub: sinon.SinonStub;
  

  beforeEach(() => {
    req = {
      axiosMiddleware: {} as any,
      path: "/claims/1/upload-evidence-individually",
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

  describe("viewUploadEvidenceIndividuallyPage", () => {
    it("should render the view with data and correct template", async () => {
      const mockApiResponse = getClaimSuccessResponseData;
      
      claimServiceStub.resolves(mockApiResponse);

      await viewUploadEvidenceIndividuallyPage(
        req as Request,
        res as Response,
        next,
      );

      expect(
        renderStub.calledWith("main/claims/uploadEvidenceIndividually.njk"),
      ).to.be.true;
    });

    it("should redirect to appropriate page when no claim is returned", async () => {
      const mockApiResponse: ApiResponse<Claim> = {
        status: "error",
        message: "not found"
      };

      claimServiceStub.resolves(mockApiResponse);

      // Act
      await viewUploadEvidenceIndividuallyPage(req as Request, res as Response, next);

      // Assert
      expect(claimServiceStub.calledOnce).to.be.true;
      expect(claimServiceStub.calledWith(req.axiosMiddleware)).to.be.true;
      expect(renderStub.calledWith("main/error.njk")).to.be.true;
    });

    it("should delegate API errors to Express error handling middleware with user-friendly message", async () => {
      // Arrange
      const error = new Error("API Error");
      claimServiceStub.rejects(error);

      // Act
      await viewUploadEvidenceIndividuallyPage(req as Request, res as Response, next);

      // Assert - the controller should call next with a processed error
      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.instanceOf(Error);
      expect(next.firstCall.args[0].message).to.include("An unexpected error occurred");
    });
  });
});
