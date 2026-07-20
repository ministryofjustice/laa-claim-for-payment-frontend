/**
 * Case Details Controller Tests
 *
 * Tests the Express.js controller for individual case detail viewing functionality.
 * Covers case detail page routing and data presentation including:
 * - Tab-based navigation handling (details, evidence, proceedings)
 * - API integration for case-specific data retrieval
 * - Error handling and user feedback
 * - Template rendering with case context
 *
 * Testing Level: Unit (Controller Layer)
 * Component: Express.js Case Detail Controllers
 * Dependencies: apiService, case detail templates
 */

import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import * as sinon from "sinon";
import type { Request, Response, NextFunction } from "express";
import { claimService } from "#src/services/claimService.js";
import {
  handleYourClaimsActionPage,
  handleYourClaimsPage,
} from "#src/controllers/viewClaimsController.js";
// Import mock claims response data for testing
import {
  getClaimsSuccessResponseData,
  linkLineItemToEvidenceResponseData,
} from "#tests/assets/getClaimsResponseData.js";
import { ApiResponse, Paginated } from "#src/types/api-types.js";
import { Claim } from "#src/types/Claim.js";
import { HttpError } from "http-errors";
import { UUID } from "uuidv7";

describe("view Claims Controller", () => {
  let req: Partial<Request>;
  let res: any;
  let next: any;
  let renderStub: sinon.SinonStub;
  let statusStub: sinon.SinonStub;
  let getClaimsStub: sinon.SinonStub;
  let createClaimStub: sinon.SinonStub;

  beforeEach(() => {
    req = {
      axiosMiddleware: {} as any,
      query: {
        page: "1",
      },
      path: "/",
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
    getClaimsStub = sinon.stub(claimService, "getClaims");
    createClaimStub = sinon.stub(claimService, "createClaim");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("view Claims controller", () => {
    it("should render home your claim page with data and correct template", async () => {
      // Arrange
      const mockApiResponse = getClaimsSuccessResponseData;

      getClaimsStub.resolves(mockApiResponse);

      // Act
      await handleYourClaimsPage(req as Request, res as Response, next);

      // Assert
      expect(getClaimsStub.calledOnce).to.be.true;
      expect(getClaimsStub.calledWith(req.axiosMiddleware)).to.be.true;
      expect(renderStub.calledWith("main/index.njk")).to.be.true;
    });

    it("should redirect to appropriate page when invalid page in query param", async () => {
      // Arrange
      const invalidPage = 5;

      req.query!.page = invalidPage.toString();

      const mockApiResponse: ApiResponse<Paginated<Claim>> = {
        body:{
          data: getClaimsSuccessResponseData.body?.data!,
          meta: {
            total: 11,
            page: invalidPage,
            limit: 20,
          },
        },
        status: "success",
      };

      getClaimsStub.resolves(mockApiResponse);

      // Act
      await handleYourClaimsPage(req as Request, res as Response, next);

      // Assert
      expect(res.redirect.calledWith("/?page=1")).to.be.true;
    });

    it("should render the error page with when 404 status", async () => {
      const mockApiResponse = {
        status: "error",
        statusCode: 404,
        message: "not found"
      };
      getClaimsStub.resolves(mockApiResponse);

      await handleYourClaimsPage(req as Request, res as Response, next);

      // Assert
      expect(getClaimsStub.calledOnce).to.be.true;
      expect(getClaimsStub.calledWith(req.axiosMiddleware)).to.be.true;
      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.instanceOf(HttpError);
      expect(next.firstCall.args[0].message).to.include("not found");
    });

    it("should delegate API errors to Express error handling middleware with user-friendly message", async () => {
      // Arrange
      const error = new Error("API Error");
      getClaimsStub.rejects(error);

      // Act
      await handleYourClaimsPage(req as Request, res as Response, next);

      // Assert - the controller should call next with a processed error
      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.instanceOf(Error);
      expect(next.firstCall.args[0].message).to.include("API Error");
    });

    it("should redirect to non-existent page when 'Import claim' button clicked", async () => {
      req.body = {
        action: "import",
      };

      await handleYourClaimsActionPage(req as Request, res as Response, next);

      expect(renderStub.called).to.be.false;
      expect(res.redirect.calledWith("/import")).to.be.true;
    });

    it("should redirect to 'How do you want to upload your evidence?' when 'Create a new claim' button clicked", async () => {
      req.body = {
        action: "create",
      };

      await handleYourClaimsActionPage(req as Request, res as Response, next);

      expect(renderStub.called).to.be.false;
      expect(res.redirect.calledWith("/claims/019f5c43-d9f0-732e-88b2-1ca29c6c41de/choose-upload")).to.be.true;
    });

    it("should redirect to 'What type of POA are you claiming?' when 'Payment on account' button clicked", async () => {
      req.body = {
        action: "poa",
      };

      const mockApiResponse = {
        status: "success",
        body: UUID.parse("019f7f1a-0bd5-74c4-87b9-2bb69c0f0cd1")
      };

      createClaimStub.resolves(mockApiResponse);

      await handleYourClaimsActionPage(req as Request, res as Response, next);

      expect(renderStub.called).to.be.false;
      expect(res.redirect.calledWith("/claims/019f7f1a-0bd5-74c4-87b9-2bb69c0f0cd1/poa/claim-type")).to.be.true;
    });
  });
});
