import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "mocha";
import sinon from "sinon";
import type { NextFunction, Request, Response } from "express";
import {
  deleteEvidenceFileFromClaim,
  getFileRow,
  unlinkEvidenceFileFromLineItem,
  uploadEvidenceFile,
  uploadEvidenceFileForLineItem,
} from "#src/controllers/claims/ajaxFileUploadController.js";
import type { DeleteFileRequest, MulterRequest } from "#src/types/requests.js";
import { uploadService } from "#src/services/uploadService.js";
import type { TFunction } from "#node_modules/i18next/index.js";
import { V7Generator } from "uuidv7";
import { ApiResponse } from "#src/types/api-types.js";
import { ClaimStatus } from "#src/types/Claim.js";
import nunjucks from "nunjucks";
import { UploadSuccess } from "#src/generated/claim-api/index.js";

describe("ajaxFileUploadController", () => {
  let res: Response;
  let next: NextFunction;

  const mockT: TFunction = ((key: string) => key) as TFunction;

  const claimId = new V7Generator().generate();
  const lineItemId = new V7Generator().generate();
  const evidenceId = new V7Generator().generate();

  beforeEach(() => {
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
      render: sinon.stub(),
    } as unknown as Response;

    next = sinon.stub() as unknown as NextFunction;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("uploadEvidenceFile", () => {
    let req: MulterRequest;
    let uploadEvidenceStub: sinon.SinonStub;
    let nunjucksRenderStub: sinon.SinonStub;

    beforeEach(() => {
      req = {
        params: {
          claimId: claimId.toString(),
        },
        query: {
          claimStatus: ClaimStatus.DRAFT,
        },
        t: mockT,
        file: {
          filename: "abc123",
          originalname: "evidence.pdf",
          size: 12345,
          mimetype: "application/pdf",
          buffer: Buffer.from("fake pdf content"),
        } as Express.Multer.File,
      } as unknown as MulterRequest;

      uploadEvidenceStub = sinon.stub(uploadService, "uploadEvidence");

      nunjucksRenderStub = sinon.stub(nunjucks, "render");
    });

    it("returns 400 when no file is selected", async () => {
      req.file = undefined;

      await uploadEvidenceFile(req, res, next);

      expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
      expect((res.json as sinon.SinonStub).firstCall.args[0]).to.deep.equal({
        status: "error",
        error: {
          message: "multiFileUpload.errors.noFileSelected",
        },
      });
      expect(uploadEvidenceStub.called).to.equal(false);
      expect((next as sinon.SinonStub).called).to.equal(false);
    });

    it("returns 400 when claim status is undefined", async () => {
      req.query = {};

      await uploadEvidenceFile(req, res, next);

      expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
      expect((res.json as sinon.SinonStub).firstCall.args[0]).to.deep.equal({
        status: "error",
        error: {
          message: "multiFileUpload.errors.invalidClaimStatus",
        },
      });
      expect(uploadEvidenceStub.called).to.equal(false);
      expect((next as sinon.SinonStub).called).to.equal(false);
    });

    it("returns 400 when claim status is invalid", async () => {
      req.query = { claimStatus: "foo" };

      await uploadEvidenceFile(req, res, next);

      expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
      expect((res.json as sinon.SinonStub).firstCall.args[0]).to.deep.equal({
        status: "error",
        error: {
          message: "multiFileUpload.errors.invalidClaimStatus",
        },
      });
      expect(uploadEvidenceStub.called).to.equal(false);
      expect((next as sinon.SinonStub).called).to.equal(false);
    });

    it("returns 400 when selected file is empty", async () => {
      req.file = {
        originalname: "empty.pdf",
        size: 0,
        mimetype: "application/pdf",
        buffer: Buffer.from(""),
      } as Express.Multer.File;

      await uploadEvidenceFile(req, res, next);

      expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
      expect((res.json as sinon.SinonStub).firstCall.args[0]).to.deep.equal({
        status: "error",
        error: {
          message: "multiFileUpload.errors.emptyFile",
        },
      });
      expect(uploadEvidenceStub.called).to.equal(false);
      expect((next as sinon.SinonStub).called).to.equal(false);
    });

    it("uploads POA evidence successfully", async () => {
      const mockApiResponse: ApiResponse<UploadSuccess> = {
        status: "success",
        body: {
          evidenceId: evidenceId.toString(),
          file: {
            filename: "evidence.pdf",
            originalname: "evidence.pdf",
            filesize: 12345,
          },
          message: "File uploaded",
          type: "success",
        },
      };

      const dummyHtml = "<span>Rendered upload row</span>";

      uploadEvidenceStub.resolves(mockApiResponse);
      nunjucksRenderStub.returns(dummyHtml);

      await uploadEvidenceFile(req, res, next);

      expect(uploadEvidenceStub.calledOnce).to.equal(true);
      expect(uploadEvidenceStub.calledWith(req.axiosMiddleware)).to.equal(true);
      expect(uploadEvidenceStub.firstCall.args[1]).to.deep.equal(claimId);
      expect(uploadEvidenceStub.firstCall.args[2]).to.equal(req.file);

      expect((res.json as sinon.SinonStub).calledOnce).to.equal(true);
      const jsonArgs = (res.json as sinon.SinonStub).firstCall.args[0];
      expect(jsonArgs.success.messageText).to.equal("multiFileUpload.uploadedMessage");
      expect(jsonArgs.success.messageHtml).to.equal(dummyHtml);
      expect(jsonArgs.file.id).to.equal(evidenceId.toString());
      expect(jsonArgs.file.name).to.equal("evidence.pdf");
      expect(jsonArgs.file.size).to.equal("12KB");

      expect((res.status as sinon.SinonStub).called).to.equal(false);
      expect((next as sinon.SinonStub).called).to.equal(false);
    });

    it("returns 500 when upload fails", async () => {
      const mockApiResponse: ApiResponse<UploadSuccess> = {
        status: "error",
        statusCode: 500,
        message: "Upload failed",
      };

      uploadEvidenceStub.resolves(mockApiResponse);

      await uploadEvidenceFile(req, res, next);

      expect(uploadEvidenceStub.calledOnce).to.equal(true);
      expect(uploadEvidenceStub.calledWith(req.axiosMiddleware)).to.equal(true);
      expect(uploadEvidenceStub.firstCall.args[1]).to.deep.equal(claimId);
      expect(uploadEvidenceStub.firstCall.args[2]).to.equal(req.file);

      const jsonArgs = (res.json as sinon.SinonStub).firstCall.args[0];
      expect(jsonArgs.error.message).to.equal("multiFileUpload.errors.uploadFailed");

      expect((res.status as sinon.SinonStub).calledWith(500)).to.equal(true);
      expect((next as sinon.SinonStub).called).to.equal(false);
    });
  });

  describe("uploadEvidenceFileForLineItem", () => {
    let req: MulterRequest;
    let uploadLineItemEvidenceStub: sinon.SinonStub;
    let nunjucksRenderStub: sinon.SinonStub;

    beforeEach(() => {
      req = {
        params: {
          claimId: claimId.toString(),
          lineItemId: lineItemId.toString(),
        },
        t: mockT,
      } as unknown as MulterRequest;

      uploadLineItemEvidenceStub = sinon.stub(
        uploadService,
        "uploadLineItemEvidence",
      );

      nunjucksRenderStub = sinon.stub(nunjucks, "render");
    });

    it("returns 400 when no file is selected", async () => {
      req.file = undefined;

      await uploadEvidenceFileForLineItem(req, res, next);

      expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
      expect((res.json as sinon.SinonStub).firstCall.args[0]).to.deep.equal({
        status: "error",
        error: {
          message: "multiFileUpload.errors.noFileSelected",
        },
      });
      expect(uploadLineItemEvidenceStub.called).to.equal(false);
      expect((next as sinon.SinonStub).called).to.equal(false);
    });

    it("returns 400 when selected file is empty", async () => {
      req.file = {
        originalname: "empty.pdf",
        size: 0,
        mimetype: "application/pdf",
        buffer: Buffer.from(""),
      } as Express.Multer.File;

      await uploadEvidenceFileForLineItem(req, res, next);

      expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
      expect((res.json as sinon.SinonStub).firstCall.args[0]).to.deep.equal({
        status: "error",
        error: {
          message: "multiFileUpload.errors.emptyFile",
        },
      });
      expect(uploadLineItemEvidenceStub.called).to.equal(false);
      expect((next as sinon.SinonStub).called).to.equal(false);
    });

    it("uploads line item evidence successfully", async () => {
      const mockApiResponse: ApiResponse<UploadSuccess> = {
        status: "success",
        body: {
          evidenceId: evidenceId.toString(),
          file: {
            filename: "evidence.pdf",
            originalname: "evidence.pdf",
            filesize: 12345,
          },
          message: "File uploaded",
          type: "success",
        },
      };

      const dummyHtml = "<span>Rendered upload row</span>";

      uploadLineItemEvidenceStub.resolves(mockApiResponse);
      nunjucksRenderStub.returns(dummyHtml);

      req.file = {
        filename: evidenceId.toString(),
        originalname: "evidence.pdf",
        size: 12345,
        mimetype: "application/pdf",
        buffer: Buffer.from("fake pdf content"),
      } as Express.Multer.File;

      await uploadEvidenceFileForLineItem(req, res, next);

      expect(uploadLineItemEvidenceStub.calledOnce).to.equal(true);
      expect(
        uploadLineItemEvidenceStub.calledWith(req.axiosMiddleware),
      ).to.equal(true);
      expect(uploadLineItemEvidenceStub.firstCall.args[1]).to.deep.equal(
        claimId,
      );
      expect(uploadLineItemEvidenceStub.firstCall.args[2]).to.deep.equal(
        lineItemId,
      );
      expect(uploadLineItemEvidenceStub.firstCall.args[3]).to.equal(req.file);

      const jsonArgs = (res.json as sinon.SinonStub).firstCall.args[0];
      expect(jsonArgs.success.messageText).to.equal("multiFileUpload.uploadedMessage");
      expect(jsonArgs.success.messageHtml).to.equal(dummyHtml);
      expect(jsonArgs.file.id).to.equal(evidenceId.toString());
      expect(jsonArgs.file.name).to.equal("evidence.pdf");
      expect(jsonArgs.file.size).to.equal("12KB");

      expect((res.status as sinon.SinonStub).called).to.equal(false);
      expect((next as sinon.SinonStub).called).to.equal(false);
    });

    it("returns 500 when upload fails", async () => {
      const mockApiResponse: ApiResponse<UploadSuccess> = {
        status: "error",
        statusCode: 500,
        message: "Upload failed",
      };

      uploadLineItemEvidenceStub.resolves(mockApiResponse);

      req.file = {
        filename: evidenceId.toString(),
        originalname: "evidence.pdf",
        size: 12345,
        mimetype: "application/pdf",
        buffer: Buffer.from("fake pdf content"),
      } as Express.Multer.File;

      await uploadEvidenceFileForLineItem(req, res, next);

      expect(uploadLineItemEvidenceStub.calledOnce).to.equal(true);
      expect(
        uploadLineItemEvidenceStub.calledWith(req.axiosMiddleware),
      ).to.equal(true);
      expect(uploadLineItemEvidenceStub.firstCall.args[1]).to.deep.equal(
        claimId,
      );
      expect(uploadLineItemEvidenceStub.firstCall.args[2]).to.deep.equal(
        lineItemId,
      );
      expect(uploadLineItemEvidenceStub.firstCall.args[3]).to.equal(req.file);

      const jsonArgs = (res.json as sinon.SinonStub).firstCall.args[0];
      expect(jsonArgs.error.message).to.equal("multiFileUpload.errors.uploadFailed");

      expect((res.status as sinon.SinonStub).calledWith(500)).to.equal(true);
      expect((next as sinon.SinonStub).called).to.equal(false);
    });
  });

  describe("deleteEvidenceFileFromClaim", () => {
    let req: DeleteFileRequest;
    let deleteEvidenceFromClaimStub: sinon.SinonStub;

    beforeEach(() => {
      req = {
        params: {
          claimId: claimId.toString(),
        },
        body: {
          delete: evidenceId.toString(),
        },
        query: {
          claimStatus: ClaimStatus.SUBMITTED,
        },
        t: mockT,
      } as unknown as MulterRequest;

      deleteEvidenceFromClaimStub = sinon.stub(
        uploadService,
        "deleteEvidenceFromClaim",
      );
    });

    it("returns 400 when no file is selected", async () => {
      req.body.delete = "";

      await deleteEvidenceFileFromClaim(req, res, next);

      expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
      expect((res.json as sinon.SinonStub).firstCall.args[0]).to.deep.equal({
        status: "error",
        error: {
          message: "multiFileUpload.errors.missingFileId",
        },
      });
      expect(deleteEvidenceFromClaimStub.called).to.equal(false);
      expect((next as sinon.SinonStub).called).to.equal(false);
    });

    it("returns 400 when claim status is undefined", async () => {
      req.query = {};

      await deleteEvidenceFileFromClaim(req, res, next);

      expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
      expect((res.json as sinon.SinonStub).firstCall.args[0]).to.deep.equal({
        status: "error",
        error: {
          message: "multiFileUpload.errors.invalidClaimStatus",
        },
      });
      expect(deleteEvidenceFromClaimStub.called).to.equal(false);
      expect((next as sinon.SinonStub).called).to.equal(false);
    });

    it("returns 400 when claim status is invalid", async () => {
      req.query = { claimStatus: "foo" };

      await deleteEvidenceFileFromClaim(req, res, next);

      expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
      expect((res.json as sinon.SinonStub).firstCall.args[0]).to.deep.equal({
        status: "error",
        error: {
          message: "multiFileUpload.errors.invalidClaimStatus",
        },
      });
      expect(deleteEvidenceFromClaimStub.called).to.equal(false);
      expect((next as sinon.SinonStub).called).to.equal(false);
    });

    it("returns 200 when deletion succeeds", async () => {
      const mockApiResponse = {
        status: "success",
        body: null,
      };

      deleteEvidenceFromClaimStub.resolves(mockApiResponse);

      await deleteEvidenceFileFromClaim(req, res, next);

      expect(deleteEvidenceFromClaimStub.calledOnce).to.equal(true);
      expect(deleteEvidenceFromClaimStub.firstCall.args[1]).to.deep.equal(
        claimId,
      );
      expect(deleteEvidenceFromClaimStub.firstCall.args[2]).to.deep.equal(
        evidenceId,
      );
      expect(deleteEvidenceFromClaimStub.firstCall.args[3]).to.equal(
        ClaimStatus.SUBMITTED,
      );

      expect((res.json as sinon.SinonStub).calledOnce).to.equal(true);
      expect((res.json as sinon.SinonStub).firstCall.args[0]).to.deep.equal(
        mockApiResponse,
      );

      expect((res.status as sinon.SinonStub).called).to.equal(false);
      expect((next as sinon.SinonStub).called).to.equal(false);
    });

    it("returns 500 when deletion fails", async () => {
      const mockApiResponse = {
        status: "error",
        body: {
          status: "error",
          statusCode: 502,
          message: "A dependent service returned an error.",
        },
      };

      deleteEvidenceFromClaimStub.resolves(mockApiResponse);

      await deleteEvidenceFileFromClaim(req, res, next);

      expect((res.status as sinon.SinonStub).calledWith(500)).to.equal(true);
      expect((res.json as sinon.SinonStub).firstCall.args[0]).to.deep.equal({
        status: "error",
        error: {
          message: "multiFileUpload.errors.deleteFailed",
        },
      });
      expect(deleteEvidenceFromClaimStub.calledOnce).to.equal(true);
      expect(deleteEvidenceFromClaimStub.firstCall.args[1]).to.deep.equal(
        claimId,
      );
      expect(deleteEvidenceFromClaimStub.firstCall.args[2]).to.deep.equal(
        evidenceId,
      );
      expect(deleteEvidenceFromClaimStub.firstCall.args[3]).to.equal(
        ClaimStatus.SUBMITTED,
      );
      expect((next as sinon.SinonStub).called).to.equal(false);
    });
  });

  describe("unlinkEvidenceFileFromLineItem", () => {
    let req: DeleteFileRequest;
    let unlinkEvidenceFromLineItemStub: sinon.SinonStub;

    beforeEach(() => {
      req = {
        params: {
          claimId: claimId.toString(),
          lineItemId: lineItemId.toString(),
        },
        body: {
          delete: evidenceId.toString(),
        },
        t: mockT,
      } as unknown as MulterRequest;

      unlinkEvidenceFromLineItemStub = sinon.stub(
        uploadService,
        "unlinkEvidenceFromLineItem",
      );
    });

    it("returns 400 when no file is selected", async () => {
      req.body.delete = "";

      await unlinkEvidenceFileFromLineItem(req, res, next);

      expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
      expect((res.json as sinon.SinonStub).firstCall.args[0]).to.deep.equal({
        status: "error",
        error: {
          message: "multiFileUpload.errors.missingFileId",
        },
      });
      expect(unlinkEvidenceFromLineItemStub.called).to.equal(false);
      expect((next as sinon.SinonStub).called).to.equal(false);
    });

    it("returns 200 when deletion succeeds", async () => {
      const mockApiResponse = {
        status: "success",
        body: null,
      };

      unlinkEvidenceFromLineItemStub.resolves(mockApiResponse);

      await unlinkEvidenceFileFromLineItem(req, res, next);

      expect(unlinkEvidenceFromLineItemStub.calledOnce).to.equal(true);
      expect(unlinkEvidenceFromLineItemStub.firstCall.args[1]).to.deep.equal(
        claimId,
      );
      expect(unlinkEvidenceFromLineItemStub.firstCall.args[2]).to.deep.equal(
        lineItemId,
      );
      expect(unlinkEvidenceFromLineItemStub.firstCall.args[3]).to.deep.equal(
        evidenceId,
      );

      expect((res.json as sinon.SinonStub).calledOnce).to.equal(true);
      expect((res.json as sinon.SinonStub).firstCall.args[0]).to.deep.equal(
        mockApiResponse,
      );

      expect((res.status as sinon.SinonStub).called).to.equal(false);
      expect((next as sinon.SinonStub).called).to.equal(false);
    });

    it("returns 500 when deletion fails", async () => {
      const mockApiResponse = {
        status: "error",
        body: {
          status: "error",
          statusCode: 502,
          message: "A dependent service returned an error.",
        },
      };

      unlinkEvidenceFromLineItemStub.resolves(mockApiResponse);

      await unlinkEvidenceFileFromLineItem(req, res, next);

      expect((res.status as sinon.SinonStub).calledWith(500)).to.equal(true);
      expect((res.json as sinon.SinonStub).firstCall.args[0]).to.deep.equal({
        status: "error",
        error: {
          message: "multiFileUpload.errors.deleteFailed",
        },
      });
      expect(unlinkEvidenceFromLineItemStub.calledOnce).to.equal(true);
      expect(unlinkEvidenceFromLineItemStub.firstCall.args[1]).to.deep.equal(
        claimId,
      );
      expect(unlinkEvidenceFromLineItemStub.firstCall.args[2]).to.deep.equal(
        lineItemId,
      );
      expect(unlinkEvidenceFromLineItemStub.firstCall.args[3]).to.deep.equal(
        evidenceId,
      );
      expect((next as sinon.SinonStub).called).to.equal(false);
    });
  });

  describe("getFileRow", () => {
    let req: Partial<Request>;

    describe("uploaded", () => {
      const status = "uploaded";

      it("gets an uploaded row", () => {
        req = {
          query: {
            status,
            fileName: "evidence.pdf",
            fileId: evidenceId.toString(),
            fileSize: "123KB",
          },
        };

        getFileRow(req as Request, res, next);

        expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
        expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
          "components/uploadRow.njk",
        );
        const renderArgs = (res.render as sinon.SinonStub).lastCall.args[1];
        expect(renderArgs.status).to.equal(status);
        expect(renderArgs.file.id).to.equal(evidenceId.toString());
        expect(renderArgs.file.name).to.equal("evidence.pdf");
        expect(renderArgs.file.size).to.equal("123KB");
        expect(renderArgs.file.message).to.be.undefined;
      });
    });

    describe("uploading", () => {
      const status = "uploading";

      it("gets an uploading row", () => {
        req = {
          query: {
            status,
            fileName: "evidence.pdf",
          },
        };

        getFileRow(req as Request, res, next);

        expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
        expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
          "components/uploadRow.njk",
        );
        const renderArgs = (res.render as sinon.SinonStub).lastCall.args[1];
        expect(renderArgs.status).to.equal(status);
        expect(renderArgs.file.id).to.be.undefined;
        expect(renderArgs.file.name).to.equal("evidence.pdf");
        expect(renderArgs.file.size).to.be.undefined;
        expect(renderArgs.file.message).to.be.undefined;
      });
    });

    describe("uploadFailed", () => {
      const status = "uploadFailed";

      it("gets a failed upload row", () => {
        req = {
          query: {
            status,
            fileName: "evidence.pdf",
            message: "Upload failed",
          },
        };

        getFileRow(req as Request, res, next);

        expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
        expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
          "components/uploadRow.njk",
        );
        const renderArgs = (res.render as sinon.SinonStub).lastCall.args[1];
        expect(renderArgs.status).to.equal(status);
        expect(renderArgs.file.id).to.be.undefined;
        expect(renderArgs.file.name).to.equal("evidence.pdf");
        expect(renderArgs.file.size).to.be.undefined;
        expect(renderArgs.file.message).to.equal("Upload failed");
      });
    });

    describe("deleteFailed", () => {
      const status = "deleteFailed";

      it("gets a failed delete row", () => {
        req = {
          query: {
            status,
            fileName: "evidence.pdf",
            fileId: evidenceId.toString(),
            message: "Delete failed. Try again.",
          },
        };

        getFileRow(req as Request, res, next);

        expect((res.render as sinon.SinonStub).calledOnce).to.equal(true);
        expect((res.render as sinon.SinonStub).firstCall.args[0]).to.equal(
          "components/uploadRow.njk",
        );
        const renderArgs = (res.render as sinon.SinonStub).lastCall.args[1];
        expect(renderArgs.status).to.equal(status);
        expect(renderArgs.file.id).to.equal(evidenceId.toString());
        expect(renderArgs.file.name).to.equal("evidence.pdf");
        expect(renderArgs.file.size).to.be.undefined;
        expect(renderArgs.file.message).to.equal("Delete failed. Try again.");
      });
    });
  });
});
