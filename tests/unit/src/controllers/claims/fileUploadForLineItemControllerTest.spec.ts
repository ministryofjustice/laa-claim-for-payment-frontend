import { afterEach, beforeEach, describe, it } from "mocha";
import { expect } from "chai";
import * as sinon from "sinon";
import type { Request, Response, NextFunction } from "express";
import "#utils/axiosSetup.js";
import { claimService } from "#src/services/claimService.js";
import { getClaimSuccessResponseData } from "#tests/assets/getClaimsResponseData.js";
import { fileUploadForLineItemPage } from "#src/controllers/claims/fileUploadForLineItemController.js";
import { uploadEvidenceFile } from "#src/controllers/claims/fileUploadForLineItemController.js";
import { deleteEvidenceFile, uploadDir } from '#src/controllers/claims/fileUploadForLineItemController.js'
import { ApiResponse } from "#src/types/api-types.js";
import { Claim } from "#src/types/Claim.js";
import { viewClaimPage } from "#src/controllers/claims/viewClaimController.js";
import fs from 'node:fs';
import path from 'node:path';
import { HttpError } from "http-errors";

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
    locals: {
      csrfToken: 'test-csrf-token',
    },
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
      expect(renderStub.calledOnce).to.be.true;
      expect(renderStub.firstCall.args[0]).to.equal("main/claims/fileUploadForLineItemView.njk",);
      expect(renderStub.firstCall.args[1]).to.have.property("vm");

    });

    it("should redirect to appropriate page when no claim is returned", async () => {
      const mockApiResponse: ApiResponse<Claim> = {
        status: "error",
        statusCode: 404,
        message: "not found"
      };

      claimServiceStub.resolves(mockApiResponse);

      // Act
      await viewClaimPage(req as Request, res as Response, next);

      // Assert
      expect(claimServiceStub.calledOnce).to.be.true;
      expect(claimServiceStub.calledWith(req.axiosMiddleware)).to.be.true;
      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.instanceOf(HttpError);
      expect(next.firstCall.args[0].message).to.include("not found");
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
      expect(next.firstCall.args[0].message).to.include("API Error");
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
    });

    it("returns 400 when no file is uploaded", async() =>{
      const req = {} as Request;
      const status = sinon.stub().returnsThis();
      const json = sinon.stub();

      const res = {
        status,
        json,
      } as unknown as Response;

      const next = sinon.stub();

      await uploadEvidenceFile(
        req,
        res,
        next as unknown as NextFunction,
      );

      expect(status.calledWith(400)).to.equal(true);
      expect(json.calledWith({
        error: { message: 'No file uploaded' },
      })).to.equal(true);
      expect(next.called).to.equal(false);
    });

    it("returns uploaded file details when a file is uploaed", async() => {
      const req = {
        file: {
          filename: 'abc123',
          originalname: 'evidence.pdf',
          size: 12345,
        },
      } as Request;

      const status = sinon.stub().returnsThis();
      const json = sinon.stub();

      const res = {
        status,
        json,
      } as unknown as Response;

      const next = sinon.stub();

      await uploadEvidenceFile(
        req,
        res,
        next as unknown as NextFunction,
      );

      expect(json.calledOnce).to.equal(true);

      expect(json.firstCall.args[0]).to.deep.equal({
        file: {
          filename: "abc123",
          originalname: "evidence.pdf"
        },
        success: {
          messageHtml: "\n        <a href=\"#\" class=\"govuk-link\">evidence.pdf</a>\n        <span class=\"govuk-!-margin-left-2\">12KB</span>\n        <strong class=\"govuk-tag govuk-tag--green govuk-!-margin-left-4\">Uploaded</strong>\n        ",
          messageText: "evidence.pdf uploaded",
        }
      });
      expect(status.called).to.equal(false);
      expect(next.called).to.equal(false);
    })

    it('deletes an uploaded file', async () => {
      const existsSync = sinon.stub(fs, 'existsSync').returns(true);
      const unlinkSync = sinon.stub(fs, 'unlinkSync');

      const req = {
        body: {
          delete: 'abc123',
        },
      } as unknown as Request;

      const status = sinon.stub().returnsThis();
      const json = sinon.stub();

      const res = {
        status,
        json,
      } as unknown as Response;

      const next = sinon.stub();

      await deleteEvidenceFile(
        req,
        res,
        next as unknown as NextFunction,
      );

      expect(unlinkSync.calledWith(path.resolve(uploadDir, 'abc123'))).to.equal(true);
      expect(status.calledWith(200)).to.equal(true);
      expect(json.firstCall.args[0]).to.deep.equal({ success: true });
      expect(next.called).to.equal(false);

      existsSync.restore();
      unlinkSync.restore();
    });
  })

  it('returns 400 for an invalid file path', async () => {
    const req = {
      body: {
        delete: '../secret-file',
      },
    } as unknown as Request;

    const status = sinon.stub().returnsThis();
    const json = sinon.stub();

    const res = {
      status,
      json,
    } as unknown as Response;

    const next = sinon.stub();

    await deleteEvidenceFile(
      req,
      res,
      next as unknown as NextFunction,
    );

    expect(status.calledWith(400)).to.equal(true);
    expect(json.firstCall.args[0]).to.deep.equal({
      error: 'Invalid file path',
    });
    expect(next.called).to.equal(false);
  });
  
})
