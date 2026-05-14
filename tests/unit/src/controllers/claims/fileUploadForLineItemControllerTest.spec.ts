import { afterEach, beforeEach, describe, it } from "mocha";
import { expect } from "chai";
import * as sinon from "sinon";
import type { Request, Response } from "express";
import "#utils/axiosSetup.js";
import { claimService } from "#src/services/claimService.js";
import { getClaimSuccessResponseData } from "#tests/assets/getClaimsResponseData.js";
import { fileUploadForLineItemPage } from "#src/controllers/claims/fileUploadForLineItemController.js";
import { ApiResponse } from "#src/types/api-types.js";
import { Claim } from "#src/types/Claim.js";
import { viewClaimPage } from "#src/controllers/claims/viewClaimController.js";

describe("View File Upload For Line Item Controller", () => {
  let req: Partial<Request>;
  let res: any;
  let next: any;
  let renderStub: sinon.SinonStub;
  let statusStub: sinon.SinonStub;
  let claimServiceStub: sinon.SinonStub;

  beforeEach(() => {
    req = {
    axiosMiddleware: {} as any,
    path: "/claims/1/upload-evidence-individually/1/file-upload",
    params: { claimId: "1", lineItemId: "1" }
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

  describe("fileUploadForLineItemPage", () => {
    it("should render view of the file upload for line item page with data and correct template", async() => {

      const mockApiResponse = getClaimSuccessResponseData;

      claimServiceStub.resolves(mockApiResponse);

      await fileUploadForLineItemPage(req as Request, res as Response, next);

      expect(claimServiceStub.calledOnce).to.be.true;
      expect(claimServiceStub.calledWith(req.axiosMiddleware)).to.be.true;
      expect(renderStub.calledWith("main/claims/fileUploadForLineItemView.njk")).to.be.true;

    });

    it("should redirect to appropriate page when no claim is returned", async () => {
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

    it("should return NOT_FOUND status if no line item exists for the claim", async () => {
      req = {
        axiosMiddleware: {} as any,
        path: "/claims/1/upload-evidence-individually/3/file-upload",
        params: { claimId: "1", lineItemId: "3" }
      }

      const mockApiResponse = getClaimSuccessResponseData;

      claimServiceStub.resolves(mockApiResponse);

      await fileUploadForLineItemPage(req as Request, res as Response, next);

      expect(claimServiceStub.calledOnce).to.be.true;
      expect(claimServiceStub.calledWith(req.axiosMiddleware)).to.be.true;
      expect(renderStub.calledWith("main/error.njk")).to.be.true;
    })
  })
})