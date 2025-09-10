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
// Import to get global type declarations for axiosMiddleware
import "#utils/axiosSetup.js";
import { claimService } from "#src/services/claimService.js";
import { handleYourClaimsPage } from "#src/controllers/claimServiceController.js";
// Import mock claims response data for testing
import { getClaimsSuccessResponseData } from "#tests/assets/getClaimsResponseData.js";

describe("Claim Service Controller", () => {
  let req: Partial<Request>;
  let res: any;
  let next: any;
  let renderStub: sinon.SinonStub;
  let statusStub: sinon.SinonStub;
  let claimServiceStub: sinon.SinonStub;

  beforeEach(() => {
    req = {
      axiosMiddleware: {} as any,
      query: {
        page: "1",
      },
    };

    renderStub = sinon.stub();
    statusStub = sinon.stub().returns({ render: renderStub });

    res = {
      render: renderStub,
      status: statusStub,
    };

    next = sinon.stub();

    // Stub the API service
    claimServiceStub = sinon.stub(claimService, "getClaims");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("Claims controller test", () => {
    it("should render home your claim page with data and correct template", async () => {
      // Arrange
      const mockApiResponse = getClaimsSuccessResponseData;

      claimServiceStub.resolves(mockApiResponse);

      // Act
      await handleYourClaimsPage(req as Request, res as Response, next);

      // Assert
      expect(claimServiceStub.calledOnce).to.be.true;
      expect(claimServiceStub.calledWith(req.axiosMiddleware)).to.be.true;
      expect(renderStub.calledWith("main/index.njk")).to.be.true;
    });

    it("should render the error page with when 404 status", async () => {
      const mockApiResponse = {
        status: "404",
      };
      claimServiceStub.resolves(mockApiResponse);

      await handleYourClaimsPage(req as Request, res as Response, next);

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
      await handleYourClaimsPage(req as Request, res as Response, next);

      // Assert - the controller should call next with a processed error
      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.instanceOf(Error);
      expect(next.firstCall.args[0].message).to.include("An unexpected error occurred");
    });
  });
});
