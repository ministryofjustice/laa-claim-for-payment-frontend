import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import * as sinon from "sinon";
import type { Request, Response } from "express";
import "#utils/axiosSetup.js";
import { claimService } from "#src/services/claimService.js";
import { viewClaimPage } from "#src/controllers/claims/viewClaimController.js";
import { getClaimSuccessResponseData } from "#tests/assets/getClaimsResponseData.js";
import { ApiResponse } from "#src/types/api-types.js";
import { Claim } from "#src/types/Claim.js";

describe("View Claim Controller", () => {
  let req: Partial<Request>;
  let res: any;
  let next: any;
  let renderStub: sinon.SinonStub;
  let statusStub: sinon.SinonStub;
  let claimServiceStub: sinon.SinonStub;

  beforeEach(() => {
    req = {
      axiosMiddleware: {} as any,
      path: "/claims/1",
      params: { claimId: "1" }
    };

    renderStub = sinon.stub();
    statusStub = sinon.stub().returns({ render: renderStub });

    res = {
      render: renderStub,
      status: statusStub,
      redirect: sinon.spy(),
    };

    next = sinon.stub();

    // Stub the API service
    claimServiceStub = sinon.stub(claimService, "getClaim");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("View Claim controller test", () => {
    it("should render the view claim page with data and correct template", async () => {
      // Arrange
      const mockApiResponse = getClaimSuccessResponseData;

      claimServiceStub.resolves(mockApiResponse);

      // Act
      await viewClaimPage(req as Request, res as Response, next);

      // Assert
      expect(claimServiceStub.calledOnce).to.be.true;
      expect(claimServiceStub.calledWith(req.axiosMiddleware)).to.be.true;
      expect(renderStub.calledWith("main/claims/view.njk")).to.be.true;
    });

    it("should redirect to appropriate page when invalid page in query param", async () => {
      const mockApiResponse: ApiResponse<Claim> = {
        status: "error",
        message: "not found"
      };

      claimServiceStub.resolves(mockApiResponse);

      // Act
      await viewClaimPage(req as Request, res as Response, next);

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
      await viewClaimPage(req as Request, res as Response, next);

      // Assert - the controller should call next with a processed error
      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.instanceOf(Error);
      expect(next.firstCall.args[0].message).to.include("An unexpected error occurred");
    });
  });
});
