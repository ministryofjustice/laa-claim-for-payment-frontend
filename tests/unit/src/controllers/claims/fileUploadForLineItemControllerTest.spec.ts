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
  fileUploadForLineItemPage,
  linkEvidenceToLineItem,
} from "#src/controllers/claims/fileUploadForLineItemController.js";
import { AjaxUploadResponse, ApiResponse } from "#src/types/api-types.js";
import { Claim } from "#src/types/Claim.js";
import { HttpError } from "http-errors";
import { DeleteFileRequest, MulterRequest } from "#src/types/requests.js";
import { TFunction } from "#node_modules/i18next/index.js";
import { uploadService } from "#src/services/uploadService.js";
import { unlinkEvidenceFileFromLineItem, uploadEvidenceFileForLineItem } from "#src/controllers/claims/ajaxFileUploadController.js";

describe("View File Upload For Line Item Controller", () => {
  let res: any;
  let next: any;
  let renderStub: sinon.SinonStub;
  let getClaimStub: sinon.SinonStub;
  let linkEvidenceStub: sinon.SinonStub;
  let uploadLineItemEvidenceStub: sinon.SinonStub;
  let unlinkEvidenceFromLineItemStub: sinon.SinonStub;

  const mockT: TFunction = ((key: string) => key) as TFunction;

  beforeEach(() => {
    renderStub = sinon.stub();

    res = {
      render: renderStub,
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
      redirect: sinon.spy(),
      locals: {
        csrfToken: "test-csrf-token",
      },
    };

    next = sinon.stub();

    getClaimStub = sinon.stub(claimService, "getClaim");
    linkEvidenceStub = sinon.stub(uploadService, "linkEvidenceToLineItem");
    uploadLineItemEvidenceStub = sinon.stub(
      uploadService,
      "uploadLineItemEvidence",
    );
    unlinkEvidenceFromLineItemStub = sinon.stub(
      uploadService,
      "unlinkEvidenceFromLineItem",
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("fileUploadForLineItemPage", () => {
    let req: Partial<Request>;

    beforeEach(() => {
      req = {
        params: {
          claimId: "1",
          lineItemId: "1"
        },
        path: "/claims/1/upload-evidence-individually/3/file-upload",
      };
    });

    it("should render view of the file upload for line item page with data and correct template", async () => {
      getClaimStub.resolves(getClaimSuccessResponseData);

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

      await fileUploadForLineItemPage(req as Request, res as Response, next);

      expect(getClaimStub.calledOnce).to.be.true;
      expect(getClaimStub.calledWith(req.axiosMiddleware)).to.be.true;
      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.instanceOf(HttpError);
      expect(next.firstCall.args[0].message).to.include("not found");
    });

    it("should delegate API errors to Express error handling middleware with user-friendly message", async () => {
      const error = new Error("API Error");
      getClaimStub.rejects(error);

      await fileUploadForLineItemPage(req as Request, res as Response, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.instanceOf(Error);
      expect(next.firstCall.args[0].message).to.include("API Error");
    });

    it("should return NOT_FOUND status if no line item exists for the claim", async () => {
      req = {
        path: "/claims/1/upload-evidence-individually/3/file-upload",
        params: { claimId: "1", lineItemId: "3" },
      };

      getClaimStub.resolves(getClaimSuccessResponseData);

      await fileUploadForLineItemPage(req as Request, res as Response, next);

      expect(getClaimStub.calledOnce).to.be.true;
      expect(getClaimStub.calledWith(req.axiosMiddleware)).to.be.true;
      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.instanceOf(HttpError);
      expect(next.firstCall.args[0].message).to.include(
        "Line item 3 not found",
      );
    });
  });

  describe("uploadEvidenceFile", () => {
    let req: MulterRequest;

    beforeEach(() => {
      req = {
        params: {
          claimId: "1",
          lineItemId: "2",
        },
        t: mockT,
      } as unknown as MulterRequest
    });

    it("returns uploaded file details when a file is uploaded", async () => {
      const mockApiResponse: ApiResponse<AjaxUploadResponse> = {
        status: "success",
        body: {
          success: {
            messageText: "evidence.pdf uploaded",
            messageHtml: "<span>Uploaded</span>",
          },
          file: {
            filename: "1",
            originalname: "evidence.pdf",
          },
        },
      };

      uploadLineItemEvidenceStub.resolves(mockApiResponse);

      req.file = {
        filename: "abc123",
        originalname: "evidence.pdf",
        size: 12345,
        mimetype: "application/pdf",
        buffer: Buffer.from("fake pdf content"),
      } as unknown as Express.Multer.File;

      const status = sinon.stub().returnsThis();
      const json = sinon.stub();

      const res = {
        status,
        json,
      } as unknown as Response;

      const next = sinon.stub();

      await uploadEvidenceFileForLineItem(req, res, next as unknown as NextFunction);

      expect(uploadLineItemEvidenceStub.calledOnce).to.equal(true);

      expect(json.calledOnce).to.equal(true);

      const responseBody = json.firstCall.args[0];

      expect(responseBody).to.deep.equal(mockApiResponse.body);

      expect(status.called).to.equal(false);
      expect(next.called).to.equal(false);
    });

    it("returns 400 when no file is uploaded", async () => {
      req.file = undefined;

      const status = sinon.stub().returnsThis();
      const json = sinon.stub();

      const res = {
        status,
        json,
      } as unknown as Response;

      const next = sinon.stub();

      await uploadEvidenceFileForLineItem(req, res, next as unknown as NextFunction);

      expect(status.calledWith(400)).to.equal(true);
      expect(json.firstCall.args[0]).to.deep.equal({
        error: {
          message: "multiFileUpload.errors.noFileSelected",
        },
      });
      expect(next.called).to.equal(false);
    });
  });

  describe("deleteEvidenceFile", () => {
    let req: DeleteFileRequest;

    beforeEach(() => {
      req = {
        params: {
          claimId: "1",
          lineItemId: "1"
        },
        t: mockT,
      } as unknown as DeleteFileRequest;
    });

    it("deletes an uploaded file", async () => {
      const mockApiResponse = {
        status: "success",
        body: null,
      };

      unlinkEvidenceFromLineItemStub.resolves(mockApiResponse);

      req.body = {
        delete: "5",
        name: "file.pdf",
      };

      const status = sinon.stub().returnsThis();
      const json = sinon.stub();

      const res = {
        status,
        json,
      } as unknown as Response;

      const next = sinon.stub();

      await unlinkEvidenceFileFromLineItem(req, res, next as unknown as NextFunction);

      expect(unlinkEvidenceFromLineItemStub.calledOnce).to.equal(true);

      expect(json.calledOnce).to.equal(true);

      const responseBody = json.firstCall.args[0];

      expect(responseBody).to.deep.equal(mockApiResponse);

      expect(status.called).to.equal(false);

      expect(next.called).to.equal(false);
    });

    it("returns 400 for an empty file ID", async () => {
      req.body = {
        delete: "",
        name: "file.pdf",
      };

      const status = sinon.stub().returnsThis();
      const json = sinon.stub();

      const res = {
        status,
        json,
      } as unknown as Response;

      const next = sinon.stub();

      await unlinkEvidenceFileFromLineItem(req, res, next as unknown as NextFunction);

      expect(status.calledWith(400)).to.equal(true);
      expect(json.firstCall.args[0]).to.deep.equal({
        error: {
          message: "multiFileUpload.errors.missingFileId",
        },
      });
      expect(next.called).to.equal(false);
    });
  });

  describe("linkEvidenceToLineItem", () => {
    let req: Partial<Request>;

    beforeEach(() => {
      req = {
        params: {
          claimId: "1",
          lineItemId: "1"
        },
      };
    });

    it("should link evidence to line item and redirect when selection made", async () => {
      req.body = {
        documents: ["1"],
      };

      linkEvidenceStub.resolves(linkLineItemToEvidenceResponseData);

      await linkEvidenceToLineItem(req as Request, res as Response, next);

      expect(linkEvidenceStub.calledOnce).to.be.true;
      expect(linkEvidenceStub.calledWith(req.axiosMiddleware)).to.be.true;
      expect(renderStub.calledOnce).to.be.false;
      expect(res.redirect.calledWith("/claims/1/upload-evidence-individually"))
        .to.be.true;
    });

    it("should redirect when no selection made", async () => {
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
