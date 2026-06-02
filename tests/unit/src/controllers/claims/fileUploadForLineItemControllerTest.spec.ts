import { afterEach, beforeEach, describe, it } from "mocha";
import { expect } from "chai";
import * as sinon from "sinon";
import type { NextFunction, Request, Response } from "express";
import "#utils/axiosSetup.js";
import { claimService } from "#src/services/claimService.js";
import {
  getClaimSuccessResponseData,
  linkLineItemToEvidenceResponseData,
} from "#tests/assets/getClaimsResponseData.js";
import {
  deleteEvidenceFile,
  fileUploadForLineItemPage,
  linkEvidenceToLineItem,
  uploadDir,
  uploadEvidenceFile,
} from "#src/controllers/claims/fileUploadForLineItemController.js";
import { ApiResponse, UploadResponse } from "#src/types/api-types.js";
import { Claim } from "#src/types/Claim.js";
import { viewClaimPage } from "#src/controllers/claims/viewClaimController.js";
import fs from "node:fs";
import path from "node:path";
import { HttpError } from "http-errors";

describe("View File Upload For Line Item Controller", () => {
  let req: Partial<Request>;
  let res: any;
  let next: any;
  let renderStub: sinon.SinonStub;
  let statusStub: sinon.SinonStub;
  let getClaimStub: sinon.SinonStub;
  let linkEvidenceStub: sinon.SinonStub;
  let uploadLineItemEvidenceStub: sinon.SinonStub;

  beforeEach(() => {
    req = {
      axiosMiddleware: {} as any,
      path: "/claims/1/upload-evidence-individually/1/file-upload",
      params: { claimId: "1", lineItemId: "1" },
    };

    renderStub = sinon.stub();
    statusStub = sinon.stub().returns({ render: renderStub });

    res = {
      render: renderStub,
      status: statusStub,
      redirect: sinon.spy(),
      locals: {
        csrfToken: "test-csrf-token",
      },
    };

    next = sinon.stub();

    getClaimStub = sinon.stub(claimService, "getClaim");
    linkEvidenceStub = sinon.stub(claimService, "linkEvidenceToLineItem");
    uploadLineItemEvidenceStub = sinon.stub(
      claimService,
      "uploadLineItemEvidence",
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("fileUploadForLineItemPage", () => {
    it("should render view of the file upload for line item page with data and correct template", async () => {
      const mockApiResponse = getClaimSuccessResponseData;

      getClaimStub.resolves(mockApiResponse);

      await fileUploadForLineItemPage(req as Request, res as Response, next);

      expect(getClaimStub.calledOnce).to.be.true;
      expect(getClaimStub.calledWith(req.axiosMiddleware)).to.be.true;
      expect(renderStub.calledOnce).to.be.true;
      expect(renderStub.firstCall.args[0]).to.equal(
        "main/claims/fileUploadForLineItemView.njk",
      );
      expect(renderStub.firstCall.args[1]).to.have.property("vm");
    });

    it("should redirect to appropriate page when no claim is returned", async () => {
      const mockApiResponse: ApiResponse<Claim> = {
        status: "error",
        statusCode: 404,
        message: "not found",
      };

      getClaimStub.resolves(mockApiResponse);

      // Act
      await viewClaimPage(req as Request, res as Response, next);

      // Assert
      expect(getClaimStub.calledOnce).to.be.true;
      expect(getClaimStub.calledWith(req.axiosMiddleware)).to.be.true;
      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.instanceOf(HttpError);
      expect(next.firstCall.args[0].message).to.include("not found");
    });

    it("should delegate API errors to Express error handling middleware with user-friendly message", async () => {
      // Arrange
      const error = new Error("API Error");
      getClaimStub.rejects(error);

      // Act
      await viewClaimPage(req as Request, res as Response, next);

      // Assert - the controller should call next with a processed error
      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.instanceOf(Error);
      expect(next.firstCall.args[0].message).to.include("API Error");
    });

    it("should return NOT_FOUND status if no line item exists for the claim", async () => {
      req = {
        axiosMiddleware: {} as any,
        path: "/claims/1/upload-evidence-individually/3/file-upload",
        params: { claimId: "1", lineItemId: "3" },
      };

      const mockApiResponse = getClaimSuccessResponseData;

      getClaimStub.resolves(mockApiResponse);

      await fileUploadForLineItemPage(req as Request, res as Response, next);

      expect(getClaimStub.calledOnce).to.be.true;
      expect(getClaimStub.calledWith(req.axiosMiddleware)).to.be.true;
      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.instanceOf(HttpError);
      expect(next.firstCall.args[0].message).to.include(
        "Line item 3 not found",
      );
    });

    it("returns 400 when no file is uploaded", async () => {
      const req = {} as Request;
      const status = sinon.stub().returnsThis();
      const json = sinon.stub();

      const res = {
        status,
        json,
      } as unknown as Response;

      const next = sinon.stub();

      await uploadEvidenceFile(req, res, next as unknown as NextFunction);

      expect(status.calledWith(400)).to.equal(true);
      expect(
        json.calledWith({
          error: { message: "No file uploaded" },
        }),
      ).to.equal(true);
      expect(next.called).to.equal(false);
    });
  });

  describe("uploadEvidenceFile", () => {
    it("returns uploaded file details when a file is uploaded", async () => {
      const mockApiResponse: ApiResponse<UploadResponse> = {
        status: "success",
        body: {
          success: {
            messageText: "evidence.pdf uploaded",
            messageHtml: "<span>Uploaded</span>",
          },
          file: {
            filename: "evidence.pdf",
            originalname: "evidence.pdf",
          },
        },
      };

      uploadLineItemEvidenceStub.resolves(mockApiResponse);

      const req = {
        params: {
          claimId: "1",
          lineItemId: "2",
        },
        axiosMiddleware: {} as any,
        file: {
          filename: "abc123",
          originalname: "evidence.pdf",
          size: 12345,
          mimetype: "application/pdf",
          buffer: Buffer.from("fake pdf content"),
        },
      } as unknown as Request;

      const status = sinon.stub().returnsThis();
      const json = sinon.stub();

      const res = {
        status,
        json,
      } as unknown as Response;

      const next = sinon.stub();

      await uploadEvidenceFile(req, res, next as unknown as NextFunction);

      expect(uploadLineItemEvidenceStub.calledOnce).to.equal(true);

      expect(json.calledOnce).to.equal(true);

      const responseBody = json.firstCall.args[0];

      expect(responseBody).to.deep.equal(mockApiResponse);

      expect(status.called).to.equal(false);
      expect(next.called).to.equal(false);
    });
  });

  describe("deleteEvidenceFile", () => {
    it("deletes an uploaded file", async () => {
      const existsSync = sinon.stub(fs, "existsSync").returns(true);
      const unlinkSync = sinon.stub(fs, "unlinkSync");

      const req = {
        body: {
          delete: "abc123",
        },
      } as unknown as Request;

      const status = sinon.stub().returnsThis();
      const json = sinon.stub();

      const res = {
        status,
        json,
      } as unknown as Response;

      const next = sinon.stub();

      await deleteEvidenceFile(req, res, next as unknown as NextFunction);

      expect(unlinkSync.calledWith(path.resolve(uploadDir, "abc123"))).to.equal(
        true,
      );
      expect(status.calledWith(200)).to.equal(true);
      expect(json.firstCall.args[0]).to.deep.equal({ success: true });
      expect(next.called).to.equal(false);

      existsSync.restore();
      unlinkSync.restore();
    });

    it("returns 400 for an invalid file path", async () => {
      const req = {
        body: {
          delete: "../secret-file",
        },
      } as unknown as Request;

      const status = sinon.stub().returnsThis();
      const json = sinon.stub();

      const res = {
        status,
        json,
      } as unknown as Response;

      const next = sinon.stub();

      await deleteEvidenceFile(req, res, next as unknown as NextFunction);

      expect(status.calledWith(400)).to.equal(true);
      expect(json.firstCall.args[0]).to.deep.equal({
        error: "Invalid file path",
      });
      expect(next.called).to.equal(false);
    });
  });

  describe("linkEvidenceToLineItem", () => {
    it("should link evidence to line item and redirect when selection made", async () => {
      req.params = {
        claimId: "1",
        lineItemId: "1",
      };

      req.body = {
        documents: ["1"],
      };

      const mockApiResponse = linkLineItemToEvidenceResponseData;

      linkEvidenceStub.resolves(mockApiResponse);

      await linkEvidenceToLineItem(req as Request, res as Response, next);

      expect(linkEvidenceStub.calledOnce).to.be.true;
      expect(linkEvidenceStub.calledWith(req.axiosMiddleware)).to.be.true;
      expect(renderStub.calledOnce).to.be.false;
      expect(res.redirect.calledWith("/claims/1/upload-evidence-individually"))
        .to.be.true;
    });

    it("should redirect when no selection made", async () => {
      req.params = {
        claimId: "1",
        lineItemId: "1",
      };

      req.body = {
        documents: [],
      };

      await linkEvidenceToLineItem(req as Request, res as Response, next);

      expect(linkEvidenceStub.calledOnce).to.be.false;
      expect(renderStub.calledOnce).to.be.false;
      expect(res.redirect.calledWith("/claims/1/upload-evidence-individually"))
        .to.be.true;
    });

    it("should ignore empty document IDs", async () => {
      req.params = {
        claimId: "1",
        lineItemId: "1",
      };

      req.body = {
        documents: [""],
      };

      await linkEvidenceToLineItem(req as Request, res as Response, next);

      expect(linkEvidenceStub.calledOnce).to.be.false;
      expect(renderStub.calledOnce).to.be.false;
      expect(res.redirect.calledWith("/claims/1/upload-evidence-individually"))
        .to.be.true;
    });

    it("should redirect to appropriate page when no claim is returned", async () => {
      req.params = {
        claimId: "1",
        lineItemId: "1",
      };

      req.body = {
        documents: ["1"],
      };

      const mockApiResponse: ApiResponse<null> = {
        status: "error",
        statusCode: 404,
        message: "not found",
      };

      linkEvidenceStub.resolves(mockApiResponse);

      await linkEvidenceToLineItem(req as Request, res as Response, next);

      expect(linkEvidenceStub.calledOnce).to.be.true;
      expect(linkEvidenceStub.calledWith(req.axiosMiddleware)).to.be.true;
      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.instanceOf(HttpError);
      expect(next.firstCall.args[0].message).to.include("not found");
    });

    it("should delegate API errors to Express error handling middleware with user-friendly message", async () => {
      req.params = {
        claimId: "1",
        lineItemId: "1",
      };

      req.body = {
        documents: ["1"],
      };

      const error = new Error("API Error");
      linkEvidenceStub.rejects(error);

      await linkEvidenceToLineItem(req as Request, res as Response, next);

      expect(linkEvidenceStub.calledOnce).to.be.true;
      expect(linkEvidenceStub.calledWith(req.axiosMiddleware)).to.be.true;
      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.instanceOf(Error);
      expect(next.firstCall.args[0].message).to.include("API Error");
    });
  });
});
